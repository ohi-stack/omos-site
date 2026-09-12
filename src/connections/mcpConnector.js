'use strict';

const {
  MCP_PROTOCOL_VERSION,
  CONNECTION_CLASSES,
  assertHumanApproval,
  publicDefinition,
  nonEmptyString
} = require('./contract');

const MODERN_METHODS = new Set([
  'server/discover',
  'tools/list',
  'tools/call',
  'resources/list',
  'resources/read',
  'prompts/list',
  'prompts/get',
  'subscriptions/listen',
  'tasks/get',
  'tasks/update',
  'tasks/cancel'
]);

let requestSequence = 0;

function endpointAllowed(endpoint) {
  let parsed;
  try { parsed = new URL(endpoint); } catch (_) { return false; }
  if (parsed.protocol === 'https:') return true;
  const local = parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost' || parsed.hostname === '::1';
  return process.env.NODE_ENV !== 'production' && parsed.protocol === 'http:' && local;
}

function mirroredName(method, params = {}) {
  if (method === 'tools/call' || method === 'prompts/get') return params.name || null;
  if (method === 'resources/read') return params.uri || null;
  if (method === 'tasks/get' || method === 'tasks/update' || method === 'tasks/cancel') return params.taskId || null;
  return null;
}

function buildMeta(clientInfo, clientCapabilities = {}) {
  return {
    'io.modelcontextprotocol/protocolVersion': MCP_PROTOCOL_VERSION,
    'io.modelcontextprotocol/clientInfo': clientInfo,
    'io.modelcontextprotocol/clientCapabilities': clientCapabilities
  };
}

function declaredPermissionMethods(definition) {
  const permissions = definition && definition.permissions || {};
  return ['read', 'invoke', 'write'].flatMap((scope) => (
    Array.isArray(permissions[scope]) ? permissions[scope] : []
  ));
}

function permissionAllows(definition, method) {
  const requested = String(method || '').trim();
  if (!requested) return false;
  return declaredPermissionMethods(definition).some((entry) => {
    const allowed = String(entry || '').trim();
    if (!allowed) return false;
    if (allowed === '*' || allowed === requested) return true;
    if (allowed.endsWith('/*')) return requested.startsWith(allowed.slice(0, -1));
    return false;
  });
}

function assertPermission(definition, method) {
  if (permissionAllows(definition, method)) return;
  const error = new Error('mcp_permission_denied');
  error.code = 'mcp_permission_denied';
  error.connectionId = definition && definition.id || null;
  error.operation = method;
  throw error;
}

function validateRpcEnvelope(payload, requestId) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    const error = new Error('mcp_invalid_jsonrpc_response');
    error.code = 'mcp_invalid_jsonrpc_response';
    throw error;
  }
  if (payload.jsonrpc !== '2.0') {
    const error = new Error('mcp_invalid_jsonrpc_version');
    error.code = 'mcp_invalid_jsonrpc_version';
    throw error;
  }
  if (payload.id !== requestId) {
    const error = new Error('mcp_response_id_mismatch');
    error.code = 'mcp_response_id_mismatch';
    throw error;
  }
  const hasResult = Object.prototype.hasOwnProperty.call(payload, 'result');
  const hasError = Object.prototype.hasOwnProperty.call(payload, 'error');
  if (hasResult === hasError) {
    const error = new Error('mcp_invalid_jsonrpc_envelope');
    error.code = 'mcp_invalid_jsonrpc_envelope';
    throw error;
  }
}

