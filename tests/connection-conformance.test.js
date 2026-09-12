'use strict';

const assert = require('assert');
const http = require('http');
const {
  STANDARD_ID,
  MCP_PROTOCOL_VERSION,
  CONNECTION_CLASSES,
  validateConnectionDefinition
} = require('../src/connections/contract');
const { createMcpConnector } = require('../src/connections/mcpConnector');
const { modelConnectors, parseExternalDefinitions } = require('../src/connections/registry');
const { runConnectorConformance, runConformanceSuite } = require('../src/connections/conformance');

async function withMockMcpServer(run) {
  const observed = [];
  const server = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    observed.push({ headers: req.headers, body });

    const protocol = req.headers['mcp-protocol-version'];
    const method = req.headers['mcp-method'];
    const mirrored = req.headers['mcp-name'];
    const expectedName = body.params && (body.params.name || body.params.uri || body.params.taskId);

    function rpcError(code, message) {
      res.statusCode = 400;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ jsonrpc: '2.0', id: body.id, error: { code, message } }));
    }

    if (protocol !== MCP_PROTOCOL_VERSION || method !== body.method) return rpcError(-32020, 'HeaderMismatch');
    if (expectedName && mirrored !== String(expectedName)) return rpcError(-32020, 'HeaderMismatch');
    if (!body.params || !body.params._meta || !body.params._meta['io.modelcontextprotocol/clientInfo']) {
      return rpcError(-32602, 'Missing client metadata');
    }

    let result;
    if (body.method === 'server/discover') {
      result = {
        protocolVersion: MCP_PROTOCOL_VERSION,
        supportedProtocolVersions: [MCP_PROTOCOL_VERSION],
        capabilities: { tools: {}, resources: {} },
        serverInfo: { name: 'omos-mcp-conformance-mock', version: '1.0.0' }
      };
    } else if (body.method === 'tools/list') {
      result = { tools: [{ name: 'echo', description: 'Conformance echo', inputSchema: { type: 'object' } }] };
    } else if (body.method === 'resources/list') {
      result = { resources: [] };
    } else if (body.method === 'tools/call') {
      result = { content: [{ type: 'text', text: String(body.params.arguments && body.params.arguments.text || 'ok') }] };
    } else {
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ jsonrpc: '2.0', id: body.id, error: { code: -32601, message: 'Method not found' } }));
      return;
    }

    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ jsonrpc: '2.0', id: body.id, result }));
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  try {
    await run({ endpoint: `http://127.0.0.1:${address.port}/mcp`, observed });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function main() {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'test';

  try {
    const invalid = validateConnectionDefinition({});
    assert.equal(invalid.valid, false, 'invalid connection definitions must fail');
    assert(invalid.errors.includes('id_required'));

    const suite = await runConformanceSuite(modelConnectors(), { scope: 'contract' });
    assert.equal(suite.standard, STANDARD_ID);
    assert.equal(suite.status, 'PASS', JSON.stringify(suite, null, 2));
    assert.equal(suite.results.length, 4);
    assert.deepEqual(suite.results.map((result) => result.connection.connectionClass), ['model', 'model', 'model', 'model']);
    assert(suite.results.every((result) => result.productionClaim === false));

    const emptyProbe = await runConformanceSuite([], { scope: 'runtime-probe' });
    assert.equal(emptyProbe.status, 'REVIEW', 'zero-target probe must not report PASS');
    assert.equal(emptyProbe.readiness, 'NO_PROBE_TARGETS');

    assert.throws(
      () => parseExternalDefinitions(JSON.stringify([{ id: 'bad', platform: 'bad', endpoint: 'https://example.com/mcp', token: 'do-not-allow' }])),
      /embedded_secret_prohibited/
    );

    await withMockMcpServer(async ({ endpoint, observed }) => {
      const connector = createMcpConnector({
        id: 'OMOS-CONN-MOCK-MCP-0001',
        platform: 'MCP Conformance Mock',
        endpoint,
        connectionClass: CONNECTION_CLASSES.ACTION,
        humanApprovalRequired: true,
        capabilities: ['server.discover', 'tools.list', 'tools.call', 'tasks.update', 'tasks.cancel'],
        permissions: {
          read: ['server/discover', 'tools/list'],
          invoke: ['tools/call'],
          write: ['tasks/update', 'tasks/cancel']
        }
      });

      const contract = await runConnectorConformance(connector, { scope: 'contract' });
      assert.equal(contract.status, 'PASS', JSON.stringify(contract, null, 2));
      assert.equal(contract.protocolVersion, MCP_PROTOCOL_VERSION);
      assert.equal(contract.productionClaim, false);

      const probed = await runConnectorConformance(connector, { scope: 'runtime-probe' });
      assert.equal(probed.status, 'PASS', JSON.stringify(probed, null, 2));
      assert(probed.checks.some((item) => item.name === 'mcp-server-discover' && item.passed));
      assert(probed.checks.some((item) => item.name === 'mcp-tools-list' && item.passed));

      const beforeBlockedCall = observed.length;
      await assert.rejects(
        connector.invoke({ method: 'tools/call', name: 'echo', arguments: { text: 'blocked' } }),
        /human_approval_required/
      );
      assert.equal(observed.length, beforeBlockedCall, 'blocked action must not reach MCP server');

      const beforeTaskMutation = observed.length;
      await assert.rejects(
        connector.invoke({ method: 'tasks/update', params: { taskId: 'task-1', status: 'done' } }),
        /human_approval_required/
      );
      await assert.rejects(
        connector.invoke({ method: 'tasks/cancel', params: { taskId: 'task-1' } }),
        /human_approval_required/
      );
      assert.equal(observed.length, beforeTaskMutation, 'unauthorized task mutations must not reach MCP server');

      const approved = await connector.invoke({
        method: 'tools/call',
        name: 'echo',
        arguments: { text: 'approved' },
        authorization: { approved: true, approvedBy: 'OMOS-CONFORMANCE-TEST' }
      });
      assert.equal(approved.result.content[0].text, 'approved');
      assert.equal(approved.sessionIdUsed, false);

      const call = observed.find((entry) => entry.body.method === 'tools/call');
      assert(call, 'approved tools/call must reach mock server');
      assert.equal(call.headers['mcp-protocol-version'], MCP_PROTOCOL_VERSION);
      assert.equal(call.headers['mcp-method'], 'tools/call');
      assert.equal(call.headers['mcp-name'], 'echo');
      assert.equal(call.headers['mcp-session-id'], undefined, '2026-07-28 connector must not emit legacy session header');
      assert(call.body.params._meta['io.modelcontextprotocol/clientInfo']);
      assert.equal(call.body.params._meta['io.modelcontextprotocol/protocolVersion'], MCP_PROTOCOL_VERSION);
      assert.equal(observed.some((entry) => entry.body.method === 'initialize'), false, 'modern connector must not initialize');

      const readOnly = createMcpConnector({
        id: 'OMOS-CONN-MOCK-READONLY-0001',
        platform: 'MCP Read Only Mock',
        endpoint,
        connectionClass: CONNECTION_CLASSES.DATA,
        humanApprovalRequired: false,
        capabilities: ['server.discover', 'tools.list'],
        permissions: {
          read: ['server/discover', 'tools/list'],
          invoke: [],
          write: []
        }
      });

      const beforePermissionDenied = observed.length;
      await assert.rejects(
        readOnly.invoke({ method: 'tools/call', name: 'echo', arguments: { text: 'must-not-run' } }),
        (error) => error && error.code === 'mcp_permission_denied'
      );
      assert.equal(observed.length, beforePermissionDenied, 'permission-denied call must be blocked before transport');

      const permittedRead = await readOnly.invoke({ method: 'tools/list' });
      assert(Array.isArray(permittedRead.result.tools), 'declared read permission must remain usable');
    });

    console.log('PASS OneGodian MCP Standard / Connection & Adaptation runtime conformance');
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
  }
}

main().catch((error) => {
  console.error(error && error.stack || error);
  process.exit(1);
});
