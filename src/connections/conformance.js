'use strict';

const {
  STANDARD_ID,
  MCP_PROTOCOL_VERSION,
  REQUIRED_METHODS,
  validateConnector,
  publicDefinition
} = require('./contract');

function test(name, passed, detail = null, status = null) {
  return { name, passed: Boolean(passed), status: status || (passed ? 'PASS' : 'FAIL'), detail };
}

async function runConnectorConformance(connector, { scope = 'contract' } = {}) {
  const startedAtUtc = new Date().toISOString();
  const checks = [];
  const validation = validateConnector(connector);
  checks.push(test('definition-and-interface', validation.valid, validation.errors));

  if (!validation.valid) {
    return {
      standard: STANDARD_ID,
      protocolVersion: connector && connector.definition && connector.definition.protocolVersion || null,
      connection: connector && connector.definition ? publicDefinition(connector.definition) : null,
      scope,
      status: 'FAIL',
      readiness: 'INVALID',
      checks,
      startedAtUtc,
      completedAtUtc: new Date().toISOString()
    };
  }

  for (const method of REQUIRED_METHODS) {
    checks.push(test(`method:${method}`, typeof connector[method] === 'function'));
  }

  let connectResult = null;
  let authResult = null;
  let capabilitiesResult = null;
  let healthResult = null;

  try {
    connectResult = await connector.connect();
    checks.push(test('connect-contract', Boolean(connectResult && connectResult.connected), connectResult));
  } catch (error) {
    checks.push(test('connect-contract', false, error.code || error.message));
  }

  try {
    authResult = await connector.authenticate();
    const safe = authResult && authResult.secretExposed !== true;
    checks.push(test('authentication-secret-boundary', safe, authResult));
  } catch (error) {
    checks.push(test('authentication-secret-boundary', false, error.code || error.message));
  }

  try {
    capabilitiesResult = await connector.capabilities({ probe: false });
    checks.push(test('capabilities-contract', Boolean(capabilitiesResult), capabilitiesResult));
  } catch (error) {
    checks.push(test('capabilities-contract', false, error.code || error.message));
  }

  try {
    healthResult = await connector.health({ probe: false });
    checks.push(test('health-contract', Boolean(healthResult), healthResult));
  } catch (error) {
    checks.push(test('health-contract', false, error.code || error.message));
  }

  if (connector.kind === 'mcp') {
    checks.push(test(
      'mcp-modern-protocol-version',
      connector.definition.protocolVersion === MCP_PROTOCOL_VERSION,
      connector.definition.protocolVersion
    ));
    checks.push(test('mcp-stateless-core', Boolean(connectResult && connectResult.stateless && connectResult.handshakeRequired === false), connectResult));
  }

  if (scope === 'runtime-probe') {
    if (connector.kind !== 'mcp') {
      checks.push(test('runtime-probe-supported', false, 'Only MCP discovery/list probing is included in this conformance slice.', 'REVIEW'));
    } else {
      try {
        const discovered = await connector.invoke({ method: 'server/discover' });
        checks.push(test('mcp-server-discover', Boolean(discovered && discovered.result), discovered && discovered.result));
      } catch (error) {
        checks.push(test('mcp-server-discover', false, error.code || error.message));
      }
      try {
        const listed = await connector.invoke({ method: 'tools/list' });
        const validList = Boolean(listed && listed.result && Array.isArray(listed.result.tools));
        checks.push(test('mcp-tools-list', validList, listed && listed.result));
      } catch (error) {
        checks.push(test('mcp-tools-list', false, error.code || error.message));
      }
    }
  }

  try {
    const disconnected = await connector.disconnect();
    checks.push(test('disconnect-contract', Boolean(disconnected && disconnected.disconnected), disconnected));
  } catch (error) {
    checks.push(test('disconnect-contract', false, error.code || error.message));
  }

  const failed = checks.filter((item) => item.status === 'FAIL').length;
  const review = checks.filter((item) => item.status === 'REVIEW').length;
  const configured = !authResult || authResult.authenticated !== false || connector.definition.authentication.method === 'none';

  return {
    standard: STANDARD_ID,
    protocolVersion: connector.definition.protocolVersion || null,
    connection: publicDefinition(connector.definition),
    scope,
    status: failed > 0 ? 'FAIL' : review > 0 ? 'REVIEW' : 'PASS',
    readiness: configured ? (scope === 'runtime-probe' ? 'PROBED' : 'CONTRACT_READY') : 'NOT_CONFIGURED',
    summary: {
      total: checks.length,
      passed: checks.filter((item) => item.status === 'PASS').length,
      failed,
      review
    },
    checks,
    startedAtUtc,
    completedAtUtc: new Date().toISOString(),
    productionClaim: false,
    productionBoundary: 'Conformance establishes only the tested contract/probe scope. Production requires deployed runtime evidence, real authorization, live health, audit persistence, and domain-specific verification.'
  };
}

async function runConformanceSuite(connectors, options = {}) {
  const targets = Array.isArray(connectors) ? connectors : [];
  const scope = options.scope || 'contract';
  if (scope === 'runtime-probe' && targets.length === 0) {
    return {
      standard: STANDARD_ID,
      status: 'REVIEW',
      readiness: 'NO_PROBE_TARGETS',
      results: [],
      generatedAtUtc: new Date().toISOString(),
      productionClaim: false,
      productionBoundary: 'No configured MCP connectors were available to probe; no interoperability evidence was produced.'
    };
  }

  const results = [];
  for (const connector of targets) results.push(await runConnectorConformance(connector, options));
  return {
    standard: STANDARD_ID,
    status: results.every((result) => result.status === 'PASS') ? 'PASS' : results.some((result) => result.status === 'FAIL') ? 'FAIL' : 'REVIEW',
    results,
    generatedAtUtc: new Date().toISOString(),
    productionClaim: false
  };
}

module.exports = { runConnectorConformance, runConformanceSuite };
