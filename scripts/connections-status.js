'use strict';

const { allConnections, sanitizedRegistry } = require('../src/connections/registry');
const { runConformanceSuite } = require('../src/connections/conformance');
const { STANDARD_ID, CONNECTION_LAYER_VERSION, MCP_PROTOCOL_VERSION } = require('../src/connections/contract');

async function main() {
  const probe = process.argv.includes('--probe');
  const all = allConnections();
  const targets = probe ? all.filter((connector) => connector.kind === 'mcp') : all;
  const conformance = await runConformanceSuite(targets, { scope: probe ? 'runtime-probe' : 'contract' });

  process.stdout.write(`${JSON.stringify({
    status: 'ok',
    standard: STANDARD_ID,
    connectionLayerVersion: CONNECTION_LAYER_VERSION,
    mcpProtocolVersion: MCP_PROTOCOL_VERSION,
    mode: probe ? 'runtime-probe' : 'contract',
    registry: sanitizedRegistry(),
    conformance,
    productionClaim: false
  }, null, 2)}\n`);

  if (conformance.status === 'FAIL') process.exitCode = 1;
}

main().catch((error) => {
  console.error(JSON.stringify({ status: 'error', error: error.code || error.message, productionClaim: false }, null, 2));
  process.exit(1);
});
