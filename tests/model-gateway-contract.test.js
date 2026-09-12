const assert = require('assert');

const PROVIDERS = [
  {
    name: 'openai',
    key: 'OPENAI_API_KEY',
    module: '../src/adapters/openai',
    connector: 'OMOS-CONN-OPENAI-ASTRA-0001',
    api: 'responses'
  },
  {
    name: 'anthropic',
    key: 'ANTHROPIC_API_KEY',
    module: '../src/adapters/anthropic',
    connector: 'OMOS-CONN-ANTHROPIC-CLAUDE-0001',
    api: 'messages'
  },
  {
    name: 'gemini',
    key: 'GEMINI_API_KEY',
    module: '../src/adapters/gemini',
    connector: 'OMOS-CONN-GOOGLE-GEMINI-0001',
    api: 'generateContent'
  },
  {
    name: 'xai',
    key: 'XAI_API_KEY',
    module: '../src/adapters/xai',
    connector: 'OMOS-CONN-XAI-GROK-0001',
    api: 'chat_completions'
  }
];

function fakeResponse(provider) {
  const payloads = {
    openai: {
      id: 'resp_openai_1',
      status: 'completed',
      model: 'gpt-6-astra',
      output_text: 'OpenAI contract output',
      output: [{ type: 'message', content: [{ type: 'output_text', text: 'OpenAI contract output' }] }],
      usage: { input_tokens: 10, output_tokens: 5, total_tokens: 15 }
    },
    anthropic: {
      id: 'msg_anthropic_1',
      model: 'claude-test',
      content: [{ type: 'text', text: 'Anthropic contract output' }],
      stop_reason: 'end_turn',
      usage: { input_tokens: 11, output_tokens: 6 }
    },
    gemini: {
      responseId: 'gemini_response_1',
      modelVersion: 'gemini-test',
      candidates: [{ content: { parts: [{ text: 'Gemini contract output' }] }, finishReason: 'STOP' }],
      usageMetadata: { promptTokenCount: 12, candidatesTokenCount: 7, totalTokenCount: 19 }
    },
    xai: {
      id: 'xai_response_1',
      model: 'grok-test',
      choices: [{ message: { content: 'xAI contract output' }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 13, completion_tokens: 8, total_tokens: 21 }
    }
  };
  return {
    ok: true,
    status: 200,
    async json() { return payloads[provider]; }
  };
}

function providerForUrl(url) {
  if (url.includes('api.openai.com')) return 'openai';
  if (url.includes('api.anthropic.com')) return 'anthropic';
  if (url.includes('generativelanguage.googleapis.com')) return 'gemini';
  if (url.includes('api.x.ai')) return 'xai';
  throw new Error(`unexpected_test_url:${url}`);
}

async function run() {
  const originalFetch = global.fetch;
  const previous = Object.fromEntries(PROVIDERS.map((p) => [p.key, process.env[p.key]]));

  try {
    PROVIDERS.forEach((p) => { process.env[p.key] = 'test-only-key'; });
    global.fetch = async (url) => fakeResponse(providerForUrl(url));

    for (const definition of PROVIDERS) {
      delete require.cache[require.resolve(definition.module)];
      const adapter = require(definition.module);
      assert.equal(adapter.isConfigured(), true, `${definition.name}: configured`);
      assert.equal(typeof adapter.selectedModel, 'function', `${definition.name}: selectedModel`);
      assert.equal(typeof adapter.capabilities, 'function', `${definition.name}: capabilities`);

      const caps = adapter.capabilities();
      assert.equal(caps.provider, definition.name, `${definition.name}: provider capability`);
      assert.equal(caps.connector, definition.connector, `${definition.name}: connector id`);
      assert.equal(caps.api, definition.api, `${definition.name}: api identity`);
      assert.equal(caps.configured, true, `${definition.name}: capability configured`);
      assert.equal(caps.omosAuthorization.consequentialExecution, false, `${definition.name}: execution boundary`);
      assert.equal(caps.omosAuthorization.humanApprovalRequired, true, `${definition.name}: human gate`);

      const result = await adapter.generate({
        prompt: 'Run the normalized OMOS Model Gateway contract test.',
        context: { requestId: 'omos_model_gateway_contract_test' }
      });

      assert.equal(result.provider, definition.name, `${definition.name}: provider`);
      assert.equal(result.connector, definition.connector, `${definition.name}: connector`);
      assert.equal(result.api, definition.api, `${definition.name}: api`);
      assert.ok(result.model, `${definition.name}: model`);
      assert.ok(result.output, `${definition.name}: output`);
      assert.equal(result.simulated, false, `${definition.name}: simulated`);
      assert.equal(typeof result.latencyMs, 'number', `${definition.name}: latency`);
      assert.ok(result.metadata, `${definition.name}: metadata`);
      assert.equal(result.metadata.humanApprovalRequired, true, `${definition.name}: metadata human gate`);
      assert.ok(Object.prototype.hasOwnProperty.call(result.metadata, 'providerRequestId'), `${definition.name}: request provenance`);
      assert.ok(Object.prototype.hasOwnProperty.call(result.metadata, 'providerStatus'), `${definition.name}: provider status`);
      assert.ok(Object.prototype.hasOwnProperty.call(result.metadata, 'usage'), `${definition.name}: usage provenance`);
    }

    console.log('OMOS Model Gateway normalized connector contract: PASS');
  } finally {
    global.fetch = originalFetch;
    for (const definition of PROVIDERS) {
      if (previous[definition.key] == null) delete process.env[definition.key];
      else process.env[definition.key] = previous[definition.key];
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
