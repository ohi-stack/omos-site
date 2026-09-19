(() => {
  const $ = (id) => document.getElementById(id);
  const state = { run: null, revision: 0, parentRequestId: null, provider: null };

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function selectedLenses() {
    return [...document.querySelectorAll('.lens input:checked')].map((input) => input.value);
  }

  function providerOpenAI(payload) {
    const list = payload?.providers || payload?.data?.providers || [];
    return Array.isArray(list)
      ? list.find((item) => String(item.provider || item.name || '').toLowerCase() === 'openai')
      : null;
  }

  async function loadProviderStatus() {
    try {
      const response = await fetch('/api/v1/providers', { headers: { accept: 'application/json' } });
      const payload = await response.json();
      const openai = providerOpenAI(payload);
      state.provider = openai;
      $('providerStatus').textContent = openai?.configured ? 'Configured' : openai ? 'Available / not configured' : 'Unavailable';
      $('providerModel').textContent = openai?.model || openai?.capabilities?.model || 'gpt-6-astra target';
    } catch (error) {
      $('providerStatus').textContent = 'Status unavailable';
      $('providerModel').textContent = 'gpt-6-astra target';
    }
  }

  function buildPrompt(question, lenses, steerText = '') {
    const lensText = lenses.length ? lenses.join(', ') : 'assumptions, counterfactuals, falsifiers, failure modes, evidence gaps, reversibility';
    const revisionContext = state.run
      ? `\n\nPRIOR ASTRA LAB RESULT (for revision context only):\n${state.run?.round1?.[0]?.output || ''}\n\nPRIOR REQUEST ID: ${state.run.requestId || ''}`
      : '';
    const steer = steerText ? `\n\nUSER STEERING UPDATE:\n${steerText}` : '';

    return `OMOS ASTRA LIVE DELIBERATION — OPENAI-ONLY DECISION STRESS TEST\n\nUSER QUESTION / DECISION:\n${question}\n\nACTIVE LENSES:\n${lensText}\n\nReturn a decision analysis with these exact top-level sections:\n1. DECISION FRAME\n2. ASSUMPTIONS\n3. EVIDENCE AND EVIDENCE GAPS\n4. COUNTERFACTUALS\n5. FALSIFIERS — WHAT WOULD CHANGE THE CONCLUSION\n6. FAILURE MODES\n7. REVERSIBLE NEXT ACTIONS\n8. APPROVAL-GATED OR IRREVERSIBLE ACTIONS\n9. CONFIDENCE MAP\n10. DECISION BOUNDARY\n\nRequirements:\n- Separate facts, assumptions, estimates, and unknowns.\n- Do not treat confidence as factual verification.\n- State where external evidence is needed.\n- Preserve uncertainty instead of hiding it.\n- Prefer reversible experiments before irreversible commitments where appropriate.\n- Do not claim multi-model consensus; this is an OpenAI-only OMOS lane.\n- Keep consequential actions subject to human approval.${revisionContext}${steer}`;
  }

  function metric(label, value) {
    return `<div class="metric"><b>${escapeHtml(label)}</b><span>${escapeHtml(value || '—')}</span></div>`;
  }

  function formatPercent(value) {
    const n = Number(value);
    return Number.isFinite(n) ? `${Math.round(n * 100)}%` : '—';
  }

  function renderRun(run) {
    state.run = run;
    const openai = (run.round1 || []).find((item) => item.provider === 'openai') || run.round1?.[0] || {};
    const persistence = run.persistence?.backend || (run.persistence?.durable ? 'durable' : 'unknown');
    const alignment = run.alignment || {};
    const score = formatPercent(alignment.overallScore);
    const verification = run.verificationStatus || run.governedOutput?.verificationState || 'not_factually_verified';

    $('output').innerHTML = `
      <div class="run-meta">
        ${metric('Model', openai.model || state.provider?.model || 'OpenAI')}
        ${metric('Request ID', run.requestId)}
        ${metric('Alignment', `${alignment.state || '—'} · ${score}`)}
        ${metric('Persistence', persistence)}
      </div>
      <div class="model-output">${escapeHtml(openai.output || 'No OpenAI model output was returned.')}</div>
      <div class="warning"><strong>Verification:</strong> ${escapeHtml(verification)} · <strong>Human Gate:</strong> ${escapeHtml(run.humanGate?.decision || 'REVIEW REQUIRED')} · This result is decision support and is not factual verification.</div>
      <div class="steer-box">
        <label for="steerInput">Steer the next revision</label>
        <textarea id="steerInput" placeholder="Example: New constraint: launch budget cannot exceed $5,000. Re-evaluate the plan without discarding valid work from the prior result."></textarea>
        <div class="controls">
          <button id="steerBtn" class="btn btn-secondary" type="button">Create Steered Revision</button>
        </div>
        <p class="note" style="margin-top:10px">Phase 1 steering creates a new traceable OMOS run linked to this request. Native in-flight Astra steering remains a separate Phase 2 server feature.</p>
      </div>`;

    $('steerBtn').addEventListener('click', () => {
      const text = $('steerInput').value.trim();
      if (!text) return;
      runDeliberation(text);
    });
  }

  function renderError(message) {
    $('output').innerHTML = `<div class="warning"><strong>Run failed:</strong> ${escapeHtml(message)}</div>`;
  }

  async function runDeliberation(steerText = '') {
    const apiKey = $('apiKey').value.trim();
    const question = $('question').value.trim();
    if (!apiKey) return renderError('Enter an OMOS API key.');
    if (!question) return renderError('Enter a question or decision to analyze.');

    const button = steerText ? $('steerBtn') : $('runBtn');
    if (button) button.disabled = true;
    if (!steerText) $('runBtn').textContent = 'Running…';

    try {
      const nextRevision = steerText ? state.revision + 1 : 1;
      const parentRequestId = steerText ? state.run?.requestId || state.parentRequestId : null;
      const prompt = buildPrompt(question, selectedLenses(), steerText);

      const response = await fetch('/api/v1/council/run', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          'x-omos-key': apiKey
        },
        body: JSON.stringify({
          prompt,
          providers: ['openai'],
          mode: 'auto',
          context: {
            feature: 'OMOS-ASTRA-LAB-0001',
            lane: 'openai_only',
            revision: nextRevision,
            parentRequestId,
            steeringMode: steerText ? 'revision' : 'initial',
            nativeMidTurnSteering: false,
            selectedLenses: selectedLenses()
          }
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || payload.error || `HTTP ${response.status}`);
      }
      const run = payload.data || payload;
      state.revision = nextRevision;
      state.parentRequestId = parentRequestId || run.requestId;
      renderRun(run);
    } catch (error) {
      renderError(error.message || 'Unknown error');
    } finally {
      if ($('runBtn')) {
        $('runBtn').disabled = false;
        $('runBtn').textContent = 'Run Astra Deliberation';
      }
      if ($('steerBtn')) $('steerBtn').disabled = false;
    }
  }

  $('runBtn').addEventListener('click', () => runDeliberation(''));
  $('clearBtn').addEventListener('click', () => {
    $('question').value = '';
    $('output').innerHTML = '<div class="empty">No run yet. The result will show the actual OpenAI model, OMOS request ID, alignment state, persistence state, and the model’s decision stress test.</div>';
    state.run = null;
    state.revision = 0;
    state.parentRequestId = null;
  });

  loadProviderStatus();
})();
