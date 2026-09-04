const DEFAULT_MODEL = 'gpt-6-astra';
const RESPONSES_URL = 'https://api.openai.com/v1/responses';

function isConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

function isEnabled(name, fallback = false) {
  const value = process.env[name];
  if (value == null) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function capabilities() {
  return {
    provider: 'openai',
    connector: 'OMOS-CONN-OPENAI-ASTRA-0001',
    api: 'responses',
    model: process.env.OPENAI_ASTRA_MODEL || process.env.OPENAI_MODEL || DEFAULT_MODEL,
    configured: isConfigured(),
    tools: {
      webSearch: isEnabled('OMOS_ASTRA_WEB_SEARCH', false),
      fileSearch: isEnabled('OMOS_ASTRA_FILE_SEARCH', false),
      codeInterpreter: isEnabled('OMOS_ASTRA_CODE_INTERPRETER', false),
      computerUse: isEnabled('OMOS_ASTRA_COMPUTER_USE', false),
      hostedShell: isEnabled('OMOS_ASTRA_HOSTED_SHELL', false),
      mcp: isEnabled('OMOS_ASTRA_MCP', false),
      toolSearch: isEnabled('OMOS_ASTRA_TOOL_SEARCH', false)
    },
    humanApprovalRequired: isEnabled('OMOS_ASTRA_REQUIRE_HUMAN_APPROVAL', true),
    provenanceEnabled: isEnabled('OMOS_ASTRA_RECORD_PROVENANCE', true)
  };
}

function buildTools(options = {}) {
  const caps = capabilities();
  const tools = [];

  if (caps.tools.webSearch && options.allowWebSearch) {
    tools.push({ type: 'web_search_preview' });
  }

  if (caps.tools.fileSearch && options.vectorStoreIds?.length) {
    tools.push({ type: 'file_search', vector_store_ids: options.vectorStoreIds });
  }

  if (caps.tools.codeInterpreter && options.allowCodeInterpreter) {
    tools.push({ type: 'code_interpreter', container: { type: 'auto' } });
  }

  // Computer use, hosted shell, MCP, and custom/action tools are intentionally
  // not auto-attached here. OMOS must authorize those capabilities through its
  // Connection & Adaptation Layer and Human Gate before execution.
  return tools;
}

async function generate({ prompt, context = {}, options = {} }) {
  if (!isConfigured()) throw new Error('OPENAI_API_KEY_not_configured');

  const caps = capabilities();
  const model = caps.model;
  const reasoningEffort = options.reasoningEffort || process.env.OPENAI_ASTRA_REASONING_EFFORT || 'medium';
  const tools = buildTools(options);

  const body = {
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
      omos_connector: caps.connector,
      omos_run_id: String(context.runId || context.decisionId || 'unassigned').slice(0, 512)
    }
  };

  if (tools.length) body.tools = tools;

  const response = await fetch(RESPONSES_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`openai_http_${response.status}${detail ? `:${detail.slice(0, 300)}` : ''}`);
  }

  const data = await response.json();
  const text = data.output_text || (data.output || [])
    .flatMap((item) => item.content || [])
    .map((item) => item.text || '')
    .filter(Boolean)
    .join('\n');

  return {
    provider: 'openai',
    connector: caps.connector,
    api: 'responses',
    model: data.model || model,
    output: text,
    simulated: false,
    capabilities: caps,
    metadata: {
      providerRequestId: data.id || null,
      status: data.status || null,
      usage: data.usage || null,
      reasoningEffort,
      toolTypes: tools.map((tool) => tool.type),
      humanApprovalRequired: caps.humanApprovalRequired
    }
  };
}

module.exports = { isConfigured, capabilities, buildTools, generate };
