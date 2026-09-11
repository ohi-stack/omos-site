const assert = require('assert');

async function run() {
  const previousKey = process.env.OPENAI_API_KEY;
  const previousModel = process.env.OPENAI_MODEL;
  const previousAstraModel = process.env.OPENAI_ASTRA_MODEL;
  const previousEffort = process.env.OPENAI_ASTRA_REASONING_EFFORT;
  const previousFetch = global.fetch;

  try {
    process.env.OPENAI_API_KEY = 'test-only-key';
    delete process.env.OPENAI_MODEL;
    delete process.env.OPENAI_ASTRA_MODEL;
    process.env.OPENAI_ASTRA_REASONING_EFFORT = 'medium';

    const adapter = require('../src/adapters/openai');
    assert.equal(adapter.isConfigured(), true);
    assert.equal(adapter.selectedModel(), 'gpt-6-astra');
    assert.equal(adapter.selectedReasoningEffort(), 'medium');
    assert.equal(adapter.selectedReasoningEffort('max'), 'max');
    assert.equal(adapter.selectedReasoningEffort('none'), 'medium');

    const caps = adapter.capabilities();
    assert.equal(caps.connector, 'OMOS-CONN-OPENAI-ASTRA-0001');
    assert.equal(caps.api, 'responses');
    assert.equal(caps.model, 'gpt-6-astra');
    assert.equal(caps.modelCapabilities.computerUse, true);
    assert.equal(caps.omosAuthorization.consequentialExecution, false);
    assert.equal(caps.omosAuthorization.humanApprovalRequired, true);

    let captured;
    global.fetch = async (url, options) => {
      captured = { url, options, body: JSON.parse(options.body) };
      return {
        ok: true,
        status: 200,
        async json() {
          return {
            id: 'resp_test_123',
            status: 'completed',
            model: 'gpt-6-astra',
            output_text: 'Structured OMOS test output.',
            output: [{ type: 'message', content: [{ type: 'output_text', text: 'Structured OMOS test output.' }] }],
            usage: { input_tokens: 10, output_tokens: 5, total_tokens: 15 }
          };
        }
      };
    };

    const result = await adapter.generate({
      prompt: 'Evaluate this controlled test.',
      context: { requestId: 'omos_run_test_123' },
      options: { reasoningEffort: 'high' }
    });

    assert.equal(captured.url, 'https://api.openai.com/v1/responses');
    assert.equal(captured.body.model, 'gpt-6-astra');
    assert.deepEqual(captured.body.reasoning, { effort: 'high' });
    assert.equal(captured.body.metadata.omos_connector, 'OMOS-CONN-OPENAI-ASTRA-0001');
    assert.equal(captured.body.metadata.omos_run_id, 'omos_run_test_123');
    assert.equal(Object.prototype.hasOwnProperty.call(captured.body, 'temperature'), false);
    assert.equal(Object.prototype.hasOwnProperty.call(captured.body, 'top_p'), false);

    assert.equal(result.provider, 'openai');
    assert.equal(result.connector, 'OMOS-CONN-OPENAI-ASTRA-0001');
    assert.equal(result.model, 'gpt-6-astra');
    assert.equal(result.output, 'Structured OMOS test output.');
    assert.equal(result.metadata.providerRequestId, 'resp_test_123');
    assert.equal(result.metadata.reasoningEffort, 'high');
    assert.deepEqual(result.metadata.outputItemTypes, ['message']);
    assert.equal(result.metadata.usage.total_tokens, 15);

    global.fetch = async () => ({ ok: false, status: 429, async text() { return 'provider-secret-detail'; } });
    await assert.rejects(
      () => adapter.generate({ prompt: 'Rate limit test.', context: { requestId: 'omos_run_rate_limit' } }),
      (error) => error.message === 'openai_http_429' && !error.message.includes('provider-secret-detail')
    );

    console.log('GPT-6 Astra adapter contract: PASS');
  } finally {
    if (previousKey == null) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = previousKey;
    if (previousModel == null) delete process.env.OPENAI_MODEL; else process.env.OPENAI_MODEL = previousModel;
    if (previousAstraModel == null) delete process.env.OPENAI_ASTRA_MODEL; else process.env.OPENAI_ASTRA_MODEL = previousAstraModel;
    if (previousEffort == null) delete process.env.OPENAI_ASTRA_REASONING_EFFORT; else process.env.OPENAI_ASTRA_REASONING_EFFORT = previousEffort;
    global.fetch = previousFetch;
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});