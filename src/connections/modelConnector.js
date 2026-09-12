'use strict';

const {
  CONNECTION_CLASSES,
  assertHumanApproval,
  publicDefinition
} = require('./contract');

function createModelConnector({ provider, adapter, connectorId, authEnv, version = '1.0.0' }) {
  if (!provider || !adapter || typeof adapter.generate !== 'function') {
    throw new Error('invalid_model_connector_configuration');
  }

  const configured = () => typeof adapter.isConfigured === 'function' ? Boolean(adapter.isConfigured()) : Boolean(authEnv && process.env[authEnv]);
  const nativeCapabilities = () => typeof adapter.capabilities === 'function' ? adapter.capabilities() : null;

  const definition = {
    id: connectorId,
    platform: provider,
    adapter: `${provider}-model-adapter`,
    connectionClass: CONNECTION_CLASSES.MODEL,
    protocol: 'provider-api',
    protocolVersion: null,
    authentication: {
      method: 'environment-secret',
      configured: configured()
    },
    capabilities: ['invoke.generate', 'health.configuration', 'provenance.provider-request-id'],
    permissions: {
      read: ['model.capabilities', 'model.health'],
      invoke: ['generate'],
      write: []
    },
    humanApprovalRequired: false,
    environment: process.env.NODE_ENV || 'development',
    version,
    rateLimits: null,
    auditPolicy: 'Record provider, model, connector id, provider request id when available, and OMOS run provenance.',
    verificationPolicy: 'Provider completion is not factual verification; OMOS verification remains a separate stage.'
  };

  return {
    kind: 'model',
    definition,

    async connect() {
      definition.authentication.configured = configured();
      return { connected: true, transport: 'provider-api', configured: definition.authentication.configured };
    },

    async authenticate() {
      definition.authentication.configured = configured();
      return {
        authenticated: definition.authentication.configured,
        method: definition.authentication.method,
        secretExposed: false
      };
    },

    async capabilities() {
      const native = nativeCapabilities();
      return {
        connection: publicDefinition(definition),
        providerCapabilities: native || { provider, configured: configured() }
      };
    },

    async health({ probe = false } = {}) {
      definition.authentication.configured = configured();
      return {
        ok: definition.authentication.configured,
        state: definition.authentication.configured ? (probe ? 'configured_probe_not_invoked' : 'configured_untested') : 'not_configured',
        probePerformed: false,
        paidProviderCallPerformed: false
      };
    },

    async invoke({ operation = 'generate', input, prompt, context = {}, options = {}, authorization = {} } = {}) {
      if (operation !== 'generate') throw new Error('model_operation_not_supported');
      assertHumanApproval(definition, operation, authorization);
      if (!configured()) throw new Error(`${provider}_not_configured`);
      const result = await adapter.generate({ prompt: prompt || input, context, options });
      return {
        connectionId: definition.id,
        provider,
        operation,
        result,
        verification: 'unverified_model_output'
      };
    },

    async disconnect() {
      return { disconnected: true, stateless: true };
    }
  };
}

module.exports = { createModelConnector };
