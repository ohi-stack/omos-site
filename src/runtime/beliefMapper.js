const VERSION = "1.0.0";

const QUESTIONS = [
  { id: "ontology", label: "What do you believe about ultimate reality?" },
  { id: "unity", label: "Do you believe the source of existence is singular or multiple?" },
  { id: "relationship", label: "How do you understand your relationship to that source?" },
  { id: "tradition", label: "What tradition, if any, informs your current belief?" },
  { id: "identity", label: "How do you currently identify your spiritual belief?" },
  { id: "community", label: "What role does community play in your belief practice?" },
  { id: "purpose", label: "Do you believe your life has a purpose given by a higher source?" }
];

const STAGES = {
  SEEKER: {
    id: "seeker",
    label: "Seeker",
    description: "Exploring the concept of One God without a formal OneGodian identity.",
    next: ["Learn", "Explore"]
  },
  BELIEVER: {
    id: "believer",
    label: "Believer",
    description: "Affirms One God as a primary truth and is considering OneGodian identity.",
    next: ["Explore", "Declare"]
  },
  ONEGODIAN: {
    id: "onegodian",
    label: "OneGodian",
    description: "Formally self-identifies as OneGodian and participates in the OneGodian ecosystem.",
    next: ["Join", "Continue"]
  },
  ELDER: {
    id: "elder",
    label: "Elder",
    description: "A long-term OneGodian who contributes knowledge, guidance, or community leadership.",
    next: ["Continue", "Contribute"]
  },
  ALLY: {
    id: "ally",
    label: "OneGodian Ally",
    description: "A supporter, friend, learner, or respectful observer of OneGodian principles.",
    next: ["Learn", "Support"]
  }
};

function clean(value) {
  return String(value ?? "").trim().toLowerCase();
}

function boolish(value) {
  return [true, "true", "yes", "1", 1].includes(value);
}

function mapBeliefs(input = {}) {
  const answers = input.answers && typeof input.answers === "object" ? input.answers : input;
  const identity = clean(answers.identity);
  const unity = clean(answers.unity);
  const community = clean(answers.community);
  const relationship = clean(answers.relationship);
  const purpose = clean(answers.purpose);
  const contributes = boolish(answers.contributes) || /lead|guide|teach|elder|mentor|serve/.test(community);
  const participates = boolish(answers.participates) || /member|participat|community|onegodian/.test(`${identity} ${community}`);
  const explicitAlly = /ally|supporter|friend|observer/.test(identity);
  const explicitOneGodian = /onegodian/.test(identity);
  const explicitElder = /elder/.test(identity);
  const singular = /one|single|singular|one god|unity/.test(unity);
  const higherPurpose = /yes|higher|divine|given|source|god|purpose/.test(purpose);
  const relational = relationship.length > 0 && !/none|unknown|unsure/.test(relationship);

  let stage = STAGES.SEEKER;
  const reasons = [];

  if (explicitElder && explicitOneGodian && contributes) {
    stage = STAGES.ELDER;
    reasons.push("You explicitly identify as a OneGodian Elder.", "You indicated contribution, guidance, teaching, mentoring, or service.");
  } else if (explicitOneGodian && participates) {
    stage = STAGES.ONEGODIAN;
    reasons.push("You explicitly self-identify as OneGodian.", "You indicated participation in the OneGodian ecosystem or community.");
  } else if (explicitAlly) {
    stage = STAGES.ALLY;
    reasons.push("You explicitly identify as an ally, supporter, friend, learner, or observer rather than as OneGodian.");
  } else if (singular && (higherPurpose || relational)) {
    stage = STAGES.BELIEVER;
    reasons.push("Your answers indicate belief in a singular source or One God.", "Your answers indicate a meaningful relationship to that source or a higher-source purpose.");
  } else {
    reasons.push("Your answers indicate active exploration rather than a formal OneGodian identity.");
  }

  const dimensions = QUESTIONS.reduce((acc, question) => {
    acc[question.id] = answers[question.id] ?? null;
    return acc;
  }, {});

  return {
    mapperVersion: VERSION,
    stage,
    reasons,
    dimensions,
    disclosure: "This is a voluntary OneGodian framework reflection result. It is not a governmental, legal, clinical, scientific, or objective measure of personal worth, spirituality, or religious status.",
    classificationBasis: "self-reported answers",
    generatedAtUtc: new Date().toISOString()
  };
}

module.exports = { VERSION, QUESTIONS, STAGES, mapBeliefs };
