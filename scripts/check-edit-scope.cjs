const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const validPath = p => typeof p === 'string' && p.length > 0 && !p.startsWith('/') && !p.includes('\\') && !p.split('/').some(s => s === '..' || s === '.' || s === '');
function validate(map, task, files) {
  const errors = [];
  if (!map.editors.includes(task.editor)) errors.push('Unknown editor');
  if (!Array.isArray(task.sections) || !Array.isArray(task.sharedFiles)) return [...errors, 'sections and sharedFiles must be arrays'];
  for (const s of task.sections) if (!Object.hasOwn(map.sections, s)) errors.push(`Unknown section: ${s}`);
  for (const p of task.sharedFiles) if (!validPath(p)) errors.push(`Invalid path: ${p}`);
  for (const p of files) {
    if (!validPath(p)) { errors.push(`Invalid path: ${p}`); continue; }
    if (p === '.agent-task.json') continue;
    if (p.startsWith('agents/')) {
      if (!p.startsWith(`agents/${task.editor}/`)) errors.push(`Cannot edit another editor section: ${p}`);
      continue;
    }
    const sections = Object.entries(map.sections).filter(([, prefixes]) => prefixes.some(prefix => p.startsWith(prefix))).map(([s]) => s);
    if (sections.length) {
      if (!sections.some(s => task.sections.includes(s))) errors.push(`File outside assigned sections: ${p}`);
    } else if (!task.sharedFiles.includes(p)) errors.push(`Declare exact shared file for human review: ${p}`);
  }
  return errors;
}
module.exports = {validate};
if (require.main === module) {
  try {
    const base = process.argv[2];
    if (!base) throw new Error('Usage: node scripts/check-edit-scope.cjs BASE_SHA');
    // Validate against the base ownership policy, not a policy rewritten by this task.
    let map;
    let bootstrap = false;
    try { map = JSON.parse(execFileSync('git',['show',`${base}:config/repository-sections.json`],{encoding:'utf8',stdio:['ignore','pipe','pipe']})); }
    catch (e) { if (process.env.OMOS_SCOPE_BOOTSTRAP !== 'true') throw new Error('Base ownership policy missing; explicit bootstrap required'); bootstrap = true; map = JSON.parse(fs.readFileSync('config/repository-sections.json','utf8')); }
    const task = JSON.parse(fs.readFileSync('.agent-task.json','utf8'));
    const files = execFileSync('git',['diff','--name-only','--no-renames','-z',base,'HEAD'],{encoding:'utf8'}).split('\0').filter(Boolean);
    // Initial setup may create NEW editor instruction files; it cannot overwrite them.
    const additions = bootstrap ? execFileSync('git',['diff','--name-only','--diff-filter=A','-z',base,'HEAD'],{encoding:'utf8'}).split('\0') : [];
    const initialWorkspaces = additions.filter(p => /^agents\/(chatgpt|claude|gemini|grok)\/(AGENTS|README)\.md$/.test(p));
    const errors = validate(map,task,files.filter(p => !initialWorkspaces.includes(p)));
    if (!files.includes('.agent-task.json')) errors.push('Update .agent-task.json for each task');
    if (errors.length) throw new Error(errors.join('\n'));
    console.log(`Edit scope passed: ${task.editor}; ${files.length} changed paths. Shared declarations still require human review.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
