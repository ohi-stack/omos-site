'use strict';

const STANDARD_ID = 'OG-MCP-STD-1.0';
const CONNECTION_LAYER_VERSION = '1.0.0';
const MCP_PROTOCOL_VERSION = '2026-07-28';

const CONNECTION_CLASSES = Object.freeze({
  MODEL: 'model',
  DATA: 'data',
  ACTION: 'action',
  ENVIRONMENT: 'environment'
});

const REQUIRED_METHODS = Object.freeze([
  'connect',
  'authenticate',
  'capabilities',
  'health',
  'invoke',
  'disconnect'
]);

const OPTIONAL_METHODS = Object.freeze([
  'read',
  'search',
  'write',
  'subscribe',
  'cancel'
]);

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateConnectionDefinition(definition) {
  const errors = [];
  if (!isObject(definition)) return { valid: false, errors: ['definition_required'] };

  const requiredStrings = ['id', 'platform', 'adapter', 'connectionClass', 'protocol', 'version', 'environment'];
  for (const field of requiredStrings) {
    if (!nonEmptyString(definition[field])) errors.push(`${field}_required`);
  }

  if (definition.connectionClass && !Object.values(CONNECTION_CLASSES).includes(definition.connectionClass)) {
    errors.push('connectionClass_invalid');
  }

  if (!isObject(definition.authentication) || !nonEmptyString(definition.authentication.method)) {
    errors.push('authentication_method_required');
  }
  if (!isObject(definition.permissions)) errors.push('permissions_required');
  if (!Array.isArray(definition.capabilities)) errors.push('capabilities_array_required');
  if (typeof definition.humanApprovalRequired !== 'boolean') errors.push('humanApprovalRequired_boolean_required');
  if (!nonEmptyString(definition.auditPolicy)) errors.push('auditPolicy_required');
  if (!nonEmptyString(definition.verificationPolicy)) errors.push('verificationPolicy_required');

  return { valid: errors.length === 0, errors };
}

function validateConnector(connector) {
  const definitionResult = validateConnectionDefinition(connector && connector.definition);
  const errors = [...definitionResult.errors];

  if (!connector || typeof connector !== 'object') return { valid: false, errors: ['connector_required'] };
  for (const method of REQUIRED_METHODS) {
    if (typeof connector[method] !== 'function') errors.push(`${method}_method_required`);
  }

  return { valid: errors.length === 0, errors };
}

function approvalRequired(definition, operation = '') {
  if (!definition || definition.humanApprovalRequired !== true) return false;
  const normalized = String(operation || '').toLowerCase();
  if (!normalized) return true;
  if ([
    'tools/call',
    'write',
    'execute',
    'tasks/update',
    'tasks/cancel'
  ].includes(normalized)) return true;
  if (normalized.startsWith('action:') || normalized.startsWith('environment:')) return true;
  return false;
}

function assertHumanApproval(definition, operation, authorization = {}) {
  if (!approvalRequired(definition, operation)) return;
  const approved = authorization && authorization.approved === true;
  const approvedBy = authorization && nonEmptyString(authorization.approvedBy);
  if (!approved || !approvedBy) {
    const error = new Error('human_approval_required');
    error.code = 'human_approval_required';
    error.connectionId = definition.id;
    error.operation = operation;
    throw error;
  }
}

function publicDefinition(definition) {
  if (!definition) return null;
  return {
    id: definition.id,
    platform: definition.platform,
    adapter: definition.adapter,
    connectionClass: definition.connectionClass,
    protocol: definition.protocol,
    protocolVersion: definition.protocolVersion || null,
    authentication: {
      method: definition.authentication && definition.authentication.method || 'none',
      configured: Boolean(definition.authentication && definition.authentication.configured)
    },
    capabilities: Array.isArray(definition.capabilities) ? [...definition.capabilities] : [],
    permissions: definition.permissions || {},
    humanApprovalRequired: Boolean(definition.humanApprovalRequired),
    environment: definition.environment,
    version: definition.version,
    rateLimits: definition.rateLimits || null,
    auditPolicy: definition.auditPolicy,
    verificationPolicy: definition.verificationPolicy
  };
}

module.exports = {
  STANDARD_ID,
  CONNECTION_LAYER_VERSION,
  MCP_PROTOCOL_VERSION,
  CONNECTION_CLASSES,
  REQUIRED_METHODS,
  OPTIONAL_METHODS,
  validateConnectionDefinition,
  validateConnector,
  approvalRequired,
  assertHumanApproval,
  publicDefinition,
  nonEmptyString
};
