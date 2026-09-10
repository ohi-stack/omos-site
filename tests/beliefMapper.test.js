const assert = require('assert');
const { mapBeliefs } = require('../src/runtime/beliefMapper');

function stage(input) {
  return mapBeliefs({ answers: input }).stage.id;
}

assert.strictEqual(stage({
  identity: 'Seeker / exploring',
  unity: 'Unsure / exploring',
  relationship: 'None / unsure',
  purpose: 'Unsure'
}), 'seeker');

assert.strictEqual(stage({
  identity: 'Believer in One God',
  unity: 'One / singular source',
  relationship: 'Personal and direct',
  purpose: 'Yes'
}), 'believer');

assert.strictEqual(stage({
  identity: 'OneGodian',
  community: 'I actively participate in OneGodian community',
  participates: true
}), 'onegodian');

assert.strictEqual(stage({
  identity: 'OneGodian Elder',
  community: 'I contribute, guide, teach, mentor, or serve',
  contributes: true,
  tenureYears: 3
}), 'elder');

assert.strictEqual(stage({
  identity: 'OneGodian Ally / supporter / learner'
}), 'ally');

assert.notStrictEqual(stage({
  identity: 'Another identity',
  unity: 'One / singular source',
  relationship: 'Personal and direct',
  purpose: 'Yes'
}), 'onegodian');

console.log('Belief Mapper tests passed.');
