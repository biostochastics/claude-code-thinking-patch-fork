#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');
const readline = require('readline');

// ============================================================
// Claude Code Thinking Display Patcher v2.1.204 (Custom Peach)
//
// FORMAT: v2.1.113+ ships a native Bun SEA binary (bin/claude.exe).
// All replacements must be SAME-LENGTH byte substitutions.
//
// Applies the Standard v2.1.204 patches plus visual styling:
//   - Draws a single-line red border box around thinking content
//     (via same-length swap on the outer content Box props)
//   - Forces the multi-line render branch even in default mode
//   - Recolors the ∴ label to red italic
//   - Reduces the now-dead compact branch to `null` (freed bytes
//     are used to fit the border props in the outer Box)
//
// Kf note: Kf is a syntax-highlighter wrapper (see function Kf
// at ~156,145,000 in the __BUN segment). Coloring Kf's props has
// no visible effect because the highlighter overrides child text
// colors. Only the outer Box border and the plain-Text label are
// reliably style-able. This variant reflects that constraint.
//
// v2.1.204 identifiers: Smi (setting gate), Rer (renderer),
//   cit=isTranscriptMode, BY=verbose, fco=thinking content,
//   xtd=multi-line-mode flag, OQo=∴ glyph, Kf=syntax-highlighter,
//   h=Text, A=Box, Ste=jsx-runtime module.
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
      description: 'Pre-v2.1.113 cli.js install — use an older patch (e.g. patch-thinking-v2.1.112-custom-peach.js)'
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

// Same-length byte patches for v2.1.204 binary.
// Standard 3 + styling 4. Every search/replace pair is length-verified below.
const PATCHES = [
  // ── Standard 3 (functional) ───────────────────────────────────────────
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
  },

  // ── Custom Peach visual (2 same-length swaps in Rer body) ─────────────
  //
  // The wide `tfs` swap below subsumes what would otherwise be three
  // narrower patches (force-multi-line, dead-branch styling, multi-line
  // color). It replaces the outer content Box's props with border +
  // color + padding, forces the `!!1` ternary, and reduces the dead
  // compact branch to `null` — the freed bytes exactly offset the border
  // props added on the Box, so total length is preserved.
  // Peach hex `#ffc27a` (matches the v2.1.145 peach). Named "red" rendered as
  // gray on some terminal themes (ANSI palette remap + possible dim inheritance).
  // Hex sends the exact RGB triplet, no palette lookup, no remap.
  //
  // Note on the label: the ∴ label's byte slot (`dimColor:!0,italic:!0` = 21 chars)
  // is too small to fit `color:"#ffc27a"` (15 chars) alongside any Text modifier
  // that keeps the glyph legible (`bold:!0` = 7, `italic:!0` = 9). So the label
  // is left in its default dim-italic form — the peach border on the outer Box
  // is what carries the visual identity.
  {
    name: 'Content Box: peach border + forced multi-line (wide tfs swap)',
    search: Buffer.from('tfs=Ste.jsx(A,{flexDirection:"column",flexGrow:1,children:xtd?Ste.jsx(Kf,{dimColor:!0,children:fco.trim()}):Ste.jsx(h,{dimColor:!0,italic:!0,children:fco.trim().replace(/\\s+/g," ")})})'),
    replace: Buffer.from('tfs=Ste.jsx(A,{borderStyle:"single",borderColor:"#ffc27a",paddingX:1,flexGrow:1,children:!!1?Ste.jsx(Kf,{dimColor:!0,children:fco.trim()}):null                                       })'),
    expectedSites: 1
  },
  // Peach emoji label: swap the ∴ variable reference (`OQo`) for a literal peach
  // emoji via surrogate-pair escape (`🍑` = U+1F351 🍑). The label's
  // byte budget only fits the emoji if we drop the `aria-label`; 14 spaces of
  // padding restore length parity. Screen readers fall back to the emoji glyph
  // as the accessible name (macOS VoiceOver reads "peach").
  {
    name: 'Label swap: peach emoji 🍑 (drops aria-label to fit)',
    search:  Buffer.from('Ste.jsx(h,{"aria-label":"thinking:",dimColor:!0,italic:!0,children:OQo})'),
    replace: Buffer.from('Ste.jsx(h,{              dimColor:!0,italic:!0,children:"\\uD83C\\uDF51"})'),
    expectedSites: 1
  }
];

function checkPatchStatus(inst) {
  try {
    if (inst.format === 'js') {
      return { status: 'legacy', canPatch: false, reason: 'Legacy cli.js — use pre-v2.1.113 custom-peach patch' };
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
      return { status: 'patched', canPatch: false, variant: 'custom-peach' };
    }
    if (unpatched === PATCHES.length) return { status: 'unpatched', canPatch: true };
    return { status: 'partial', canPatch: true, reason: 'Some patches applied (likely standard/custom) — will complete styling' };
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
      throw new Error(`Same-length invariant violated: ${patch.name} (search=${patch.search.length}, replace=${patch.replace.length})`);
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
  console.log('Claude Code Thinking Display Patcher v2.1.204 (Custom Peach)');
  console.log('============================================================');
  console.log('Binary format (Bun SEA) — same-length byte patches + ad-hoc codesign');
  console.log('Applies: Standard v2.1.204 patches + forced multi-line + red styling\n');

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
  console.log('\n⚠️  Please restart Claude Code for changes to take effect.\n');
  console.log('Features:');
  console.log('   - Smi flipped: API returns summarized thinking (Opus 4.7+)');
  console.log('   - Outer case gate bypassed: thinking + redacted_thinking always render');
  console.log('   - Rer defensive: never returns null on empty content');
  console.log('   - Content Box: single-line peach border (#ffc27a) + forced multi-line always');
  console.log('   - Label: 🍑 peach emoji (replaces ∴)');
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
