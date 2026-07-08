#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');
const readline = require('readline');

// ============================================================
// Claude Code Thinking Display Patcher v2.1.204 (Custom)
//
// FORMAT: v2.1.113+ ships a native Bun SEA binary (bin/claude.exe).
// Only SAME-LENGTH byte replacements are possible; the historical
// "orange border / bold header" visual customizations from the
// cli.js era cannot be applied cleanly to the binary without
// relinking. This variant is kept for triplet parity and currently
// applies the same set of same-length patches as the Standard
// variant. For an additive visual (red color + forced multi-line),
// see patch-thinking-v2.1.204-custom-peach.js.
//
// v2.1.204 identifiers: Smi (setting gate), Rer (renderer),
//   cit=isTranscriptMode, BY=verbose, fco=thinking content.
// ============================================================

const homeDir = os.homedir();

function safeExec(command, args = []) {
  try {
    return execFileSync(command, args, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function getInstallationPaths() {
  const paths = [];

  const argTarget = process.argv.slice(2).find(a => a.startsWith('--target='));
  const overridePath = (argTarget && argTarget.slice('--target='.length)) || process.env.CLAUDE_PATCH_TARGET;
  if (overridePath) {
    if (!fs.existsSync(overridePath)) {
      console.error(`Override target not found: ${overridePath}`);
      process.exit(1);
    }
    return [{
      name: 'Explicit target (--target=/env)',
      path: overridePath,
      format: 'binary',
      description: 'Override supplied via CLI or CLAUDE_PATCH_TARGET'
    }];
  }

  const legacyCliJs = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');
  if (fs.existsSync(legacyCliJs)) {
    paths.push({
      name: '~/.claude/local/ (legacy cli.js)',
      path: legacyCliJs,
      format: 'js',
      description: 'Pre-v2.1.113 cli.js install — use an older patch (e.g. patch-thinking-v2.1.112-custom.js)'
    });
  }

  if (process.env.NVM_DIR) {
    const nodeVersion = process.version;
    const nvmBin = path.join(process.env.NVM_DIR, 'versions/node', nodeVersion,
      'lib/node_modules/@anthropic-ai/claude-code/bin/claude.exe');
    if (fs.existsSync(nvmBin)) {
      paths.push({
        name: 'nvm global (binary)',
        path: nvmBin,
        format: 'binary',
        description: `nvm-managed installation (Node ${nodeVersion})`
      });
    }
  }

  const npmGlobalRoot = safeExec('npm', ['root', '-g']);
  if (npmGlobalRoot) {
    const npmBin = path.join(npmGlobalRoot, '@anthropic-ai/claude-code/bin/claude.exe');
    if (fs.existsSync(npmBin) && !paths.some(p => p.path === npmBin)) {
      paths.push({
        name: 'npm global (binary)',
        path: npmBin,
        format: 'binary',
        description: 'Global npm installation'
      });
    }
  }

  const whichClaude = safeExec('which', ['claude']);
  if (whichClaude) {
    try {
      const realPath = fs.realpathSync(whichClaude);
      if (realPath.endsWith('claude.exe') && !paths.some(p => p.path === realPath)) {
        paths.push({
          name: 'PATH claude (binary)',
          path: realPath,
          format: 'binary',
          description: `Current PATH installation (${whichClaude})`
        });
      }
    } catch {}
  }

  return paths;
}

const PATCHES = [
  {
    name: 'Smi: opt in to summarized thinking always',
    search: Buffer.from('Smi(){return Bn().showThinkingSummaries??!1}'),
    replace: Buffer.from('Smi(){return Bn().showThinkingSummaries??!0}'),
    expectedSites: 1
  },
  {
    name: 'Outer transcript gate bypass (thinking + redacted_thinking)',
    search: Buffer.from('!cit&&!BY'),
    replace: Buffer.from('!(1)&&!!0'),
    expectedSites: 2
  },
  {
    name: 'Rer defensive: never null on empty content',
    search: Buffer.from('if(!fco){return null}'),
    replace: Buffer.from('if(!(1)){return null}'),
    expectedSites: 1
  }
];

function checkPatchStatus(inst) {
  try {
    if (inst.format === 'js') {
      return { status: 'legacy', canPatch: false, reason: 'Legacy cli.js — use pre-v2.1.113 custom patch' };
    }
    const data = fs.readFileSync(inst.path);
    const marker = Buffer.from('function Smi(){return Bn().showThinkingSummaries');
    if (data.indexOf(marker) === -1) {
      return { status: 'unknown', canPatch: false, reason: 'v2.1.204 Smi signature not found — wrong version?' };
    }
    let unpatched = 0, patched = 0;
    for (const p of PATCHES) {
      if (data.indexOf(p.search) !== -1) unpatched++;
      if (data.indexOf(p.replace) !== -1) patched++;
    }
    if (unpatched === 0 && patched === PATCHES.length) {
      return { status: 'patched', canPatch: false, variant: 'custom (or superset)' };
    }
    if (unpatched === PATCHES.length) return { status: 'unpatched', canPatch: true };
    return { status: 'partial', canPatch: true, reason: 'Some patches applied, will complete remaining' };
  } catch (e) {
    return { status: 'error', canPatch: false, reason: e.message };
  }
}

function applyBinaryPatches(inst) {
  console.log(`\nPatching: ${inst.name}`);
  console.log(`Path: ${inst.path}`);

  if (inst.format !== 'binary') {
    console.log('   ❌ Not a binary install — use an older patch for cli.js installs.');
    return false;
  }

  const data = fs.readFileSync(inst.path);
  const originalLength = data.length;
  let totalReplaced = 0;

  for (const patch of PATCHES) {
    if (patch.search.length !== patch.replace.length) {
      throw new Error(`Same-length invariant violated: ${patch.name}`);
    }
    let replaced = 0;
    let idx = 0;
    while (true) {
      const i = data.indexOf(patch.search, idx);
      if (i === -1) break;
      patch.replace.copy(data, i);
      replaced++;
      idx = i + patch.replace.length;
    }
    if (replaced > 0) {
      const suffix = patch.expectedSites && replaced !== patch.expectedSites
        ? ` (expected ${patch.expectedSites})` : '';
      console.log(`   ✅ ${patch.name}: ${replaced} site(s) patched${suffix}`);
    } else if (data.indexOf(patch.replace) !== -1) {
      console.log(`   ℹ️  ${patch.name}: already patched`);
    } else {
      console.log(`   ⚠️  ${patch.name}: pattern not found (unexpected)`);
    }
    totalReplaced += replaced;
  }

  if (data.length !== originalLength) throw new Error(`Binary length changed: ${data.length} != ${originalLength}`);

  if (totalReplaced > 0) {
    fs.writeFileSync(inst.path, data);
    if (process.platform === 'darwin') {
      const r = spawnSync('codesign', ['--force', '--sign', '-', inst.path], { stdio: 'pipe', encoding: 'utf8' });
      if (r.status === 0) console.log('   ✅ Re-signed with ad-hoc signature (codesign)');
      else console.log('   ⚠️  codesign failed — binary may fail to launch. stderr: ' + (r.stderr || '').trim());
    }
    return true;
  }
  return PATCHES.every(p => data.indexOf(p.replace) !== -1);
}

function promptUser(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (a) => { rl.close(); resolve(a.trim().toLowerCase()); }));
}

async function main() {
  console.log('Claude Code Thinking Display Patcher v2.1.204 (Custom)');
  console.log('======================================================');
  console.log('Binary format (Bun SEA) — same-length byte patches + ad-hoc codesign');
  console.log('Note: This variant applies the same functional patches as Standard.');
  console.log('      For visual styling (red color + forced multi-line), see the');
  console.log('      -custom-peach variant.\n');

  console.log(`User: ${os.userInfo().username}`);
  console.log(`Home: ${homeDir}\n`);

  console.log('🔍 Scanning for Claude Code installations...\n');
  const installations = getInstallationPaths();

  if (installations.length === 0) {
    console.error('❌ No Claude Code installations found!');
    console.error('Install v2.1.204 via: npm i -g @anthropic-ai/claude-code');
    process.exit(1);
  }

  console.log('Found installations:\n');
  const patchable = [];
  for (let i = 0; i < installations.length; i++) {
    const inst = installations[i];
    const status = checkPatchStatus(inst);
    inst.patchStatus = status;
    const icon = status.status === 'patched' ? '✅' :
                 status.status === 'unpatched' || status.status === 'partial' ? '⬚' : '❓';
    let text;
    if (status.status === 'patched') text = `PATCHED (${status.variant})`;
    else if (status.status === 'unpatched') text = 'UNPATCHED';
    else if (status.status === 'partial') text = `PARTIAL (${status.reason})`;
    else text = `UNKNOWN (${status.reason})`;
    console.log(`  [${i + 1}] ${icon} ${inst.name} [${inst.format}] - ${text}`);
    console.log(`      ${inst.description}`);
    console.log(`      ${inst.path}\n`);
    if (status.canPatch) patchable.push({ index: i + 1, ...inst });
  }

  if (patchable.length === 0) {
    console.log('ℹ️  No installations need patching.');
    process.exit(0);
  }

  const nonInteractive = process.argv.includes('--yes') || process.argv.includes('-y');
  let answer;
  if (nonInteractive) {
    console.log('─'.repeat(50));
    console.log('\n(--yes) Patching all patchable installations.\n');
    answer = 'a';
  } else {
    console.log('─'.repeat(50));
    console.log('\nWhich installation(s) would you like to patch?\n');
    console.log('  [a] All patchable installations');
    for (const p of patchable) console.log(`  [${p.index}] ${p.name} only`);
    console.log('  [q] Quit without patching\n');
    answer = await promptUser('Enter choice: ');
  }

  if (answer === 'q' || answer === '') { console.log('\nExiting without changes.'); process.exit(0); }

  let toPatch = [];
  if (answer === 'a') toPatch = patchable;
  else {
    const num = parseInt(answer);
    const found = patchable.find(p => p.index === num);
    if (!found) { console.log('\n❌ Invalid choice'); process.exit(1); }
    toPatch = [found];
  }

  console.log('\n' + '═'.repeat(50));
  console.log('Applying patches...');
  console.log('═'.repeat(50));

  let successCount = 0;
  for (const inst of toPatch) if (applyBinaryPatches(inst)) successCount++;

  console.log('\n' + '═'.repeat(50));
  console.log(`\n✅ Done! Patched ${successCount}/${toPatch.length} installation(s)`);
  console.log('\n⚠️  Please restart Claude Code for changes to take effect.');
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
