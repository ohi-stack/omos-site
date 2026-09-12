'use strict';

const openai = require('../adapters/openai');
const anthropic = require('../adapters/anthropic');
const gemini = require('../adapters/gemini');
const xai = require('../adapters/xai');
const { createModelConnector } = require('./modelConnector');
const { createMcpConnector } = require('./mcpConnector');
const { CONNECTION_CLASSES, publicDefinition } = require('./contract');

const MODEL_CONFIG = [
  { provider: 'openai', adapter: openai, connectorId: 'OMOS-CONN-OPENAI-ASTRA-0001', authEnv: 'OPENAI_API_KEY' },
  { provider: 'anthropic', adapter: anthropic, connectorId: 'OMOS-CONN-ANTHROPIC-0001', authEnv: 'ANTHROPIC_API_KEY' },
  { provider: 'gemini', adapter: gemini, connectorId: 'OMOS-CONN-GEMINI-0001', authEnv: 'GEMINI_API_KEY' },
  { provider: 'xai', adapter: xai, connectorId: 'OMOS-CONN-XAI-0001', authEnv: 'XAI_API_KEY' }
];

const PROHIBITED_SECRET_KEYS = new Set([
  'secret',
  'token',
  'password',
  'apikey',
  'api_key',
  'authorization',
  'bearer'
]);

function modelConnectors() {
  return MODEL_CONFIG.map((entry) => createModelConnector(entry));
}

function assertNoEmbeddedSecrets(value, index, path = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, itemIndex) => assertNoEmbeddedSecrets(entry, index, [...path, String(itemIndex)]));
    return;
  }
  if (!value || typeof value !== 'object') return;

  for (const [key, nested] of Object.entries(value)) {
    const normalized = String(key).toLowerCase();
    if (PROHIBITED_SECRET_KEYS.has(normalized)) {
      const location = [...path, key].join('.');
      const error = new Error(`mcp_connection_${index}_embedded_secret_prohibited`);
      error.code = 'embedded_secret_prohibited';
      error.path = location;
      throw error;
    }
    assertNoEmbeddedSecrets(nested, index, [...path, key]);
  }
}

function parseExternalDefinitions(raw = process.env.OMOS_MCP_CONNECTIONS_JSON) {
  if (!raw) return [];
  let parsed;
  try { parsed = JSON.parse(raw); }
  catch (_) { throw new Error('OMOS_MCP_CONNECTIONS_JSON_invalid_json'); }
  if (!Array.isArray(parsed)) throw new Error('OMOS_MCP_CONNECTIONS_JSON_array_required');

  return parsed.map((item, index) => {
    if (!item || typeof item !== 'object') throw new Error(`mcp_connection_${index}_object_required`);
    assertNoEmbeddedSecrets(item, index);
    return {
      id: item.id,
      platform: item.platform,
      endpoint: item.endpoint,
      connectionClass: item.connectionClass || CONNECTION_CLASSES.DATA,
      authEnv: item.authEnv || null,
      authHeader: item.authHeader || 'authorization',
      authScheme: item.authScheme === undefined ? 'Bearer' : item.authScheme,
      capabilities: Array.isArray(item.capabilities) ? item.capabilities : ['server.discover', 'tools.list', 'resources.list'],
      permissions: item.permissions || { read: ['server/discover', 'tools/list', 'resources/list'], invoke: [], write: [] },
      humanApprovalRequired: item.humanApprovalRequired !== false,
      version: item.version || '1.0.0',
      timeoutMs: Number(item.timeoutMs) > 0 ? Number(item.timeoutMs) : 10000
    };
  });
}

function externalMcpConnectors(raw) {
  return parseExternalDefinitions(raw).map((definition) => createMcpConnector(definition));
}

function allConnections({ includeExternal = true, raw } = {}) {
  const connections = modelConnectors();
  if (includeExternal) connections.push(...externalMcpConnectors(raw));
  return connections;
}

function getConnection(id, options = {}) {
  return allConnections(options).find((connector) => connector.definition.id === id) || null;
}

function sanitizedRegistry(options = {}) {
  return allConnections(options).map((connector) => ({
    kind: connector.kind,
    definition: publicDefinition(connector.definition),
    endpointOrigin: connector.endpointOrigin || null
  }));
}

module.exports = {
  MODEL_CONFIG,
  PROHIBITED_SECRET_KEYS,
  modelConnectors,
  assertNoEmbeddedSecrets,
  parseExternalDefinitions,
  externalMcpConnectors,
  allConnections,
  getConnection,
  sanitizedRegistry
};
