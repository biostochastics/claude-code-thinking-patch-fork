#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');
const readline = require('readline');

// ============================================================
// Claude Code Thinking Display Patcher v2.1.289 (Standard)
//
// FORMAT: v2.1.113+ ships a native Bun SEA binary. v2.1.289 is also
// installed by the native installer at ~/.local/share/claude/versions/.
// All replacements are SAME-LENGTH byte substitutions, re-signed on
// macOS with an ad-hoc signature.
//
// v2.1.289 identifiers:
//   pCn   — reads `showThinkingSummaries` (was `Smi` in the previous release)
//   lt    — settings accessor (replaces `Bn`)
//   Ss    — ordinary thinking renderer (replaces `Rer`)
//   Za    — NEW narration renderer (summaries whose signature decodes to
//           "narration"); not gated by transcript/verbose, left untouched
//   U / R — isTranscriptMode / verbose at the case-render call site
//   nEt   — ∴ glyph variable (was `OQo`), oa — prose/markdown renderer,
//   s=Box, n=Text, e/r = jsx/jsxs
//
// NOTE: the official `showThinkingSummaries: true` setting now does what
// patch #1 does. The byte patch is only needed for the visual restyle
// (custom-peach) or to force rendering without `verbose: true`.
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

  const argTarget = process.argv.slice(2).find((a) => a.startsWith('--target='));
  const overridePath = (argTarget && argTarget.slice('--target='.length)) || process.env.CLAUDE_PATCH_TARGET;
  if (overridePath) {
    if (!fs.existsSync(overridePath)) {
      console.error(`Override target not found: ${overridePath}`);
      process.exit(1);
    }
    return [
      {
        name: 'Explicit target (--target=/env)',
        path: overridePath,
        format: 'binary',
        description: 'Override supplied via CLI or CLAUDE_PATCH_TARGET',
      },
    ];
  }

  const legacyCliJs = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');
  if (fs.existsSync(legacyCliJs)) {
    paths.push({
      name: '~/.claude/local/ (legacy cli.js)',
      path: legacyCliJs,
      format: 'js',
      description: 'Pre-v2.1.113 cli.js install — use an older patch (e.g. patch-thinking-v2.1.112.js)',
    });
  }

  if (process.env.NVM_DIR) {
    const nodeVersion = process.version;
    const nvmBin = path.join(
      process.env.NVM_DIR,
      'versions/node',
      nodeVersion,
      'lib/node_modules/@anthropic-ai/claude-code/bin/claude.exe',
    );
    if (fs.existsSync(nvmBin)) {
      paths.push({
        name: 'nvm global (binary)',
        path: nvmBin,
        format: 'binary',
        description: `nvm-managed installation (Node ${nodeVersion})`,
      });
    }
  }

  const npmGlobalRoot = safeExec('npm', ['root', '-g']);
  if (npmGlobalRoot) {
    const npmBin = path.join(npmGlobalRoot, '@anthropic-ai/claude-code/bin/claude.exe');
    if (fs.existsSync(npmBin) && !paths.some((p) => p.path === npmBin)) {
      paths.push({
        name: 'npm global (binary)',
        path: npmBin,
        format: 'binary',
        description: 'Global npm installation',
      });
    }
  }

  // Native installer (curl | sh / `claude update`): ~/.local/share/claude/versions/<ver>
  const nativeDir = path.join(homeDir, '.local/share/claude/versions');
  if (fs.existsSync(nativeDir)) {
    for (const v of fs.readdirSync(nativeDir).sort()) {
      const bin = path.join(nativeDir, v);
      try {
        if (!v.endsWith('.json') && fs.statSync(bin).isFile() && !paths.some((p) => p.path === bin)) {
          paths.push({
            name: `native install ${v} (binary)`,
            path: bin,
            format: 'binary',
            description: 'Native installer (~/.local/share/claude/versions)',
          });
        }
      } catch {}
    }
  }

  const whichClaude = safeExec('which', ['claude']);
  if (whichClaude) {
    try {
      const realPath = fs.realpathSync(whichClaude);
      const isBinary = realPath.endsWith('claude.exe') || realPath.includes('/.local/share/claude/versions/');
      if (isBinary && !paths.some((p) => p.path === realPath)) {
        paths.push({
          name: 'PATH claude (binary)',
          path: realPath,
          format: 'binary',
          description: `Current PATH installation (${whichClaude})`,
        });
      }
    } catch {}
  }

  return paths;
}

