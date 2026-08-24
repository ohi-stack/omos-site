(() => {
  const PRODUCT_STAGES = [
    { id: 1, key: 'input', label: 'INPUT', status: 'PENDING' },
    { id: 2, key: 'layer1', label: 'LAYER 1', status: 'PENDING' },
    { id: 3, key: 'align', label: 'ALIGN', status: 'PENDING' },
    { id: 4, key: 'council', label: 'COUNCIL', status: 'PENDING' },
    { id: 5, key: 'synthesize', label: 'SYNTHESIZE', status: 'PENDING' },
    { id: 6, key: 'record', label: 'RECORD', status: 'PENDING' },
    { id: 7, key: 'history', label: 'HISTORY', status: 'PENDING' }
  ];
  const VALID_STATUSES = new Set(['PENDING','RUNNING','COMPLETE','NEEDS_REVIEW','DEGRADED','FAILED']);
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
  let productStages = PRODUCT_STAGES.map((stage) => ({ ...stage }));

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char]));
  }

  function normalizeStatus(status) {
    const value = String(status || 'PENDING').toUpperCase().replace(/\s+/g, '_');
    return VALID_STATUSES.has(value) ? value : 'PENDING';
  }

  function displayStatus(status) {
    return normalizeStatus(status).replace(/_/g, ' ');
  }

  function renderStages(stages = productStages) {
    productStages = stages.map((stage) => ({ ...stage, status: normalizeStatus(stage.status) }));
    stageList.innerHTML = productStages.map((stage) => `
      <div class="ask-stage" data-status="${escapeHtml(stage.status)}" data-stage-key="${escapeHtml(stage.key)}">
        <div class="ask-stage-top"><span class="ask-stage-num">0${stage.id}</span><span class="ask-stage-name">${escapeHtml(stage.label)}</span></div>
        <span class="ask-stage-status">${escapeHtml(displayStatus(stage.status))}</span>
      </div>`).join('');
  }

  function setStage(key, status) {
    const next = productStages.map((stage) => stage.key === key ? { ...stage, status: normalizeStatus(status) } : stage);
    renderStages(next);
  }

  function resetStages() {
    renderStages(PRODUCT_STAGES.map((stage) => ({ ...stage })));
  }

  function serverStage(record, key) {
    return (record.stages || []).find((stage) => stage.key === key) || null;
  }

  function councilIsDegraded(record) {
    if (record.mode === 'hybrid') return true;
    const outputs = Array.isArray(record.round1) ? record.round1 : [];
    return outputs.some((item) => item?.metadata?.adapterError || item?.metadata?.fallback);
  }

  function mapRecordToProductStages(record, historyState = 'PENDING') {
    const humanDecision = record.humanGate?.decision || null;
    const l1 = serverStage(record, 'layer1');
    const align = serverStage(record, 'alignment');
    const council = serverStage(record, 'council');
    const synthesis = serverStage(record, 'synthesis');
    return [
      { ...PRODUCT_STAGES[0], status: record.requestId ? 'COMPLETE' : 'RUNNING' },
      { ...PRODUCT_STAGES[1], status: l1?.status || record.layer1?.status || 'PENDING' },
      { ...PRODUCT_STAGES[2], status: align?.status || record.alignment?.status || 'PENDING' },
      { ...PRODUCT_STAGES[3], status: councilIsDegraded(record) ? 'DEGRADED' : (council?.status || (record.round1 ? 'COMPLETE' : 'PENDING')) },
      { ...PRODUCT_STAGES[4], status: synthesis?.status || record.governedOutput?.status || 'PENDING' },
      { ...PRODUCT_STAGES[5], status: humanDecision ? 'COMPLETE' : 'NEEDS_REVIEW' },
      { ...PRODUCT_STAGES[6], status: historyState }
    ];
  }

  function pills(items, formatter) {
    if (!items || !items.length) return '<span class="ask-pill">None recorded</span>';
    return items.slice(0, 16).map((item) => `<span class="ask-pill">${escapeHtml(formatter ? formatter(item) : item)}</span>`).join('');
  }

  function setContext(record = null) {
    $('contextRunId').textContent = record?.requestId || 'Not started';
    $('contextMode').textContent = record?.mode ? String(record.mode).toUpperCase() : '—';
    $('contextAlignment').textContent = record?.alignment?.state || '—';
    $('contextVerification').textContent = record?.governedOutput?.verificationState || record?.verificationStatus || '—';
    $('contextHumanGate').textContent = record?.humanGate?.decision || (record ? 'Needs Review' : 'Pending');
    $('contextPersistence').textContent = record?.persistence?.backend ? `${record.persistence.backend}${record.persistence.durable ? ' · durable' : ' · fallback'}` : $('contextPersistence').textContent;
  }

  function renderRecord(record, historyState = 'PENDING') {
    currentRecord = record;
    $('runId').textContent = record.requestId || 'OMOS run';
    $('modeBadge').textContent = `${String(record.mode || 'unknown').toUpperCase()} · ${record.outputStatus || 'HUMAN_REVIEW_REQUIRED'}`;
    $('recordBadge').textContent = record.humanGate?.decision ? `Human Gate · ${record.humanGate.decision}` : 'Human Gate · Needs Review';
    renderStages(mapRecordToProductStages(record, historyState));
    setContext(record);

    const l1 = record.layer1 || {};
    $('layer1').innerHTML = `
      <p><strong>Objective</strong><br>${escapeHtml(l1.objective || 'Not recorded')}</p>
      <p><strong>Canonical input</strong><br>${escapeHtml(l1.canonicalInput || record.canonicalPrompt || '')}</p>
      <p><strong>Questions</strong><br>${pills(l1.questions)}</p>
      <p><strong>Constraints</strong><br>${pills(l1.constraints)}</p>
      <p><strong>Evidence references</strong><br>${pills(l1.evidence)}</p>
      <p><strong>Ambiguities</strong><br>${pills(l1.ambiguities)}</p>
      <p><strong>Quarantined</strong><br>${pills(l1.quarantined)}</p>`;

    const align = record.alignment || {};
    const dims = align.dimensions || {};
    $('alignment').innerHTML = `
      <p><strong>State</strong><br>${escapeHtml(align.state || 'Not evaluated')}</p>
      <p><strong>Overall</strong><br>${Math.round((Number(align.overallScore) || 0) * 100)}%</p>
      ${Object.entries(dims).map(([key, value]) => `<div style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06);padding:6px 0"><span>${escapeHtml(key)}</span><strong>${Math.round((Number(value) || 0) * 100)}%</strong></div>`).join('')}
      <p><strong>Hard gates</strong><br>${pills(align.hardGates, (g) => `${g.gate}: ${g.status}`)}</p>
      <p class="ask-note">${escapeHtml(align.note || '')}</p>`;

    const signals = record.signals || {};
    const providers = Array.isArray(record.round1) ? record.round1 : [];
    $('signals').innerHTML = `
      <p><strong>Execution mode</strong><br>${escapeHtml(record.mode || '')}${councilIsDegraded(record) ? ' · DEGRADED' : ''}</p>
      <p><strong>Providers</strong><br>${pills(providers, (x) => `${x.provider}${x.simulated ? ' · simulated' : ' · live'}`)}</p>
      <p><strong>Agreement zones</strong><br>${pills(signals.agreementZones, (x) => `${x.term} (${x.models})`)}</p>
      <p><strong>Contradictions</strong><br>${pills(signals.contradictions, (x) => `${x.reviewer}→${x.subject}`)}</p>
      <p><strong>Missing evidence / ideas</strong><br>${pills(signals.missingIdeas, (x) => `${x.reviewer}→${x.subject}`)}</p>
      <p><strong>Novel insights</strong><br>${pills(signals.novelInsights, (x) => x.provider || x.reviewer || 'signal')}</p>
      <p><strong>Factual verification</strong><br>${escapeHtml(signals.factualVerification || record.verificationStatus || 'NOT_ESTABLISHED')}</p>`;

    const governed = record.governedOutput || {};
    $('governed').innerHTML = `
      <p><strong>Objective</strong><br>${escapeHtml(governed.objective || l1.objective || '')}</p>
      <p><strong>Summary</strong><br>${escapeHtml(governed.summary || '')}</p>
      <p><strong>Recommendation</strong><br>${escapeHtml(governed.recommendation || '')}</p>
      <p><strong>Alignment state</strong><br>${escapeHtml(governed.alignmentState || align.state || '')}</p>
      <p><strong>Verification state</strong><br>${escapeHtml(governed.verificationState || '')}</p>
      <p><strong>Persistence</strong><br>${escapeHtml(record.persistence?.backend || 'unknown')} · ${record.persistence?.durable ? 'durable' : 'not durable'}</p>`;

    const needsHumanDecision = !record.humanGate?.decision && (record.currentStage === 6 || record.outputStatus === 'HUMAN_REVIEW_REQUIRED');
    humanGate.classList.toggle('is-visible', needsHumanDecision);
    results.classList.add('is-visible');
    saveBrowserHistory(record);
  }

  function setLoading(on) {
    document.body.classList.toggle('ask-loading', on);
    runButton.textContent = on ? 'Running OMOS…' : 'Run OMOS';
    runButton.disabled = on;
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.add('is-visible');
  }

  function hideError() {
    errorBox.classList.remove('is-visible');
  }

  async function loadPersistenceStatus() {
    try {
      const response = await fetch('/api/v1/persistence');
      const payload = await response.json();
      const persistence = payload.persistence || {};
      const text = persistence.durable
        ? `Decision Records: ${persistence.backend || 'postgresql'} durable storage configured${persistence.initialized ? ' and initialized' : ''}.`
        : 'Decision Records: memory fallback only. Configure DATABASE_URL before claiming restart-safe persistence.';
      $('persistenceStatus').textContent = text;
      $('contextPersistence').textContent = persistence.durable ? `${persistence.backend || 'postgresql'} · durable` : `${persistence.backend || 'memory'} · fallback`;
    } catch (error) {
      $('persistenceStatus').textContent = 'Persistence status unavailable.';
      $('contextPersistence').textContent = 'Unavailable';
    }
  }

  async function runOmos() {
    hideError();
    const question = prompt.value.trim();
    const key = apiKey.value.trim();
    if (!question) return showError('Enter a real question or problem first.');
    if (!key) return showError('A valid OMOS API key is required for governed Council execution.');
    sessionStorage.setItem('omos_api_key', key);
    currentRecord = null;
    setContext(null);
    renderStages(PRODUCT_STAGES.map((stage, index) => ({ ...stage, status: index === 0 ? 'COMPLETE' : index === 1 ? 'RUNNING' : 'PENDING' })));
    setLoading(true);
    try {
      const response = await fetch('/api/v1/council/run', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-omos-key': key },
        body: JSON.stringify({ prompt: question, mode: mode.value })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || payload.error || `Request failed (${response.status})`);
      renderRecord(payload.data, 'RUNNING');
      const found = await loadServerHistory(payload.data.requestId);
      renderRecord(payload.data, found ? 'COMPLETE' : 'DEGRADED');
      await loadPersistenceStatus();
      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      showError(error.message || 'OMOS run failed.');
      const failed = productStages.map((stage) => stage.status === 'RUNNING' ? { ...stage, status: 'FAILED' } : stage);
      renderStages(failed);
    } finally {
      setLoading(false);
    }
  }

  function saveBrowserHistory(record) {
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
  }

  function renderHistoryItems(items, source = 'browser') {
    $('historyList').innerHTML = items.length ? items.map((item) => `
      <div class="ask-history-item">
        <strong>${escapeHtml(item.requestId)}</strong><br>
        ${escapeHtml(String(item.mode || '').toUpperCase())} · ${escapeHtml(item.humanDecision || item.outputStatus || '')}<br>
        ${item.startedAt ? escapeHtml(new Date(item.startedAt).toLocaleString()) : ''}
        ${item.prompt ? `<br>${escapeHtml(String(item.prompt).slice(0, 180))}` : ''}
        ${source === 'server' ? `<br><button type="button" data-run-id="${escapeHtml(item.requestId)}">Open Decision Record →</button>` : ''}
      </div>`).join('') : '<div class="ask-empty">No Decision Records yet.</div>';

    if (source === 'server') {
      document.querySelectorAll('[data-run-id]').forEach((button) => {
        button.addEventListener('click', () => openServerRun(button.getAttribute('data-run-id')));
      });
    }
  }

  function renderBrowserHistory() {
    const items = JSON.parse(localStorage.getItem('omos_ask_history') || '[]');
    renderHistoryItems(items, 'browser');
    return items;
  }

  async function loadServerHistory(expectedRequestId = null) {
    const key = apiKey.value.trim() || sessionStorage.getItem('omos_api_key') || '';
    if (!key) {
      const items = renderBrowserHistory();
      if (currentRecord) setStage('history', items.some((item) => item.requestId === currentRecord.requestId) ? 'DEGRADED' : 'PENDING');
      return expectedRequestId ? items.some((item) => item.requestId === expectedRequestId) : false;
    }
    try {
      const response = await fetch('/api/v1/council/runs?limit=20', { headers: { 'x-omos-key': key } });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || payload.error || 'History request failed');
      const items = payload.data || [];
      renderHistoryItems(items, 'server');
      const currentFound = currentRecord ? items.some((item) => item.requestId === currentRecord.requestId) : false;
      if (currentRecord) setStage('history', currentFound ? 'COMPLETE' : 'DEGRADED');
      return expectedRequestId ? items.some((item) => item.requestId === expectedRequestId) : currentFound;
    } catch (error) {
      renderBrowserHistory();
      if (currentRecord) setStage('history', 'DEGRADED');
      return false;
    }
  }

  async function openServerRun(requestId) {
    hideError();
    const key = apiKey.value.trim() || sessionStorage.getItem('omos_api_key') || '';
    if (!key) return showError('Enter your OMOS API key to reopen a Decision Record.');
    setStage('history', 'RUNNING');
    try {
      const response = await fetch(`/api/v1/council/runs/${encodeURIComponent(requestId)}`, { headers: { 'x-omos-key': key } });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || payload.error || 'Decision Record could not be opened');
      renderRecord(payload.data, 'COMPLETE');
      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      setStage('history', 'FAILED');
      showError(error.message);
    }
  }

  async function serverDisposition(decision) {
    if (!currentRecord) return;
    hideError();
    const key = apiKey.value.trim() || sessionStorage.getItem('omos_api_key') || '';
    if (!key) return showError('A valid OMOS API key is required to record the Human Decision Gate.');
    setStage('record', 'RUNNING');
    const buttons = [$('approveButton'), $('rejectButton')];
    buttons.forEach((button) => { button.disabled = true; });
    try {
      const response = await fetch(`/api/v1/council/runs/${encodeURIComponent(currentRecord.requestId)}/human-decision`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-omos-key': key },
        body: JSON.stringify({ decision, comment: $('humanComment').value.trim() })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || payload.error || `Decision failed (${response.status})`);
      renderRecord(payload.data, 'RUNNING');
      humanGate.classList.remove('is-visible');
      const found = await loadServerHistory(payload.data.requestId);
      renderRecord(payload.data, found ? 'COMPLETE' : 'DEGRADED');
      await loadPersistenceStatus();
    } catch (error) {
      setStage('record', 'FAILED');
      showError(error.message || 'Human decision could not be persisted.');
    } finally {
      buttons.forEach((button) => { button.disabled = false; });
    }
  }

  runButton.addEventListener('click', runOmos);
  clearButton.addEventListener('click', () => {
    prompt.value = '';
    $('humanComment').value = '';
    currentRecord = null;
    results.classList.remove('is-visible');
    hideError();
    resetStages();
    setContext(null);
    prompt.focus();
  });
  $('approveButton').addEventListener('click', () => serverDisposition('APPROVED'));
  $('rejectButton').addEventListener('click', () => serverDisposition('REJECTED'));
  $('refreshHistory').addEventListener('click', () => loadServerHistory());
  apiKey.addEventListener('change', () => {
    const key = apiKey.value.trim();
    if (key) sessionStorage.setItem('omos_api_key', key);
    loadServerHistory();
  });

  apiKey.value = sessionStorage.getItem('omos_api_key') || '';
  resetStages();
  loadPersistenceStatus();
  loadServerHistory();
})();