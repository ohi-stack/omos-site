const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { distillPrompt } = require('./orchestrator');

const DEFAULT_REPO = process.env.GITHUB_REPOSITORY || 'ohi-stack/omos-site';
const CLASSIFICATIONS_FILE = path.join(__dirname, '../../data/task-classifications.json');

// In-memory cache for classifications
const classificationsStore = new Map();

// Initialize persistent storage file
function initStore() {
  try {
    const dir = path.dirname(CLASSIFICATIONS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(CLASSIFICATIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(CLASSIFICATIONS_FILE, 'utf8'));
      if (Array.isArray(data)) {
        for (const item of data) {
          const key = `${item.repo || DEFAULT_REPO}#${item.issueNumber}`;
          classificationsStore.set(key, item);
        }
      }
    }
  } catch (err) {
    console.warn('[TaskClassification] Could not load persisted classifications:', err.message);
  }
}

function persistStore() {
  try {
    const dir = path.dirname(CLASSIFICATIONS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const data = Array.from(classificationsStore.values());
    fs.writeFileSync(CLASSIFICATIONS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('[TaskClassification] Could not persist classifications:', err.message);
  }
}

initStore();

function loadAgentsRegistry() {
  try {
    const agentsPath = path.join(__dirname, '../../config/developer-agents.json');
    if (fs.existsSync(agentsPath)) {
      return JSON.parse(fs.readFileSync(agentsPath, 'utf8')).agents || [];
    }
  } catch (_) {}
  return [];
}

const CANONICAL_CATEGORIES = [
  'Bug',
  'Feature',
  'Security',
  'Infrastructure',
  'Documentation',
  'Research',
  'Release'
];

function sha256(val) {
  return `sha256:${crypto.createHash('sha256').update(typeof val === 'string' ? val : JSON.stringify(val)).digest('hex')}`;
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
}

/**
 * Perform Stage 02: Task Classification on a GitHub Issue
 * Follows the canonical OMOS Engineering Council Lifecycle:
 * ISSUE -> CLASSIFY -> ASSIGN -> IMPLEMENT -> PR -> REVIEW -> CI -> GOVERNANCE -> APPROVAL -> MERGE -> DEPLOY -> PROOF -> RECORD
 */
function classifyIssue(issue, options = {}, adminUser = 'admin') {
  const number = Number(issue.number);
  const title = String(issue.title || '').trim();
  const body = String(issue.body || '').trim();
  const rawLabels = Array.isArray(issue.labels)
    ? issue.labels.map((l) => (typeof l === 'string' ? l : l.name || '')).filter(Boolean)
    : [];
  const fullText = `${title}\n\n${body}`;

  // Layer 1 distillation to identify objective, constraints, ambiguities, evidence, and quarantined text
  const layer1 = distillPrompt(fullText, { source: 'github_issue', issueNumber: number });

  // 1. Determine Category
  let category = options.category;
  let confidence = 0.85;
  let rationale = '';

  const labelStr = rawLabels.join(' ').toLowerCase();
  const titleLower = title.toLowerCase();
  const bodyLower = body.toLowerCase();

  if (!category) {
    if (labelStr.includes('security') || /security|vulnerab|cve|leak|auth|token|xss|injection|breach|secret/i.test(titleLower)) {
      category = 'Security';
      confidence = 0.94;
      rationale = 'Identified security-sensitive terminology or security label in problem statement.';
    } else if (labelStr.includes('bug') || /bug|fix|error|fail|crash|exception|regression|broken|cannot|unexpected|timeout|404|500/i.test(titleLower)) {
      category = 'Bug';
      confidence = 0.91;
      rationale = 'Defect or unexpected failure semantics identified in title and problem statement.';
    } else if (labelStr.includes('documentation') || labelStr.includes('docs') || /doc|readme|guide|spec|manual|diagram|glossary|changelog|typo/i.test(titleLower)) {
      category = 'Documentation';
      confidence = 0.92;
      rationale = 'Documentation, specification, or readability improvement requested.';
    } else if (labelStr.includes('infrastructure') || /ci|cd|docker|deploy|pipeline|workflow|nginx|server|port|build|postgres|database|migration|evidence|alignment/i.test(titleLower)) {
      category = 'Infrastructure';
      confidence = 0.88;
      rationale = 'Build, runtime environment, deployment pipeline, or infrastructure alignment task.';
    } else if (/release|version|tag|milestone|publish|bump|converge/i.test(titleLower)) {
      category = 'Release';
      confidence = 0.86;
      rationale = 'Release governance, convergence, or deployment coordination milestone.';
    } else if (/research|investigate|explore|feasibility|benchmark|study|prototype/i.test(titleLower)) {
      category = 'Research';
      confidence = 0.82;
      rationale = 'Exploratory investigation or architectural feasibility study.';
    } else {
      category = 'Feature';
      confidence = 0.80;
      rationale = 'New capability, functional enhancement, or architectural component requested.';
    }
  } else {
    rationale = `Category explicitly assigned by administrator (${adminUser}).`;
  }

  // 2. Priority
  let priority = options.priority;
  if (!priority) {
    if (category === 'Security' || /critical|urgent|blocker|outage|emergency|fail/i.test(titleLower)) {
      priority = 'Critical';
    } else if (category === 'Bug' || /high|severe|production|p1/i.test(titleLower) || labelStr.includes('p1')) {
      priority = 'High';
    } else if (category === 'Documentation' || /trivial|minor|typo|p3|low/i.test(titleLower)) {
      priority = 'Low';
    } else {
      priority = 'Medium';
    }
  }

  // 3. Complexity
  let complexity = options.complexity;
  if (!complexity) {
    if (/architect|multi-repo|redesign|rewrite|refactor|migration/i.test(titleLower)) {
      complexity = 'Architectural';
    } else if (fullText.length > 1000 || layer1.constraints.length >= 3) {
      complexity = 'Complex';
    } else if (category === 'Documentation' || fullText.length < 250) {
      complexity = 'Trivial';
    } else {
      complexity = 'Standard';
    }
  }

  // 4. Affected Modules Detection
  const affectedModules = [];
  if (/ui|frontend|css|html|page|button|dashboard|nav|mega|screen/i.test(fullText)) affectedModules.push('ui-frontend');
  if (/runtime|orchestrat|server|express|api|process|stream/i.test(fullText)) affectedModules.push('runtime-orchestrator');
  if (/postgres|database|db|store|persistence|sql|pool/i.test(fullText)) affectedModules.push('persistence-store');
  if (/adapter|openai|gemini|anthropic|xai|provider/i.test(fullText)) affectedModules.push('model-adapters');
  if (/doc|specification|markdown|readme|protocol|algorithm/i.test(fullText)) affectedModules.push('documentation');
  if (/ci|github|action|workflow|test|smoke|lint|check/i.test(fullText)) affectedModules.push('ci-testing');
  if (/security|auth|key|secret|token|helmet/i.test(fullText)) affectedModules.push('security-governance');
  if (!affectedModules.length) affectedModules.push('general-system');

  // 5. Agent Assignment Recommendation based on developer-agents.json
  let recommendedAgent = null;
  let recommendedReviewer = null;

  if (category === 'Security') {
    recommendedAgent = {
      agentId: 'OMOS-DEV-SEC-0001',
      name: 'Security Agent',
      role: 'Security & Vulnerability Analysis',
      provider: 'provider_neutral'
    };
    recommendedReviewer = {
      agentId: 'OMOS-DEV-REVIEW-0001',
      name: 'Independent Review Agent',
      role: 'Independent Verification'
    };
  } else if (category === 'Documentation') {
    recommendedAgent = {
      agentId: 'OMOS-DEV-DOCS-0001',
      name: 'Documentation Agent',
      role: 'Technical Documentation & Standards',
      provider: 'provider_neutral'
    };
    recommendedReviewer = {
      agentId: 'OMOS-DEV-QA-0001',
      name: 'QA and Test Agent',
      role: 'Verification'
    };
  } else if (category === 'Infrastructure' || category === 'Release') {
    recommendedAgent = {
      agentId: 'OMOS-DEV-DEPLOY-0001',
      name: 'Deployment Agent',
      role: 'Infrastructure & Deployment Alignment',
      provider: 'provider_neutral'
    };
    recommendedReviewer = {
      agentId: 'OMOS-DEV-REVIEW-0001',
      name: 'Independent Review Agent',
      role: 'Independent Verification'
    };
  } else if (category === 'Research') {
    recommendedAgent = {
      agentId: 'OMOS-DEV-ARCH-0001',
      name: 'Architecture Agent',
      role: 'Architecture & Design Specification',
      provider: 'provider_neutral'
    };
    recommendedReviewer = {
      agentId: 'OMOS-DEV-REVIEW-0001',
      name: 'Independent Review Agent',
      role: 'Independent Verification'
    };
  } else if (affectedModules.includes('ui-frontend')) {
    recommendedAgent = {
      agentId: 'OMOS-DEV-ANTIGRAVITY-0001',
      name: 'Antigravity Developer Agent',
      role: 'UI & Application Implementation',
      provider: 'Google'
    };
    recommendedReviewer = {
      agentId: 'OMOS-DEV-REVIEW-0001',
      name: 'Independent Review Agent',
      role: 'Independent Verification'
    };
  } else {
    // General code / Bug / Feature
    recommendedAgent = {
      agentId: 'OMOS-DEV-CODEX-0001',
      name: 'Codex Developer Agent',
      role: 'Implementation & Refactoring',
      provider: 'OpenAI'
    };
    recommendedReviewer = {
      agentId: 'OMOS-DEV-REVIEW-0001',
      name: 'Independent Review Agent',
      role: 'Independent Verification'
    };
  }

  // 6. Branch Name Generation
  const prefixMap = {
    Bug: 'fix',
    Security: 'security-fix',
    Feature: 'feat',
    Infrastructure: 'infra',
    Documentation: 'docs',
    Research: 'spike',
    Release: 'release'
  };
  const branchPrefix = prefixMap[category] || 'task';
  const targetBranch = `${branchPrefix}/issue-${number}-${slugify(title)}`;

  // 7. Acceptance Criteria Extraction
  const criteria = [];
  const checklistRegex = /- \[[ x]\] (.+)/gi;
  let match;
  while ((match = checklistRegex.exec(body)) !== null) {
    criteria.push(match[1].trim());
  }
  if (!criteria.length) {
    if (layer1.constraints.length) {
      criteria.push(...layer1.constraints.slice(0, 4));
    } else {
      criteria.push(`Resolve problem statement: "${title.slice(0, 100)}"`);
      criteria.push('Verify code passes npm run check and test suites without regression');
      criteria.push('Provide deployment and verification evidence in Engineering Record');
    }
  }

  // 8. Security & Governance Gates
  const quarantinedDetected = Boolean(layer1.quarantined && layer1.quarantined.length);
  const securityGates = {
    quarantinedInstructionsDetected: quarantinedDetected,
    quarantinedList: layer1.quarantined || [],
    requiresSecurityReview: category === 'Security' || quarantinedDetected || affectedModules.includes('security-governance'),
    affectsProductionSecrets: /secret|key|token|credential|env/i.test(fullText),
    requiresHumanGateBeforeMerge: true, // Rule 3: OMOS does not auto-merge consequential changes
    rule1Enforced: 'Cross-agent review required: author cannot authorize own changes'
  };

  const classifiedAt = new Date().toISOString();
  const classificationId = `tc_issue_${number}_${Date.now()}`;

  const classification = {
    classificationId,
    stage: 'Task Classification',
    stageCode: '02',
    canonicalLifecycle: [
      'ISSUE',
      'CLASSIFY',
      'ASSIGN',
      'IMPLEMENT',
      'PULL_REQUEST',
      'INDEPENDENT_REVIEW',
      'CI_TESTS',
      'OMOS_GOVERNANCE',
      'HUMAN_APPROVAL',
      'MERGE',
      'DEPLOY',
      'PRODUCTION_PROOF',
      'ENGINEERING_RECORD'
    ],
    issue: {
      number,
      title,
      author: issue.user?.login || issue.author || 'unknown',
      htmlUrl: issue.html_url || `https://github.com/${options.repo || DEFAULT_REPO}/issues/${number}`,
      labels: rawLabels,
      isPullRequest: Boolean(issue.pull_request || issue.is_pull_request),
      state: issue.state || 'open',
      createdAt: issue.created_at || null
    },
    categorization: {
      category,
      confidence,
      priority,
      complexity,
      rationale,
      affectedModules,
      targetBranch,
      acceptanceCriteria: criteria
    },
    assignment: {
      recommendedAgent,
      recommendedReviewer,
      coordinatorAgent: {
        agentId: 'OMOS-DEV-COORD-0001',
        name: 'OMOS Engineering Coordinator'
      }
    },
    governanceGates: securityGates,
    audit: {
      classifiedAt,
      classifiedBy: adminUser,
      repo: options.repo || DEFAULT_REPO,
      evidenceHash: sha256({
        number,
        title,
        category,
        priority,
        recommendedAgent,
        classifiedAt
      })
    }
  };

  // Save in store
  const storeKey = `${options.repo || DEFAULT_REPO}#${number}`;
  const storedItem = {
    repo: options.repo || DEFAULT_REPO,
    issueNumber: number,
    classification,
    updatedAt: classifiedAt
  };
  classificationsStore.set(storeKey, storedItem);
  persistStore();

  return classification;
}

function getStoredClassification(repo, issueNumber) {
  const key = `${repo || DEFAULT_REPO}#${Number(issueNumber)}`;
  const item = classificationsStore.get(key);
  return item ? item.classification : null;
}

function listStoredClassifications(repo) {
  const targetRepo = repo || DEFAULT_REPO;
  const list = [];
  for (const item of classificationsStore.values()) {
    if (!repo || item.repo === targetRepo) {
      list.push(item.classification);
    }
  }
  return list.sort((a, b) => new Date(b.audit.classifiedAt) - new Date(a.audit.classifiedAt));
}

/**
 * Fetch issues from GitHub API with graceful fallback and rate-limit handling
 */
async function fetchRepoIssues(repo = DEFAULT_REPO, options = {}) {
  const targetRepo = repo.trim() || DEFAULT_REPO;
  const state = options.state || 'open';
  const perPage = Math.min(Number(options.per_page) || 30, 100);
  const page = Number(options.page) || 1;

  const url = `https://api.github.com/repos/${targetRepo}/issues?state=${encodeURIComponent(state)}&per_page=${perPage}&page=${page}`;
  
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'OMOS-Admin-Dashboard/1.1.0'
  };

  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let rawIssues = [];
  let rateLimitInfo = { limit: 60, remaining: 60, reset: null };
  let errorNotice = null;

  try {
    const res = await fetch(url, { headers });
    
    // Read GitHub rate limit headers
    if (res.headers.get('x-ratelimit-limit')) {
      rateLimitInfo.limit = Number(res.headers.get('x-ratelimit-limit'));
      rateLimitInfo.remaining = Number(res.headers.get('x-ratelimit-remaining'));
      rateLimitInfo.reset = res.headers.get('x-ratelimit-reset');
    }

    if (res.status === 403 && rateLimitInfo.remaining === 0) {
      errorNotice = 'GitHub API rate limit exceeded for unauthenticated requests. Configure GITHUB_TOKEN in .env for 5,000 requests/hour.';
    } else if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      errorNotice = errData.message || `GitHub API returned HTTP ${res.status}`;
    } else {
      rawIssues = await res.json();
    }
  } catch (err) {
    errorNotice = `Network error contacting GitHub API: ${err.message}`;
  }

  // If error occurred (e.g. rate limit, offline), return cached issues or sample mock items
  if (errorNotice && (!Array.isArray(rawIssues) || !rawIssues.length)) {
    // Provide realistic fallback issues so dashboard is always testable & demonstrative
    rawIssues = [
      {
        number: 50,
        title: '[Production Evidence] OMOS canonical host not aligned with main',
        body: 'The canonical host did not satisfy the exact production-evidence gate for the current main revision. Expected main SHA: 159bde9b6c3800ebd85d90bff0c541f77ceeb359. Expected runtime version: 1.1.0.',
        user: { login: 'onegodian-bot' },
        labels: [{ name: 'infrastructure' }, { name: 'production-evidence' }],
        state: 'open',
        html_url: `https://github.com/${targetRepo}/issues/50`,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        comments: 2,
        pull_request: null
      },
      {
        number: 51,
        title: 'Converge all current OMOS repo content into the live-site runtime',
        body: 'Consolidate runtime documentation, OHI output pipeline diagrams, and canonical mega menu models into active Node deployment.',
        user: { login: 'ohi-stack' },
        labels: [{ name: 'enhancement' }],
        state: 'open',
        html_url: `https://github.com/${targetRepo}/pull/51`,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        comments: 1,
        pull_request: { url: `https://api.github.com/repos/${targetRepo}/pulls/51` }
      },
      {
        number: 53,
        title: 'Harden API rate-limiting and audit log signature verification',
        body: 'Audit chains require SHA-256 tamper-proof verification headers and stricter per-key rate-limiting bounds across all public routes.',
        user: { login: 'security-reviewer' },
        labels: [{ name: 'security' }, { name: 'audit' }],
        state: 'open',
        html_url: `https://github.com/${targetRepo}/issues/53`,
        created_at: new Date(Date.now() - 14400000).toISOString(),
        comments: 0,
        pull_request: null
      },
      {
        number: 54,
        title: 'Add OTS-V5 Open Transmission Standard documentation to resource archive',
        body: 'The canonical OTS-V5 specification document should be indexed in /docs and linked through the Resources mega menu.',
        user: { login: 'editor' },
        labels: [{ name: 'documentation' }],
        state: 'open',
        html_url: `https://github.com/${targetRepo}/issues/54`,
        created_at: new Date(Date.now() - 28800000).toISOString(),
        comments: 1,
        pull_request: null
      }
    ];
  }

  // Enrich each issue with its stored classification if already classified
  const enriched = rawIssues.map((issue) => {
    const isPr = Boolean(issue.pull_request);
    const stored = getStoredClassification(targetRepo, issue.number);
    return {
      id: issue.id || issue.number,
      number: issue.number,
      title: issue.title,
      body: issue.body || '',
      state: issue.state || 'open',
      html_url: issue.html_url,
      author: issue.user?.login || 'unknown',
      avatar_url: issue.user?.avatar_url || null,
      labels: Array.isArray(issue.labels)
        ? issue.labels.map((l) => (typeof l === 'string' ? { name: l } : { name: l.name, color: l.color }))
        : [],
      commentsCount: issue.comments || 0,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      isPullRequest: isPr,
      classification: stored || null,
      isClassified: Boolean(stored)
    };
  });

  return {
    repository: targetRepo,
    count: enriched.length,
    totalClassified: enriched.filter((i) => i.isClassified).length,
    rateLimit: rateLimitInfo,
    notice: errorNotice,
    issues: enriched
  };
}

module.exports = {
  CANONICAL_CATEGORIES,
  classifyIssue,
  getStoredClassification,
  listStoredClassifications,
  fetchRepoIssues,
  loadAgentsRegistry
};
