const assert = require('assert');
const { mapBeliefs } = require('../src/runtime/beliefMapper');

function stage(answers) { return mapBeliefs({ answers }).stage.id; }

assert.equal(stage({ identity: 'Seeker / exploring', unity: 'Unsure / exploring', relationship: 'None / unsure', community: 'My practice is mostly personal', purpose: 'Unsure' }), 'seeker');
assert.equal(stage({ identity: 'Believer in One God', unity: 'One / singular source', relationship: 'Personal and direct', purpose: 'Yes' }), 'believer');
assert.equal(stage({ identity: 'OneGodian', unity: 'One / singular source', community: 'I actively participate in OneGodian community', purpose: 'Yes' }), 'onegodian');
assert.equal(stage({ identity: 'OneGodian Elder', unity: 'One / singular source', community: 'I contribute, guide, teach, mentor, or serve', purpose: 'Yes' }), 'elder');
assert.equal(stage({ identity: 'OneGodian Ally / supporter / learner', unity: 'One / singular source', purpose: 'Yes' }), 'ally');
assert.notEqual(stage({ identity: 'Christian', unity: 'One / singular source', relationship: 'Personal and direct', purpose: 'Yes', community: 'Community matters, but I am not formally involved' }), 'onegodian');

const result = mapBeliefs({ answers: { identity: 'OneGodian', community: 'I actively participate in OneGodian community' } });
assert.equal(result.classificationBasis, 'self-reported answers');
assert.ok(result.disclosure.includes('not a governmental'));
assert.ok(result.generatedAtUtc);

console.log('Belief Mapper classification tests passed.');
