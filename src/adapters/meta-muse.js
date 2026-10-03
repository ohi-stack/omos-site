const CONNECTOR_ID = 'OMOS-CONN-META-MUSE-0001';
const PROVIDER = 'meta/muse';
const LANE = 'social_marketing_reality';

function enabled(name, fallback = false) {
  const value = process.env[name];
  if (value == null) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}
function isConfigured() {
  return enabled('META_MUSE_ENABLED', false) && Boolean(process.env.META_MUSE_API_KEY) && Boolean(process.env.META_MUSE_API_URL);
}
function selectedModel() { return process.env.META_MUSE_MODEL || null; }
function capabilities() {
  return {
    provider: PROVIDER, lane: LANE, connector: CONNECTOR_ID, model: selectedModel(), configured: isConfigured(),
    modelCapabilities: {
      socialAnalysis: enabled('OMOS_MUSE_READ_SOCIAL', false),
      adsRead: enabled('OMOS_MUSE_READ_ADS', false),
      dmTriage: enabled('OMOS_MUSE_DM_TRIAGE', false),
      dmDrafting: enabled('OMOS_MUSE_DM_TRIAGE', false)
    },
    omosAuthorization: {
      adsWrite: false, dmSend: false, publish: false, consequentialExecution: false,
      factualVerificationAuthority: false,
      humanApprovalRequired: enabled('OMOS_MUSE_REQUIRE_HUMAN_APPROVAL', true)
    }
  };
}
async function generate({ prompt, context = {} }) {
  if (!isConfigured()) throw new Error('META_MUSE_not_configured');
  const startedAt = Date.now();
  const response = await fetch(process.env.META_MUSE_API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.META_MUSE_API_KEY}` },
    body: JSON.stringify({ model: selectedModel(), input: prompt, context, lane: LANE, mode: 'analysis_only', allowExternalWrites: false })
  });
  const latencyMs = Date.now() - startedAt;
  if (!response.ok) throw new Error(`meta_muse_http_${response.status}`);
  const data = await response.json();
  return {
    provider: PROVIDER, lane: LANE, connector: CONNECTOR_ID, model: data.model || selectedModel(),
    output: String(data.output || data.text || ''), signals: Array.isArray(data.signals) ? data.signals : [],
    uncertainties: Array.isArray(data.uncertainties) ? data.uncertainties : [],
    sourceScope: Array.isArray(data.sourceScope) ? data.sourceScope : [], latencyMs, simulated: false,
    metadata: { providerRequestId: data.id || data.requestId || null, humanApprovalRequired: capabilities().omosAuthorization.humanApprovalRequired, factualVerificationAuthority: false, externalWritesAllowed: false }
  };
}
module.exports = { PROVIDER, LANE, isConfigured, capabilities, selectedModel, generate };
