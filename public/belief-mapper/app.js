(() => {
  const questions = [
    { id: 'ontology', text: 'What do you believe about ultimate reality?', options: ['A divine or higher reality exists', 'Reality is primarily material or natural', 'I am unsure or still exploring', 'I prefer not to answer'] },
    { id: 'unity', text: 'Do you believe the source of existence is singular or multiple?', options: ['One / singular source', 'Multiple sources or divine expressions', 'No higher source', 'Unsure / exploring'] },
    { id: 'relationship', text: 'How do you understand your relationship to that source?', options: ['Personal and direct', 'Connected through creation or community', 'Philosophical or symbolic', 'None / unsure'] },
    { id: 'tradition', text: 'What tradition, if any, informs your current belief?', options: ['OneGodian', 'Another spiritual or religious tradition', 'Multiple traditions', 'No formal tradition'] },
    { id: 'identity', text: 'How do you currently identify your spiritual belief?', options: ['OneGodian', 'OneGodian Elder', 'OneGodian Ally / supporter / learner', 'Believer in One God', 'Seeker / exploring', 'Another identity'] },
    { id: 'community', text: 'What role does community play in your belief practice?', options: ['I actively participate in OneGodian community', 'I contribute, guide, teach, mentor, or serve', 'Community matters, but I am not formally involved', 'My practice is mostly personal', 'None / unsure'] },
    { id: 'purpose', text: 'Do you believe your life has a purpose given by a higher source?', options: ['Yes', 'Possibly / still discerning', 'No', 'Unsure'] }
  ];

  const answers = {};
  let index = 0;
  const q = document.getElementById('question');
  const options = document.getElementById('options');
  const counter = document.getElementById('counter');
  const progress = document.getElementById('progress-bar');
  const back = document.getElementById('back');
  const next = document.getElementById('next');
  const questionView = document.getElementById('question-view');
  const resultView = document.getElementById('result-view');

  function render() {
    const item = questions[index];
    counter.textContent = `Question ${index + 1} of ${questions.length}`;
    progress.style.width = `${((index + 1) / questions.length) * 100}%`;
    q.textContent = item.text;
    options.innerHTML = '';
    item.options.forEach((label) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option';
      button.textContent = label;
      button.setAttribute('aria-pressed', String(answers[item.id] === label));
      button.addEventListener('click', () => {
        answers[item.id] = label;
        [...options.children].forEach((node) => node.setAttribute('aria-pressed', String(node === button)));
        next.disabled = false;
      });
      options.appendChild(button);
    });
    back.disabled = index === 0;
    next.disabled = !answers[item.id];
    next.textContent = index === questions.length - 1 ? 'See My Result' : 'Next';
  }

  function classify() {
    const identity = String(answers.identity || '').toLowerCase();
    const unity = String(answers.unity || '').toLowerCase();
    const community = String(answers.community || '').toLowerCase();
    const purpose = String(answers.purpose || '').toLowerCase();
    const relationship = String(answers.relationship || '').toLowerCase();
    const result = { label: 'Seeker', description: 'Exploring the concept of One God without a formal OneGodian identity.', why: ['Your answers indicate exploration rather than a formal OneGodian identity.'], next: ['Learn', 'Explore'] };
    if (identity.includes('elder') && community.match(/contribute|guide|teach|mentor|serve/)) {
      return { label: 'Elder', description: 'A long-term OneGodian contributing knowledge, guidance, or community leadership.', why: ['You explicitly self-identify as a OneGodian Elder.', 'You indicated contribution, guidance, teaching, mentoring, or service.'], next: ['Continue', 'Contribute'] };
    }
    if (identity === 'onegodian' && community.includes('onegodian')) {
      return { label: 'OneGodian', description: 'Formally self-identifies as OneGodian and participates in the OneGodian ecosystem.', why: ['You explicitly self-identify as OneGodian.', 'You indicated participation in OneGodian community.'], next: ['Join', 'Continue'] };
    }
    if (identity.includes('ally') || identity.includes('supporter') || identity.includes('learner')) {
      return { label: 'OneGodian Ally', description: 'A supporter, friend, learner, or respectful observer of OneGodian principles.', why: ['You explicitly chose an ally/supporter/learner relationship rather than formal OneGodian identity.'], next: ['Learn', 'Support'] };
    }
    if ((identity.includes('believer') || unity.includes('one / singular')) && (purpose === 'yes' || !relationship.includes('none'))) {
      return { label: 'Believer', description: 'Affirms One God as a primary truth and is considering OneGodian identity.', why: ['Your answers indicate belief in a singular source or One God.', 'Your answers indicate a meaningful relationship to that source or higher-source purpose.'], next: ['Explore', 'Declare'] };
    }
    return result;
  }

  function showResult() {
    const result = classify();
    questionView.hidden = true;
    resultView.hidden = false;
    const dimensions = questions.map((item) => `<div class="dimension"><strong>${item.id.charAt(0).toUpperCase() + item.id.slice(1)}</strong><div class="muted">${String(answers[item.id] || 'Not answered')}</div></div>`).join('');
    resultView.innerHTML = `
      <div class="muted">Your OneGodian framework reflection result</div>
      <div class="stage">${result.label}</div>
      <p>${result.description}</p>
      <h3>Why this result?</h3>
      <ul>${result.why.map((reason) => `<li>${reason}</li>`).join('')}</ul>
      <h3>Your seven-dimensional belief profile</h3>
      <div class="result-grid">${dimensions}</div>
      <h3>Possible next steps</h3>
      <p>${result.next.join(' • ')}</p>
      <div class="notice">This is a voluntary OneGodian framework reflection result based only on your answers. It is not a governmental, legal, clinical, scientific, or objective measure of personal worth, spirituality, or religious status.</div>
      <div class="actions"><button class="btn" id="restart" type="button">Start Over</button><a class="btn primary" href="/tools">Explore OMOS Tools</a></div>`;
    document.getElementById('restart').addEventListener('click', () => {
      Object.keys(answers).forEach((key) => delete answers[key]);
      index = 0;
      resultView.hidden = true;
      questionView.hidden = false;
      render();
    });
  }

  back.addEventListener('click', () => { if (index > 0) { index -= 1; render(); } });
  next.addEventListener('click', () => {
    if (!answers[questions[index].id]) return;
    if (index === questions.length - 1) return showResult();
    index += 1;
    render();
  });
  render();
})();