// Same-length byte patches for the v2.1.289 binary.
// Each `search` MUST have the same byte length as its `replace`.
//
// Trace (single-copy bundle inside __BUN):
//   pCn()   — `return lt().showThinkingSummaries??!1` (setting gate; drives
//             `display:"summarized"` in the request and removes the legacy
//             `redact-thinking-2026-02-12` beta header)
//   case"thinking" / case"redacted_thinking" — both open with
//             `{if(!U&&!R){return null}` where U=isTranscriptMode, R=verbose.
//             (case"thinking" first tries `Tut(l)` → narration renderer `Za`,
//             which is NOT gated; ordinary thinking falls through to `Ss`.)
const PATCHES = [
  // ── Bun bytecode cache ────────────────────────────────────────────────
  // v2.1.289 is compiled with `bun build --compile --bytecode`: every chunk
  // ships precompiled JavaScriptCore bytecode and its source text is kept
  // only for stack traces. Editing the source alone is therefore inert.
  // Two steps make the (patched) source the code that actually runs:
  //   1. blank the `@bytecode` pragma (same-length swap, this entry), and
  //   2. zero the per-module bytecode pointers in Bun's module-graph table
  //      (see stripBytecode below; the original pointers are saved to a
  //      sidecar JSON so --restore can put them back).
  // Startup cost measured on the JS path (`--help`): unchanged (0.23s).
  {
    name: 'Bun: blank @bytecode pragma (forces source compile)',
    search: Buffer.from('// @bun @bytecode\n'),
    replace: Buffer.from('// @bun          \n'),
  },
  {
    name: 'pCn: opt in to summarized thinking always',
    search: Buffer.from('pCn(){return lt().showThinkingSummaries??!1}'),
    replace: Buffer.from('pCn(){return lt().showThinkingSummaries??!0}'),
    expectedSites: 1,
  },
  {
    name: 'Outer transcript gate bypass (thinking + redacted_thinking)',
    search: Buffer.from('if(!U&&!R){return null}'),
    replace: Buffer.from('if(!1&&!1){return null}'),
    expectedSites: 2,
  },
];

// --restore: every patch is a same-length swap, so undoing one is the same
// swap with search/replace reversed. No backup file is needed.
const RESTORE = process.argv.includes('--restore');
if (RESTORE) for (const p of PATCHES) [p.search, p.replace] = [p.replace, p.search];

// ── Bun standalone module graph: bytecode pointers ─────────────────────
// Layout (Bun 1.3.9+, verified on 1.4.3): the __BUN data ends with a
// 32-byte Offsets struct { byte_count:u64, modules:{off:u32,len:u32},
// entry_point_id:u32, ... } followed by the trailer "\n---- Bun! ----\n".
// Every StringPointer is relative to dataStart = trailer - 32 - byte_count.
// The module table is 52-byte records: name(8) contents(8) sourcemap(8)
// bytecode(8) ... flags. Zeroing a record's bytecode pointer makes Bun
// compile that module from its (patched) source instead.
const BUN_TRAILER = Buffer.from('\n---- Bun! ----\n');
const BUN_RECORD = 52;

function parseModuleGraph(data) {
  const tr = data.lastIndexOf(BUN_TRAILER);
  if (tr < 64) throw new Error('Bun trailer not found');
  const byteCount = Number(data.readBigUInt64LE(tr - 32));
  const modOff = data.readUInt32LE(tr - 24);
  const modLen = data.readUInt32LE(tr - 20);
  const base = tr - 32 - byteCount;
  if (base < 0 || modLen % BUN_RECORD !== 0 || base + modOff + modLen > tr) {
    throw new Error('Bun module graph header did not validate');
  }
  const first = base + modOff;
  const nameOff = data.readUInt32LE(first),
    nameLen = data.readUInt32LE(first + 4);
  const name = data.subarray(base + nameOff, base + nameOff + Math.min(nameLen, 16)).toString('latin1');
  if (!name.startsWith('/$bunfs/'))
    throw new Error('Bun module table did not validate (first name: ' + JSON.stringify(name) + ')');
  const records = [];
  for (let i = 0; i < modLen / BUN_RECORD; i++) {
    const r = first + i * BUN_RECORD;
    records.push({ at: r + 24, off: data.readUInt32LE(r + 24), len: data.readUInt32LE(r + 28) });
  }
  return { base, records };
}

function bytecodeBackupPath(binPath) {
  return binPath + '.bytecode-ptrs.json';
}