function createMcpConnector({
  id,
  platform,
  endpoint,
  connectionClass = CONNECTION_CLASSES.DATA,
  authEnv = null,
  authHeader = 'authorization',
  authScheme = 'Bearer',
  capabilities = ['server.discover', 'tools.list', 'resources.list'],
  permissions = { read: ['server/discover', 'tools/list', 'resources/list'], invoke: [], write: [] },
  humanApprovalRequired = true,
  version = '1.0.0',
  timeoutMs = 10000,
  clientInfo = { name: 'omos-runtime', version: process.env.OMOS_VERSION || '1.1.0' }
} = {}) {
  if (!nonEmptyString(id) || !nonEmptyString(platform) || !endpointAllowed(endpoint)) {
    throw new Error('invalid_mcp_connector_configuration');
  }

  const authConfigured = () => !authEnv || Boolean(process.env[authEnv]);
  const definition = {
    id,
    platform,
    adapter: 'omos-mcp-2026-http',
    connectionClass,
    protocol: 'mcp',
    protocolVersion: MCP_PROTOCOL_VERSION,
    authentication: {
      method: authEnv ? 'environment-secret' : 'none',
      configured: authConfigured()
    },
    capabilities: [...capabilities],
    permissions,
    humanApprovalRequired: Boolean(humanApprovalRequired),
    environment: process.env.NODE_ENV || 'development',
    version,
    rateLimits: null,
    auditPolicy: 'Record connector id, MCP method/name, response status, request correlation id, and OMOS authorization disposition without secrets.',
    verificationPolicy: 'MCP transport success proves interoperability only; domain truth and consequential execution require separate verification and authorization.'
  };

  function authHeaders() {
    if (!authEnv) return {};
    const secret = process.env[authEnv];
    if (!secret) return {};
    const value = authScheme ? `${authScheme} ${secret}` : secret;
    return { [authHeader]: value };
  }

  async function request(method, params = {}, { authorization = {}, signal, clientCapabilities = {} } = {}) {
    if (method === 'initialize' || method === 'notifications/initialized') {
      throw new Error('legacy_mcp_initialize_not_supported');
    }
    if (!MODERN_METHODS.has(method)) throw new Error('mcp_method_not_supported');
    assertPermission(definition, method);
    assertHumanApproval(definition, method, authorization);
    if (!authConfigured()) throw new Error('mcp_authentication_not_configured');

    const name = mirroredName(method, params);
    const requestId = `omos-mcp-${Date.now()}-${++requestSequence}`;
    const requestParams = {
      ...params,
      _meta: {
        ...(params && params._meta || {}),
        ...buildMeta(clientInfo, clientCapabilities)
      }
    };

    const headers = {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
      'MCP-Protocol-Version': MCP_PROTOCOL_VERSION,
      'Mcp-Method': method,
      ...authHeaders()
    };
    if (name) headers['Mcp-Name'] = String(name);

    const timeoutController = new AbortController();
    const combinedSignal = signal ? AbortSignal.any([signal, timeoutController.signal]) : timeoutController.signal;
    const timer = setTimeout(() => timeoutController.abort(), timeoutMs);
    let response;
    let payload;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers,
        signal: combinedSignal,
        body: JSON.stringify({ jsonrpc: '2.0', id: requestId, method, params: requestParams })
      });

      const contentType = String(response.headers.get('content-type') || '').toLowerCase();
      if (contentType.includes('text/event-stream')) {
        const error = new Error('mcp_sse_response_requires_stream_handler');
        error.code = 'mcp_sse_response_requires_stream_handler';
        error.httpStatus = response.status;
        throw error;
      }

      try { payload = await response.json(); }
      catch (_) {
        if (timeoutController.signal.aborted && !(signal && signal.aborted)) {
          const timeoutError = new Error('mcp_request_timeout');
          timeoutError.code = 'mcp_request_timeout';
          throw timeoutError;
        }
        const error = new Error(`mcp_invalid_json_http_${response.status}`);
        error.code = 'mcp_invalid_json';
        error.httpStatus = response.status;
        throw error;
      }
    } catch (error) {
      if (timeoutController.signal.aborted && !(signal && signal.aborted) && error.code !== 'mcp_request_timeout') {
        const timeoutError = new Error('mcp_request_timeout');
        timeoutError.code = 'mcp_request_timeout';
        throw timeoutError;
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      const error = new Error(`mcp_http_${response.status}`);
      error.code = `mcp_http_${response.status}`;
      error.httpStatus = response.status;
      error.payload = payload;
      throw error;
    }

    validateRpcEnvelope(payload, requestId);
    if (payload.error) {
      const error = new Error(payload.error.message || 'mcp_rpc_error');
      error.code = payload.error.code;
      error.payload = payload.error;
      throw error;
    }

    return {
      requestId,
      method,
      name,
      protocolVersion: MCP_PROTOCOL_VERSION,
      result: payload.result,
      transport: 'streamable-http-stateless',
      sessionIdUsed: false
    };
  }

  return {
    kind: 'mcp',
    definition,
    endpointOrigin: new URL(endpoint).origin,

    async connect() {
      definition.authentication.configured = authConfigured();
      return {
        connected: true,
        stateless: true,
        handshakeRequired: false,
        protocolVersion: MCP_PROTOCOL_VERSION,
        authenticationConfigured: definition.authentication.configured
      };
    },

    async authenticate() {
      definition.authentication.configured = authConfigured();
      return {
        authenticated: definition.authentication.configured,
        method: definition.authentication.method,
        secretExposed: false
      };
    },

    async capabilities({ probe = false, authorization = {} } = {}) {
      if (!probe) return { connection: publicDefinition(definition), discovered: false };
      const discovered = await request('server/discover', {}, { authorization });
      return { connection: publicDefinition(definition), discovered: true, server: discovered.result };
    },

    async health({ probe = false, authorization = {} } = {}) {
      definition.authentication.configured = authConfigured();
      if (!definition.authentication.configured) {
        return { ok: false, state: 'authentication_not_configured', probePerformed: false };
      }
      if (!probe) {
        return { ok: true, state: 'configured_untested', probePerformed: false };
      }
      try {
        const result = await request('server/discover', {}, { authorization });
        return {
          ok: true,
          state: 'reachable_discovered',
          probePerformed: true,
          protocolVersion: MCP_PROTOCOL_VERSION,
          server: result.result || null
        };
      } catch (error) {
        return {
          ok: false,
          state: 'probe_failed',
          probePerformed: true,
          error: error.code || error.message
        };
      }
    },

    async invoke({ method, name, params = {}, arguments: args, authorization = {}, signal, clientCapabilities = {} } = {}) {
      const mergedParams = { ...params };
      if (name && !mergedParams.name) mergedParams.name = name;
      if (args !== undefined && mergedParams.arguments === undefined) mergedParams.arguments = args;
      return request(method, mergedParams, { authorization, signal, clientCapabilities });
    },

    async disconnect() {
      return { disconnected: true, stateless: true, sessionClosed: false };
    }
  };
}

module.exports = {
  createMcpConnector,
  endpointAllowed,
  mirroredName,
  buildMeta,
  declaredPermissionMethods,
  permissionAllows,
  assertPermission,
  validateRpcEnvelope,
  MODERN_METHODS
};
