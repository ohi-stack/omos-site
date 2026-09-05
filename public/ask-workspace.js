(() => {
  const stageDefinitions = [
    { id: 1, label: 'Input', desc: 'Capture the human question, objective, and source prompt.' },
    { id: 2, label: 'Layer 1', desc: 'Distill signal, preserve constraints, classify ambiguity, quarantine hostile instructions.' },
    { id: 3, label: 'Alignment', desc: 'Evaluate dimensions, hard gates, confidence, and the current Alignment State.' },
    { id: 4, label: 'Council', desc: 'Run available model adapters independently, then perform cross-model review.' },
    { id: 5, label: 'Synthesis', desc: 'Combine agreements, contradictions, missing evidence, and useful dissent into a governed output.' },
    { id: 6, label: 'Human Gate', desc: 'Require an authorized human disposition before the run is finalized.' },
    { id: 7, label: 'Record', desc: 'Persist the Decision Record, hashes, timestamps, disposition, and provenance.' }
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
  let playbackTimer = null;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char]));
  }

  function normalizedStages(stages) {
    return stageDefinitions.map((definition) => {
      const remote = Array.isArray(stages) ? stages.find((item) => Number(item.id) === definition.id) : null;
      return { ...definition, ...(remote || {}), label: definition.label, status: remote?.status || 'PENDING' };
    });
  }

  function renderStages(stages = null, selectedId = null) {
    const normalized = normalizedStages(stages);
    const completed = normalized.filter(s => s.status === "COMPLETED" || s.status === "SKIPPED").length; const progress = (completed / normalized.length) * 100; const pBar = document.getElementById("railProgress"); if (pBar) pBar.style.width = `${progress}%`; stageList.innerHTML = normalized.map((stage) => `
      <div class="ask-stage" data-stage-id="${stage.id}" data-status="${escapeHtml(stage.status)}">
        <span class="ask-stage-num">0${stage.id}</span>
        <div><div class="ask-stage-name">${escapeHtml(stage.label)}</div><div class="ask-stage-desc">${escapeHtml(stage.desc)}</div></div>
        <span class="ask-stage-status">${escapeHtml(stage.status)}</span>
      </div>`).join('');

    document.querySelectorAll('[data-stage-id]').forEach((node) => {
      node.addEventListener('click', () => showStageDetail(Number(node.getAttribute('data-stage-id'))));
    });
    if (selectedId) showStageDetail(selectedId);
  }

  function showStageDetail(id) {
    const definition = stageDefinitions.find((item) => item.id === id);
    if (!definition) return;
    let detail = definition.desc;
    if (currentRecord) {
      if (id === 1) detail = `Input hash: ${currentRecord.inputHash || 'not recorded'} · Request ID: ${currentRecord.requestId}`;
      if (id === 2) detail = `Objective: ${currentRecord.layer1?.objective || 'Not available'} · Method: ${currentRecord.layer1?.method || 'not recorded'}`;
      if (id === 3) detail = `State: ${currentRecord.alignment?.state || 'Unknown'} · Score: ${percent(currentRecord.alignment?.overallScore)}`;
      if (id === 4) detail = `Mode: ${currentRecord.mode || 'unknown'} · Live: ${(currentRecord.liveProviders || []).join(', ') || 'none'} · Simulation: ${(currentRecord.simulationProviders || []).join(', ') || 'none'}`;
      if (id === 5) detail = currentRecord.governedOutput?.summary || definition.desc;
      if (id === 6) detail = currentRecord.humanGate?.decision ? `Human disposition: ${currentRecord.humanGate.decision}` : 'Human review is required before the record is finalized.';
      if (id === 7) detail = `Record hash: ${currentRecord.recordHash || 'pending human disposition'}`;
    }
    $('stageDetail').textContent = detail;
  }

  function percent(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '—';
    return `${Math.round(n * 100)}%`;
  }

  function pills(items, formatter) {
    if (!items || !items.length) return '<span class="ask-pill">None recorded</span>';
    return items.slice(0, 16).map((item) => `<span class="ask-pill">${escapeHtml(formatter ? formatter(item) : item)}</span>`).join('');
  }

  function meta(label, value) {
    return `<div class="ask-meta"><small>${escapeHtml(label)}</small><b>${escapeHtml(value || '—')}</b></div>`;
  }

  function renderCouncilOutputs(record) {
    const outputs = Array.isArray(record.round1) ? record.round1 : [];
    $('councilOutputs').innerHTML = outputs.length ? outputs.map((item) => `
      <div class="ask-model-output">
        <h4>${escapeHtml(item.provider)} ${item.simulated ? '· Simulation' : '· Live'}</h4>
        <p>${escapeHtml(item.output || 'No output returned.')}</p>
      </div>`).join('') : '<div class="ask-empty ask-full">No Council outputs were recorded for this run.</div>';
  }

  function renderRecord(record, replay = false) {
    currentRecord = record;
    $('runId').textContent = record.requestId;
    $('modeBadge').textContent = `${String(record.mode || 'unknown').toUpperCase()} · ${record.outputStatus || 'IN PROGRESS'}`;
    $('recordMeta').innerHTML = [
      meta('Runtime', record.runtimeVersion),
      meta('Schema', record.schemaVersion),
      meta('Started UTC', record.startedAt),
      meta('Persistence', `${record.persistence?.backend || 'unknown'}${record.persistence?.durable ? ' · durable' : ' · non-durable'}`)
    ].join('');

    const l1 = record.layer1 || {};
    $('layer1').innerHTML = `
      <p><strong>Objective</strong><br>${escapeHtml(l1.objective || '')}</p>
      <p><strong>Canonical input</strong><br>${escapeHtml(l1.canonicalInput || '')}</p>
      <p><strong>Constraints</strong><br>${pills(l1.constraints)}</p>
      <p><strong>Evidence signals</strong><br>${pills(l1.evidence)}</p>
      <p><strong>Ambiguities</strong><br>${pills(l1.ambiguities)}</p>
      <p><strong>Quarantined</strong><br>${pills(l1.quarantined)}</p>`;

    const align = record.alignment || {};
    const dims = align.dimensions || {};
    $('alignment').innerHTML = `
      <p><strong>State</strong><br>${escapeHtml(align.state || '')}</p>
      <p><strong>Overall alignment</strong><br>${percent(align.overallScore)}</p>
      ${Object.entries(dims).map(([key, value]) => `<div class="ask-metric"><span>${escapeHtml(key)}</span><strong>${percent(value)}</strong><div class="ask-bar"><span style="width:${Math.max(0,Math.min(100,Number(value || 0)*100))}%"></span></div></div>`).join('')}
      <p><strong>Hard gates</strong><br>${pills(align.hardGates, (g) => `${g.gate}: ${g.status}`)}</p>
      <p class="ask-note">${escapeHtml(align.note || '')}</p>`;

    renderCouncilOutputs(record);

    const signals = record.signals || {};
    $('signals').innerHTML = `
      <p><strong>Agreement zones</strong><br>${pills(signals.agreementZones, (x) => `${x.term} (${x.models})`)}</p>
      <p><strong>Contradictions</strong><br>${pills(signals.contradictions, (x) => `${x.reviewer}→${x.subject}`)}</p>
      <p><strong>Missing evidence</strong><br>${pills(signals.missingIdeas, (x) => `${x.reviewer}→${x.subject}`)}</p>
      <p><strong>Novel perspectives</strong><br>${pills(signals.novelInsights, (x) => x.provider || 'model')}</p>
      <p><strong>Factual verification</strong><br>${escapeHtml(signals.factualVerification || record.verificationStatus || 'not established')}</p>`;

    const governed = record.governedOutput || {};
    $('governed').innerHTML = `
      <p><strong>Summary</strong><br>${escapeHtml(governed.summary || '')}</p>
      <p><strong>Recommendation</strong><br>${escapeHtml(governed.recommendation || '')}</p>
      <p><strong>Alignment state</strong><br>${escapeHtml(governed.alignmentState || align.state || '')}</p>
      <p><strong>Verification state</strong><br>${escapeHtml(governed.verificationState || 'NOT_FACTUALLY_VERIFIED')}</p>`;

    humanGate.classList.toggle('is-visible', record.currentStage === 6 || record.outputStatus === 'HUMAN_REVIEW_REQUIRED');
    results.classList.add('is-visible');
    saveBrowserHistory(record);
    $('railState').textContent = record.currentStage === 6 ? 'Human Review' : (record.outputStatus || 'Recorded');

    if (replay) replayRecordedStages(record.stages || []);
    else renderStages(record.stages || []);
  }

  function replayRecordedStages(stages) {
    if (playbackTimer) clearInterval(playbackTimer);
    const target = normalizedStages(stages);
    const playback = stageDefinitions.map((item) => ({ ...item, status: 'PENDING' }));
    let index = 0;
    $('playbackNote').innerHTML = '<span class="ask-live-dot"></span>Replaying the recorded execution states from this completed runtime response.';
    renderStages(playback);
    playbackTimer = setInterval(() => {
      if (index > 0 && playback[index - 1]?.status === 'RUNNING') playback[index - 1].status = target[index - 1]?.status || 'COMPLETE';
      if (index < playback.length) {
        playback[index].status = target[index]?.status === 'NEEDS_REVIEW' ? 'NEEDS_REVIEW' : target[index]?.status === 'FAILED' ? 'FAILED' : 'RUNNING';
        renderStages(playback, playback[index].id);
        index += 1;
        return;
      }
      clearInterval(playbackTimer);
      playbackTimer = null;
      renderStages(target, currentRecord?.currentStage || null);
      $('playbackNote').textContent = 'Stage rail reflects the Decision Record returned by the OMOS runtime. It is not fabricated provider telemetry.';
    }, 330);
  }

  function setLoading(on) {
    document.body.classList.toggle('ask-loading', on);
    runButton.disabled = on;
    runButton.textContent = on ? 'OMOS is processing…' : 'Start Governed Run';
    if (on) $('railState').textContent = 'Processing';
  }

  function showError(message) { errorBox.textContent = message; errorBox.classList.add('is-visible'); }
  function hideError() { errorBox.classList.remove('is-visible'); }

  async function loadRuntimeStatus() {
    try {
      const [healthResponse, providersResponse, persistenceResponse] = await Promise.all([
        fetch('/api/health'), fetch('/api/v1/providers'), fetch('/api/v1/persistence')
      ]);
      const health = await healthResponse.json();
      const providersPayload = await providersResponse.json();
      const persistencePayload = await persistenceResponse.json();
      const providers = providersPayload.providers || [];
      const live = providers.filter((item) => item.configured).length;
      const persistence = persistencePayload.persistence || {};
      $('runtimeStatus').textContent = health.status === 'ok' ? `v${health.version}` : 'Unavailable';
      $('providerCount').textContent = `${live}/${providers.length} live`;
      $('persistenceMini').textContent = persistence.durable ? 'Durable' : 'Memory';
      $('persistenceStatus').textContent = persistence.durable
        ? `Decision Records: ${persistence.backend} durable storage is configured${persistence.initialized ? ' and initialized' : ''}.`
        : 'Decision Records: memory fallback only. Configure DATABASE_URL before claiming restart-safe persistence.';
      $('providerGrid').innerHTML = providers.map((item) => `<div class="ask-provider" data-state="${escapeHtml(item.status)}"><span>${escapeHtml(item.provider)}</span><strong>${escapeHtml(item.configured ? 'Live' : 'Simulation')}</strong></div>`).join('');
    } catch (error) {
      $('runtimeStatus').textContent = 'Unavailable';
      $('providerCount').textContent = 'Unknown';
      $('persistenceMini').textContent = 'Unknown';
      $('persistenceStatus').textContent = 'Runtime status could not be loaded.';
      $('providerGrid').innerHTML = '<div class="ask-empty ask-full">Provider status unavailable.</div>';
    }
  }

  async function runOmos() {
    hideError();
    const question = prompt.value.trim();
    const key = apiKey.value.trim();
    if (!question) return showError('Enter a question, problem, or decision first.');
    if (!key) return showError('A valid OMOS API key is required for governed Council execution.');
    sessionStorage.setItem('omos_api_key', key);
    currentRecord = null;
    humanGate.classList.remove('is-visible');
    results.classList.remove('is-visible');
    const waiting = stageDefinitions.map((item, index) => ({ ...item, status: index === 0 ? 'RUNNING' : 'PENDING' }));
    renderStages(waiting, 1);
    $('stageDetail').textContent = 'Input accepted in the browser. Waiting for the authenticated OMOS runtime to return the governed transaction.';
    $('playbackNote').textContent = 'The server currently returns the completed pre-Human-Gate transaction in one response; recorded stage states are replayed when it arrives.';
    setLoading(true);
    try {
      const response = await fetch('/api/v1/council/run', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-omos-key': key },
        body: JSON.stringify({ prompt: question, mode: mode.value })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || payload.error || `Request failed (${response.status})`);
      renderRecord(payload.data, true);
      await loadServerHistory();
      await loadRuntimeStatus();
      window.scrollTo({ top: results.offsetTop - 18, behavior: 'smooth' });
    } catch (error) {
      showError(error.message || 'OMOS run failed.');
      renderStages(stageDefinitions.map((item, index) => ({ ...item, status: index === 0 ? 'FAILED' : 'PENDING' })), 1);
      $('railState').textContent = 'Failed';
    } finally {
      setLoading(false);
    }
  }

  function saveBrowserHistory(record) {
    const existing = JSON.parse(localStorage.getItem('omos_ask_history') || '[]');
    const item = { requestId: record.requestId, mode: record.mode, outputStatus: record.outputStatus, humanDecision: record.humanGate?.decision || null, startedAt: record.startedAt, prompt: record.rawPrompt || '' };
    const next = [item, ...existing.filter((x) => x.requestId !== item.requestId)].slice(0, 20);
    localStorage.setItem('omos_ask_history', JSON.stringify(next));
  }

  function renderHistoryItems(items, source = 'browser') {
    $('historyList').innerHTML = items.length ? items.map((item) => `
      <div class="ask-history-item">
        <strong>${escapeHtml(item.requestId)}</strong><br>
        ${escapeHtml(String(item.mode || '').toUpperCase())} · ${escapeHtml(item.humanDecision || item.outputStatus || '')}<br>
        ${item.startedAt ? escapeHtml(new Date(item.startedAt).toLocaleString()) : ''}<br>
        ${item.prompt ? escapeHtml(String(item.prompt).slice(0, 120)) : ''}
        ${source === 'server' ? `<br><button type="button" data-run-id="${escapeHtml(item.requestId)}">Open Decision Record →</button>` : ''}
      </div>`).join('') : '<div class="ask-empty ask-full">No Decision Records yet. Your first governed run will appear here.</div>';
    if (source === 'server') document.querySelectorAll('[data-run-id]').forEach((button) => button.addEventListener('click', () => openServerRun(button.getAttribute('data-run-id'))));
  }

  function renderBrowserHistory() {
    renderHistoryItems(JSON.parse(localStorage.getItem('omos_ask_history') || '[]'), 'browser');
  }

  async function loadServerHistory() {
    const key = apiKey.value.trim() || sessionStorage.getItem('omos_api_key') || '';
    if (!key) return renderBrowserHistory();
    try {
      const response = await fetch('/api/v1/council/runs?limit=20', { headers: { 'x-omos-key': key } });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || payload.error || 'History request failed');
      renderHistoryItems(payload.data || [], 'server');
    } catch (error) { renderBrowserHistory(); }
  }

  async function openServerRun(requestId) {
    hideError();
    const key = apiKey.value.trim() || sessionStorage.getItem('omos_api_key') || '';
    if (!key) return showError('Enter your OMOS API key to reopen a Decision Record.');
    try {
      const response = await fetch(`/api/v1/council/runs/${encodeURIComponent(requestId)}`, { headers: { 'x-omos-key': key } });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || payload.error || 'Decision Record could not be opened');
      renderRecord(payload.data, true);
      window.scrollTo({ top: results.offsetTop - 18, behavior: 'smooth' });
    } catch (error) { showError(error.message); }
  }

  async function serverDisposition(decision) {
    if (!currentRecord) return;
    hideError();
    const key = apiKey.value.trim() || sessionStorage.getItem('omos_api_key') || '';
    if (!key) return showError('A valid OMOS API key is required to record the Human Gate decision.');
    const buttons = [$('approveButton'), $('rejectButton')];
    buttons.forEach((button) => { button.disabled = true; });
    try {
      const response = await fetch(`/api/v1/council/runs/${encodeURIComponent(currentRecord.requestId)}/human-decision`, {
        method: 'POST', headers: { 'content-type': 'application/json', 'x-omos-key': key },
        body: JSON.stringify({ decision, comment: $('humanComment').value.trim() })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || payload.error || `Decision failed (${response.status})`);
      renderRecord(payload.data, true);
      humanGate.classList.remove('is-visible');
      await loadServerHistory();
      await loadRuntimeStatus();
    } catch (error) { showError(error.message || 'Human decision could not be persisted.'); }
    finally { buttons.forEach((button) => { button.disabled = false; }); }
  }

  function exportRecord() {
    if (!currentRecord) return showError('Run OMOS or open a Decision Record before exporting.');
    const blob = new Blob([JSON.stringify(currentRecord, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${currentRecord.requestId}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  function exportPdf() {
    if (!currentRecord) return showError('Run OMOS or open a Decision Record before exporting.');
    const element = document.getElementById('results');
    const opt = {
      margin: 0.5,
      filename: `${currentRecord.requestId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  }
  }

  async function copyRunId() {
    if (!currentRecord) return;
    try { await navigator.clipboard.writeText(currentRecord.requestId); $('copyIdButton').textContent = 'Copied'; setTimeout(() => { $('copyIdButton').textContent = 'Copy ID'; }, 1200); }
    catch (error) { showError('Could not copy the Run ID in this browser.'); }
  }

  runButton.addEventListener('click', runOmos);
  clearButton.addEventListener('click', () => {
    prompt.value = ''; currentRecord = null; results.classList.remove('is-visible'); humanGate.classList.remove('is-visible'); hideError(); renderStages(); $('railState').textContent = 'Ready'; $('stageDetail').textContent = 'Select a stage to inspect its responsibility.'; $('playbackNote').textContent = '';
  });
  $('approveButton').addEventListener('click', () => serverDisposition('APPROVED'));
  $('rejectButton').addEventListener('click', () => serverDisposition('REJECTED'));
  $('exportButton').addEventListener('click', exportRecord); $('exportPdfButton').addEventListener('click', exportPdf);
  $('copyIdButton').addEventListener('click', copyRunId);
  document.querySelectorAll('[data-example]').forEach((button) => button.addEventListener('click', () => { prompt.value = button.getAttribute('data-example') || ''; prompt.focus(); }));
  apiKey.addEventListener('change', () => { const key = apiKey.value.trim(); if (key) sessionStorage.setItem('omos_api_key', key); loadServerHistory(); });

  apiKey.value = sessionStorage.getItem('omos_api_key') || '';
  renderStages();
  loadRuntimeStatus();
  loadServerHistory();
})();