function bytecodeState(data) {
  try {
    const { records } = parseModuleGraph(data);
    return { ok: true, active: records.filter((r) => r.len > 0).length, total: records.length };
  } catch (e) {
    return { ok: false, reason: e.message, active: 0, total: 0 };
  }
}

// Zero every bytecode pointer; save the originals beside the binary.
function stripBytecode(data, binPath) {
  const { records } = parseModuleGraph(data);
  const active = records.filter((r) => r.len > 0);
  if (active.length === 0) {
    console.log('   ℹ️  Bun bytecode pointers: already cleared');
    return 0;
  }
  const backup = bytecodeBackupPath(binPath);
  if (!fs.existsSync(backup)) {
    fs.writeFileSync(backup, JSON.stringify({ version: 1, records: active.map((r) => [r.at, r.off, r.len]) }));
  }
  for (const r of active) {
    data.writeUInt32LE(0, r.at);
    data.writeUInt32LE(0, r.at + 4);
  }
  console.log(
    `   ✅ Bun bytecode pointers cleared: ${active.length}/${records.length} modules (originals saved to ${path.basename(backup)})`,
  );
  return active.length;
}

// Put the saved pointers back (for --restore).
function restoreBytecode(data, binPath) {
  const backup = bytecodeBackupPath(binPath);
  if (!fs.existsSync(backup)) {
    console.log(
      '   ⚠️  Bun bytecode pointers: no sidecar backup found — left cleared (harmless; reinstall for a pristine binary)',
    );
    return 0;
  }
  const saved = JSON.parse(fs.readFileSync(backup, 'utf8'));
  let n = 0;
  for (const [at, off, len] of saved.records) {
    if (data.readUInt32LE(at) === 0 && data.readUInt32LE(at + 4) === 0) {
      data.writeUInt32LE(off, at);
      data.writeUInt32LE(len, at + 4);
      n++;
    }
  }
  if (n > 0) {
    fs.unlinkSync(backup);
    console.log(`   ✅ Bun bytecode pointers restored: ${n} modules`);
  } else console.log('   ℹ️  Bun bytecode pointers: already restored');
  return n;
}

function checkPatchStatus(inst) {
  try {
    if (inst.format === 'js') {
      return { status: 'legacy', canPatch: false, reason: 'Legacy cli.js — use pre-v2.1.113 custom-peach patch' };
    }
    const data = fs.readFileSync(inst.path);
    const marker = Buffer.from('function pCn(){return lt().showThinkingSummaries');
    if (data.indexOf(marker) === -1) {
      return { status: 'unknown', canPatch: false, reason: 'v2.1.289 pCn signature not found — wrong version?' };
    }
    let unpatched = 0,
      patched = 0;
    for (const p of PATCHES) {
      if (data.indexOf(p.search) !== -1) unpatched++;
      if (data.indexOf(p.replace) !== -1) patched++;
    }
    const bc = bytecodeState(data);
    if (!bc.ok) return { status: 'unknown', canPatch: false, reason: 'Bun module graph not parseable: ' + bc.reason };
    const bcDone = RESTORE ? bc.active > 0 || !fs.existsSync(bytecodeBackupPath(inst.path)) : bc.active === 0;
    if (unpatched === 0 && patched === PATCHES.length && !bcDone) {
      return {
        status: 'partial',
        canPatch: true,
        reason: RESTORE
          ? 'bytecode pointers still cleared — will restore'
          : `${bc.active} Bun bytecode pointers still active — patches are inert until cleared`,
      };
    }
    if (unpatched === 0 && patched === PATCHES.length) {
      return { status: 'patched', canPatch: false, variant: 'standard' };
    }
    if (unpatched === PATCHES.length) return { status: 'unpatched', canPatch: true };
    return { status: 'partial', canPatch: true, reason: 'Some patches applied — will complete the set' };
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
      throw new Error(
        `Same-length invariant violated: ${patch.name} (search=${patch.search.length}, replace=${patch.replace.length})`,
      );
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
      const suffix =
        patch.expectedSites && replaced !== patch.expectedSites ? ` (expected ${patch.expectedSites})` : '';
      console.log(`   ✅ ${patch.name}: ${replaced} site(s) patched${suffix}`);
    } else if (data.indexOf(patch.replace) !== -1) {
      console.log(`   ℹ️  ${patch.name}: already patched`);
    } else {
      console.log(`   ⚠️  ${patch.name}: pattern not found (unexpected)`);
    }
    totalReplaced += replaced;
  }

  if (data.length !== originalLength) throw new Error(`Binary length changed: ${data.length} != ${originalLength}`);

  totalReplaced += RESTORE ? restoreBytecode(data, inst.path) : stripBytecode(data, inst.path);

  if (totalReplaced > 0) {
    fs.writeFileSync(inst.path, data);
    if (process.platform === 'darwin') {
      const r = spawnSync('codesign', ['--force', '--sign', '-', inst.path], { stdio: 'pipe', encoding: 'utf8' });
      if (r.status === 0) console.log('   ✅ Re-signed with ad-hoc signature (codesign)');
      else console.log('   ⚠️  codesign failed — binary may fail to launch. stderr: ' + (r.stderr || '').trim());
    }
    return true;
  }
  return PATCHES.every((p) => data.indexOf(p.replace) !== -1);
}

