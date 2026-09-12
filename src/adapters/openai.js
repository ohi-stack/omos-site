const DEFAULT_MODEL = 'gpt-6-astra';
const CONNECTOR_ID = 'OMOS-CONN-OPENAI-ASTRA-0001';
const RESPONSES_URL = 'https://api.openai.com/v1/responses';
const ALLOWED_REASONING = new Set(['low', 'medium', 'high', 'xhigh', 'max']);

function isConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

function enabled(name, fallback = false) {
  const value = process.env[name];
  if (value == null) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function selectedModel() {
  return process.env.OPENAI_ASTRA_MODEL || process.env.OPENAI_MODEL || DEFAULT_MODEL;
}

function selectedReasoningEffort(override) {
  const requested = String(override || process.env.OPENAI_ASTRA_REASONING_EFFORT || 'medium').toLowerCase();
  return ALLOWED_REASONING.has(requested) ? requested : 'medium';
}

function capabilities() {
  return {
    provider: 'openai',
    connector: CONNECTOR_ID,
    api: 'responses',
    model: selectedModel(),
    configured: isConfigured(),
    modelCapabilities: {
      streaming: true,
      functionCalling: true,
      structuredOutputs: true,
      imageInput: true,
      webSearch: true,
      fileSearch: true,
      imageGeneration: true,
      codeInterpreter: true,
      hostedShell: true,
      applyPatch: true,
      skills: true,
      computerUse: true,
      mcp: true
    },
    omosAuthorization: {
      webSearch: enabled('OMOS_ASTRA_WEB_SEARCH', false),
      fileSearch: enabled('OMOS_ASTRA_FILE_SEARCH', false),
      codeInterpreter: enabled('OMOS_ASTRA_CODE_INTERPRETER', false),
      computerUse: enabled('OMOS_ASTRA_COMPUTER_USE', false),
      hostedShell: enabled('OMOS_ASTRA_HOSTED_SHELL', false),
      mcp: enabled('OMOS_ASTRA_MCP', false),
      consequentialExecution: false,
      humanApprovalRequired: enabled('OMOS_ASTRA_REQUIRE_HUMAN_APPROVAL', true)
    }
  };
}

function outputText(data) {
  if (data.output_text) return String(data.output_text);
  return (data.output || [])
    .flatMap((item) => item.content || [])
    .map((item) => item.text || '')
    .filter(Boolean)
    .join('\n');
}

async function generate({ prompt, context = {}, options = {} }) {
  if (!isConfigured()) throw new Error('OPENAI_API_KEY_not_configured');

  const model = selectedModel();
  const reasoningEffort = selectedReasoningEffort(options.reasoningEffort);
  const runId = String(context.requestId || context.runId || context.decisionId || 'unassigned').slice(0, 512);
  const startedAt = Date.now();

  const response = await fetch(RESPONSES_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      reasoning: { effort: reasoningEffort },
      input: [
        {
          role: 'system',
          content: [{
            type: 'input_text',
            text: 'You are the OpenAI participant in an OMOS Council independent analysis round. Return a concise, structured answer with claims, evidence needs, risks, uncertainties, and recommendations. Preserve meaningful dissent. Do not claim consensus or factual verification merely because models agree.'
          }]
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: `${prompt}\n\nOMOS Context:\n${JSON.stringify(context)}` }]
        }
      ],
      metadata: {
        omos_connector: CONNECTOR_ID,
        omos_run_id: runId
      }
    })
  });

  const latencyMs = Date.now() - startedAt;
  if (!response.ok) {
    throw new Error(`openai_http_${response.status}`);
  }

  const data = await response.json();
  return {
    provider: 'openai',
    connector: CONNECTOR_ID,
    api: 'responses',
    model: data.model || model,
    output: outputText(data),
    latencyMs,
    simulated: false,
    metadata: {
      providerRequestId: data.id || null,
      providerStatus: data.status || null,
      usage: data.usage || null,
      reasoningEffort,
      outputItemTypes: (data.output || []).map((item) => item.type).filter(Boolean),
      humanApprovalRequired: capabilities().omosAuthorization.humanApprovalRequired
    }
  };
}

module.exports = {
  isConfigured,
  capabilities,
  selectedModel,
  selectedReasoningEffort,
  generate
};
