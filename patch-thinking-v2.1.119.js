#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');
const readline = require('readline');

// ============================================================
// Claude Code Thinking Display Patcher v2.1.119 (Standard)
//
// FORMAT: v2.1.113+ ships a native Bun SEA binary (bin/claude.exe).
// This patcher applies SAME-LENGTH byte replacements inside the
// binary and re-signs it on macOS (ad-hoc signature).
//
// Identifiers: _86 (component), j$H (React), p (Box), k (Text),
//   rz (ThinkingContent), Ij7 (cache, 9 slots), qj (Spinner)
// Gate function: ZJ5 (not patched in standard — see -custom-peach)
// Redact-thinking beta header variable: EE_
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

  const legacyCliJs = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');
  if (fs.existsSync(legacyCliJs)) {
    paths.push({
      name: '~/.claude/local/ (legacy cli.js)',
      path: legacyCliJs,
      format: 'js',
      description: 'Pre-v2.1.113 cli.js install — use an older patch (e.g. patch-thinking-v2.1.112.js)'
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

// Same-length byte patches for v2.1.119 binary.
// Each `search` MUST have the same length as its `replace`.
const PATCHES = [
  {
    name: 'Redact-thinking beta header disabled',
    desc: 'Changes condition `O` -> `0` so beta header is never pushed',
    search: Buffer.from('if(O&&K_9(H)&&!h8()&&x8().showThinkingSummaries!==!0)_.push(EE_);'),
    replace: Buffer.from('if(0&&K_9(H)&&!h8()&&x8().showThinkingSummaries!==!0)_.push(EE_);')
  },
  {
    name: '_86 component always renders expanded',
    desc: 'if(Y)return null -> if(0) ; if(!(O||T)) -> if(!(1||1))',
    search: Buffer.from('function _86(H){let _=Ij7.c(9),{param:q,addMargin:K,isTranscriptMode:O,verbose:T,hideInTranscript:$}=H,{thinking:A}=q,z=K===void 0?!1:K,Y=$===void 0?!1:$;if(!A)return null;if(Y)return null;if(!(O||T)){'),
    replace: Buffer.from('function _86(H){let _=Ij7.c(9),{param:q,addMargin:K,isTranscriptMode:O,verbose:T,hideInTranscript:$}=H,{thinking:A}=q,z=K===void 0?!1:K,Y=$===void 0?!1:$;if(!A)return null;if(0)return null;if(!(1||1)){')
  }
];

function checkPatchStatus(inst) {
  try {
    if (inst.format === 'js') {
      return { status: 'legacy', canPatch: false, reason: 'Legacy cli.js — use pre-v2.1.113 patch files' };
    }
    const data = fs.readFileSync(inst.path);
    const v2119Marker = Buffer.from('function _86(H){let _=Ij7.c(9)');
    if (data.indexOf(v2119Marker) === -1) {
      return { status: 'unknown', canPatch: false, reason: 'v2.1.119 _86 signature not found — wrong version?' };
    }

    const unpatchedCount = PATCHES.reduce((acc, p) => acc + (data.indexOf(p.search) !== -1 ? 1 : 0), 0);
    const patchedCount = PATCHES.reduce((acc, p) => acc + (data.indexOf(p.replace) !== -1 ? 1 : 0), 0);

    if (unpatchedCount === 0 && patchedCount === PATCHES.length) {
      return { status: 'patched', canPatch: false, variant: 'standard (or superset)' };
    }
    if (unpatchedCount === PATCHES.length) {
      return { status: 'unpatched', canPatch: true };
    }
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
      console.log(`   ✅ ${patch.name}: ${replaced} site(s) patched`);
    } else if (data.indexOf(patch.replace) !== -1) {
      console.log(`   ℹ️  ${patch.name}: already patched`);
    } else {
      console.log(`   ⚠️  ${patch.name}: pattern not found (unexpected)`);
    }
    totalReplaced += replaced;
  }

  if (data.length !== originalLength) {
    throw new Error(`Binary length changed: ${data.length} != ${originalLength}`);
  }

  if (totalReplaced > 0) {
    fs.writeFileSync(inst.path, data);
    if (process.platform === 'darwin') {
      const r = spawnSync('codesign', ['--force', '--sign', '-', inst.path], { stdio: 'pipe', encoding: 'utf8' });
      if (r.status === 0) {
        console.log('   ✅ Re-signed with ad-hoc signature (codesign)');
      } else {
        console.log('   ⚠️  codesign failed — binary may fail to launch. stderr:');
        console.log('      ' + (r.stderr || '').trim());
      }
    }
    return true;
  }
  return totalReplaced > 0 || PATCHES.every(p => data.indexOf(p.replace) !== -1);
}

function promptUser(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (a) => { rl.close(); resolve(a.trim().toLowerCase()); }));
}

async function main() {
  console.log('Claude Code Thinking Display Patcher v2.1.119 (Standard)');
  console.log('========================================================');
  console.log('Binary format (Bun SEA) — same-length byte patches + ad-hoc codesign\n');
  console.log(`User: ${os.userInfo().username}`);
  console.log(`Home: ${homeDir}\n`);

  console.log('🔍 Scanning for Claude Code installations...\n');
  const installations = getInstallationPaths();

  if (installations.length === 0) {
    console.error('❌ No Claude Code installations found!');
    console.error('Install v2.1.119 via: npm i -g @anthropic-ai/claude-code');
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

  const whichClaude = safeExec('which', ['claude']);
  if (whichClaude) {
    try {
      const realPath = fs.realpathSync(whichClaude);
      console.log(`📍 Currently active: ${whichClaude}`);
      console.log(`   Resolves to: ${realPath}\n`);
    } catch {
      console.log(`📍 Currently active: ${whichClaude}\n`);
    }
  }

  if (patchable.length === 0) {
    console.log('ℹ️  No installations need patching.');
    process.exit(0);
  }

  console.log('─'.repeat(50));
  console.log('\nWhich installation(s) would you like to patch?\n');
  console.log('  [a] All patchable installations');
  for (const p of patchable) console.log(`  [${p.index}] ${p.name} only`);
  console.log('  [q] Quit without patching\n');

  const answer = await promptUser('Enter choice: ');
  if (answer === 'q' || answer === '') {
    console.log('\nExiting without changes.');
    process.exit(0);
  }

  let toPatch = [];
  if (answer === 'a') {
    toPatch = patchable;
  } else {
    const num = parseInt(answer);
    const found = patchable.find(p => p.index === num);
    if (!found) { console.log('\n❌ Invalid choice'); process.exit(1); }
    toPatch = [found];
  }

  console.log('\n' + '═'.repeat(50));
  console.log('Applying patches...');
  console.log('═'.repeat(50));

  let successCount = 0;
  for (const inst of toPatch) {
    if (applyBinaryPatches(inst)) successCount++;
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`\n✅ Done! Patched ${successCount}/${toPatch.length} installation(s)`);
  console.log('\n⚠️  Please restart Claude Code for changes to take effect.\n');
  console.log('Features:');
  console.log('   - Redact-thinking beta header disabled (full thinking content returned by API)');
  console.log('   - _86 component always renders expanded thinking (no compact spinner view)');
  console.log('\nNote: The outer ZJ5 gate still returns null in default mode — thinking');
  console.log('      blocks appear only in transcript mode (ctrl+o) or with --verbose.');
  console.log('      For default-mode visibility use patch-thinking-v2.1.119-custom-peach.js.');
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