function promptUser(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(question, (a) => {
      rl.close();
      resolve(a.trim().toLowerCase());
    }),
  );
}

async function main() {
  console.log('Claude Code Thinking Display Patcher v2.1.289 (Standard)');
  console.log('============================================================');
  console.log('Binary format (Bun SEA) — same-length byte patches + ad-hoc codesign');
  console.log('Applies: pCn flip + transcript gate bypass (2 sites)\n');

  console.log(`User: ${os.userInfo().username}`);
  console.log(`Home: ${homeDir}\n`);

  console.log('🔍 Scanning for Claude Code installations...\n');
  const installations = getInstallationPaths();

  if (installations.length === 0) {
    console.error('❌ No Claude Code installations found!');
    console.error('Install v2.1.289 via: npm i -g @anthropic-ai/claude-code');
    process.exit(1);
  }

  console.log('Found installations:\n');
  const patchable = [];
  for (let i = 0; i < installations.length; i++) {
    const inst = installations[i];
    const status = checkPatchStatus(inst);
    inst.patchStatus = status;
    const icon =
      status.status === 'patched' ? '✅' : status.status === 'unpatched' || status.status === 'partial' ? '⬚' : '❓';
    let text;
    if (status.status === 'patched') text = RESTORE ? 'UNPATCHED (nothing to restore)' : `PATCHED (${status.variant})`;
    else if (status.status === 'unpatched') text = RESTORE ? 'PATCHED (will restore)' : 'UNPATCHED';
    else if (status.status === 'partial') text = `PARTIAL (${status.reason})`;
    else text = `UNKNOWN (${status.reason})`;
    console.log(`  [${i + 1}] ${icon} ${inst.name} [${inst.format}] - ${text}`);
    console.log(`      ${inst.description}`);
    console.log(`      ${inst.path}\n`);
    if (status.canPatch) patchable.push({ index: i + 1, ...inst });
  }

  if (patchable.length === 0) {
    console.log(RESTORE ? 'ℹ️  Nothing to restore.' : 'ℹ️  No installations need patching.');
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
    console.log(`\nWhich installation(s) would you like to ${RESTORE ? 'restore' : 'patch'}?\n`);
    console.log('  [a] All patchable installations');
    for (const p of patchable) console.log(`  [${p.index}] ${p.name} only`);
    console.log('  [q] Quit without patching\n');
    answer = await promptUser('Enter choice: ');
  }

  if (answer === 'q' || answer === '') {
    console.log('\nExiting without changes.');
    process.exit(0);
  }

  let toPatch = [];
  if (answer === 'a') toPatch = patchable;
  else {
    const num = parseInt(answer);
    const found = patchable.find((p) => p.index === num);
    if (!found) {
      console.log('\n❌ Invalid choice');
      process.exit(1);
    }
    toPatch = [found];
  }

  console.log('\n' + '═'.repeat(50));
  console.log(RESTORE ? 'Reverting patches...' : 'Applying patches...');
  console.log('═'.repeat(50));

  let successCount = 0;
  for (const inst of toPatch) if (applyBinaryPatches(inst)) successCount++;

  console.log('\n' + '═'.repeat(50));
  console.log(`\n✅ Done! ${RESTORE ? 'Restored' : 'Patched'} ${successCount}/${toPatch.length} installation(s)`);
  console.log('\n⚠️  Please restart Claude Code for changes to take effect.\n');
  if (RESTORE) return;
  console.log('Features:');
  console.log('   - pCn flipped: API returns summarized thinking, redact header removed');
  console.log('   - Outer case gate bypassed: thinking + redacted_thinking always render');
  console.log(
    '   - Tip: `showThinkingSummaries: true` + `verbose: true` in settings.json does the same without patching',
  );
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
