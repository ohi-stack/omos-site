(() => {
  const defaultStages = [
    { id: 1, label: 'Ask OMOS', status: 'PENDING' },
    { id: 2, label: 'Layer 1', status: 'PENDING' },
    { id: 3, label: 'Alignment', status: 'PENDING' },
    { id: 4, label: 'Council Review', status: 'PENDING' },
    { id: 5, label: 'Governed Synthesis', status: 'PENDING' },
    { id: 6, label: 'Human Gate', status: 'PENDING' },
    { id: 7, label: 'Decision Record', status: 'PENDING' }
  ];

  const $ = (id) => document.getElementById(id);
  const stageList = $('stageList');
  const runButton = $('runButton');
  const clearButton = $('clearButton');
  const prompt = $('prompt');
  const apiKey = $('apiKey');
  const mode = $('mode');
  const results = $('results');
  const errorBox = $('errorBox');
  const humanGate = $('humanGate');
  let currentRecord = null;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char]));
  }

  function renderStages(stages = defaultStages) {
    stageList.innerHTML = stages.map((stage) => `
      <div class="ask-stage" data-status="${escapeHtml(stage.status || 'PENDING')}">
        <div class="ask-stage-left"><span class="ask-stage-num">0${stage.id}</span><span class="ask-stage-name">${escapeHtml(stage.label)}</span></div>
        <span class="ask-stage-status">${escapeHtml(stage.status || 'PENDING')}</span>
      </div>`).join('');
  }

  function pills(items, formatter) {
    if (!items || !items.length) return '<span class="ask-pill">None recorded</span>';
    return items.slice(0, 12).map((item) => `<span class="ask-pill">${escapeHtml(formatter ? formatter(item) : item)}</span>`).join('');
  }

  function renderRecord(record) {
    currentRecord = record;
    $('runId').textContent = record.requestId;
    $('modeBadge').textContent = `${record.mode} · ${record.outputStatus}`;
    renderStages(record.stages || defaultStages);

    const l1 = record.layer1 || {};
    $('layer1').innerHTML = `
      <p><strong>Objective</strong><br>${escapeHtml(l1.objective || '')}</p>
      <p><strong>Canonical input</strong><br>${escapeHtml(l1.canonicalInput || '')}</p>
      <p><strong>Constraints</strong><br>${pills(l1.constraints)}</p>
      <p><strong>Ambiguities</strong><br>${pills(l1.ambiguities)}</p>
      <p><strong>Quarantined</strong><br>${pills(l1.quarantined)}</p>`;

    const align = record.alignment || {};
    const dims = align.dimensions || {};
    $('alignment').innerHTML = `
      <p><strong>State</strong><br>${escapeHtml(align.state || '')}</p>
      <p><strong>Overall</strong><br>${Math.round((align.overallScore || 0) * 100)}%</p>
      ${Object.entries(dims).map(([key, value]) => `<div style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06);padding:6px 0"><span>${escapeHtml(key)}</span><strong>${Math.round(Number(value || 0) * 100)}%</strong></div>`).join('')}
      <p><strong>Hard gates</strong><br>${pills(align.hardGates, (g) => `${g.gate}: ${g.status}`)}</p>`;

    const signals = record.signals || {};
    $('signals').innerHTML = `
      <p><strong>Agreement zones</strong><br>${pills(signals.agreementZones, (x) => `${x.term} (${x.models})`)}</p>
      <p><strong>Contradictions</strong><br>${pills(signals.contradictions, (x) => `${x.reviewer}→${x.subject}`)}</p>
      <p><strong>Missing evidence</strong><br>${pills(signals.missingIdeas, (x) => `${x.reviewer}→${x.subject}`)}</p>
      <p><strong>Verification</strong><br>${escapeHtml(signals.factualVerification || record.verificationStatus || '')}</p>`;

    const governed = record.governedOutput || {};
    $('governed').innerHTML = `
      <p><strong>Summary</strong><br>${escapeHtml(governed.summary || '')}</p>
      <p><strong>Recommendation</strong><br>${escapeHtml(governed.recommendation || '')}</p>
      <p><strong>Verification state</strong><br>${escapeHtml(governed.verificationState || '')}</p>`;

    humanGate.classList.toggle('is-visible', record.currentStage === 6 || record.outputStatus === 'HUMAN_REVIEW_REQUIRED');
    results.classList.add('is-visible');
    saveHistory(record);
  }

  function setLoading(on) {
    document.body.classList.toggle('ask-loading', on);
    runButton.textContent = on ? 'Running OMOS…' : 'Run OMOS Cycle';
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.add('is-visible');
  }

  function hideError() {
    errorBox.classList.remove('is-visible');
  }

  async function runOmos() {
    hideError();
    const question = prompt.value.trim();
    const key = apiKey.value.trim();
    if (!question) return showError('Enter a question or problem first.');
    if (!key) return showError('A valid OMOS API key is required for Council execution.');
    sessionStorage.setItem('omos_api_key', key);
    renderStages(defaultStages.map((s, i) => ({ ...s, status: i === 0 ? 'RUNNING' : 'PENDING' })));
    setLoading(true);
    try {
      const response = await fetch('/api/v1/council/run', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-omos-key': key },
        body: JSON.stringify({ prompt: question, mode: mode.value })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || payload.error || `Request failed (${response.status})`);
      renderRecord(payload.data);
    } catch (error) {
      showError(error.message || 'OMOS run failed.');
      renderStages(defaultStages.map((s, i) => ({ ...s, status: i === 0 ? 'FAILED' : 'PENDING' })));
    } finally {
      setLoading(false);
    }
  }

  function saveHistory(record) {
    const existing = JSON.parse(localStorage.getItem('omos_ask_history') || '[]');
    const item = {
      requestId: record.requestId,
      mode: record.mode,
      outputStatus: record.outputStatus,
      humanDecision: record.humanGate?.decision || null,
      startedAt: record.startedAt,
      prompt: record.rawPrompt || ''
    };
    const next = [item, ...existing.filter((x) => x.requestId !== item.requestId)].slice(0, 20);
    localStorage.setItem('omos_ask_history', JSON.stringify(next));
    renderHistory();
  }

  function renderHistory() {
    const items = JSON.parse(localStorage.getItem('omos_ask_history') || '[]');
    $('historyList').innerHTML = items.length ? items.map((item) => `
      <div class="ask-history-item"><strong>${escapeHtml(item.requestId)}</strong><br>${escapeHtml(item.mode)} · ${escapeHtml(item.humanDecision || item.outputStatus || '')}<br>${escapeHtml((item.prompt || '').slice(0, 160))}</div>`).join('') : '<div class="ask-history-item">No browser-session runs yet.</div>';
  }

  function localDisposition(decision) {
    if (!currentRecord) return;
    currentRecord.humanGate = { decision, comment: $('humanComment').value.trim(), decidedAt: new Date().toISOString(), persistence: 'browser_session_only' };
    currentRecord.currentStage = 7;
    currentRecord.outputStatus = decision;
    currentRecord.stages = (currentRecord.stages || []).map((stage) => {
      if (stage.id === 6) return { ...stage, status: 'COMPLETE', result: decision };
      if (stage.id === 7) return { ...stage, status: 'COMPLETE' };
      return stage;
    });
    renderRecord(currentRecord);
    humanGate.classList.remove('is-visible');
  }

  runButton.addEventListener('click', runOmos);
  clearButton.addEventListener('click', () => { prompt.value = ''; results.classList.remove('is-visible'); hideError(); renderStages(); });
  $('approveButton').addEventListener('click', () => localDisposition('APPROVED'));
  $('rejectButton').addEventListener('click', () => localDisposition('REJECTED'));

  apiKey.value = sessionStorage.getItem('omos_api_key') || '';
  renderStages();
  renderHistory();
})();