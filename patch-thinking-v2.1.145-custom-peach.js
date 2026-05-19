#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');
const readline = require('readline');

// ============================================================
// Claude Code Thinking Display Patcher v2.1.145 (Custom Peach)
//
// FORMAT: v2.1.113+ ships a native Bun SEA binary (bin/claude.exe).
// All replacements must be SAME-LENGTH byte substitutions.
//
// Visual styling IS available via a 6th patch that repurposes the
// dead-code branch (if(!(1||1)){...}) created by patch #2. The
// bytes freed from simplifying dead-code props offset the bytes
// added by border/color styling in the live path.
//
// Identifiers: NA6 (component), nJH (React), B (Box), V (Text),
//   eA (ThinkingContent), lg7 (cache, 9 slots), IM (Spinner)
// Gate function: Le5 — thinking + redacted_thinking cases patched
// Redact-thinking beta header variable: x4_
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

// Same-length byte patches for v2.1.145. All `search`/`replace` pairs must
// have identical byte lengths — the binary's Mach-O layout depends on offsets.
//
// NA6 destructuring (v2.1.145):
//   {thinking:z}=q,A=K===void 0?!1:K,Y=$===void 0?!1:$
// In v2.1.121 the same roles were named:
//   {thinking:$}=q,z=K===void 0?!1:K,Y=A===void 0?!1:A
// So thinking text moved $→z, addMargin computed z→A, hideInTranscript computed Y→Y.
// In the function body, intermediate locals also changed:
//   compact: M→M, P→X, X→P
//   expanded: D→j, j→J, J→D, f→f
// All swaps keep single-char identifiers so byte length is preserved.
//
// Le5 gate (v2.1.145) destructures isTranscriptMode:D,verbose:$ so its
// thinking-case guard is `if(!D&&!$)return null` (was `if(!J&&!A)` in v2.1.121).
//
// Force-display patch: in v2.1.145 the locals are `x6` and `P6` (were `$_`,`U_`).
const PATCHES = [
  {
    name: 'Redact-thinking beta header disabled',
    search: Buffer.from('if(O&&gD9(H)&&!R8()&&g8().showThinkingSummaries!==!0)_.push(x4_);'),
    replace: Buffer.from('if(0&&gD9(H)&&!R8()&&g8().showThinkingSummaries!==!0)_.push(x4_);')
  },
  {
    name: 'NA6 component always renders expanded',
    search: Buffer.from('function NA6(H){let _=lg7.c(9),{param:q,addMargin:K,isTranscriptMode:O,verbose:T,hideInTranscript:$}=H,{thinking:z}=q,A=K===void 0?!1:K,Y=$===void 0?!1:$;if(!z)return null;if(Y)return null;if(!(O||T)){'),
    replace: Buffer.from('function NA6(H){let _=lg7.c(9),{param:q,addMargin:K,isTranscriptMode:O,verbose:T,hideInTranscript:$}=H,{thinking:z}=q,A=K===void 0?!1:K,Y=$===void 0?!1:$;if(!z)return null;if(0)return null;if(!(1||1)){')
  },
  {
    name: 'Le5 gate — redacted_thinking case always renders',
    search: Buffer.from('case"redacted_thinking":{if(!D&&!$)return null;'),
    replace: Buffer.from('case"redacted_thinking":{if(!1&&!1)return null;')
  },
  {
    name: 'Le5 gate — thinking case always renders',
    search: Buffer.from('case"thinking":{if(!D&&!$)return null;'),
    replace: Buffer.from('case"thinking":{if(!1&&!1)return null;')
  },
  {
    // v2.1.145 API behavior: if thinking.display is unset, server defaults to
    // "omitted" → returns empty thinking blocks (signature only, no text).
    // Force x6="summarized" so every thinking request includes display:"summarized".
    // x6 flows into E8={type:"adaptive",display:x6} and {type:"enabled",...,display:x6}.
    // Whitespace pads to 22 bytes to preserve Mach-O offsets.
    name: 'Force thinking.display="summarized" (API returns content, not just signature)',
    search:  Buffer.from('x6=P6?q.display:void 0'),
    replace: Buffer.from('x6="summarized"       ')
  },
  {
    // Dead-code branch (if(!(1||1)){...}) has bytes freed by simplifying
    // props ({dimColor:!0,italic:!0}→{c:!0}, {marginTop:M}→{c:M}) which
    // offsets the bytes added by border+color styling in the live path.
    // Variable renames inside the body relative to v2.1.121:
    //   addMargin computed: z→A; compact inner P→X; compact wrap X→P;
    //   expanded margin D→j; expanded header element j→J;
    //   thinking content element J→D; final element f→f.
    // Identifier substitutions: c$H→nJH, v→V, p→B, fY→eA, Uf→IM, $→z (thinking text).
    name: 'NA6 visual styling — peach border + warning colors',
    search: Buffer.from(
      'let M=A?1:0,X;if(_[0]===Symbol.for("react.memo_cache_sentinel"))' +
      'X=nJH.default.createElement(V,{dimColor:!0,italic:!0},"\\u2234 Thinking"," ",' +
      'nJH.default.createElement(IM,null)),_[0]=X;else X=_[0];' +
      'let P;if(_[1]!==M)P=nJH.default.createElement(B,{marginTop:M},X),_[1]=M,_[2]=P;else P=_[2];return P}' +
      'let j=A?1:0,J;if(_[3]===Symbol.for("react.memo_cache_sentinel"))' +
      'J=nJH.default.createElement(V,{dimColor:!0,italic:!0},"\\u2234 Thinking","\\u2026"),_[3]=J;else J=_[3];' +
      'let D;if(_[4]!==z)D=nJH.default.createElement(B,{paddingLeft:2},' +
      'nJH.default.createElement(eA,{dimColor:!0},z)),_[4]=z,_[5]=D;else D=_[5];' +
      'let f;if(_[6]!==j||_[7]!==D)f=nJH.default.createElement(B,' +
      '{flexDirection:"column",gap:1,marginTop:j,width:"100%"},J,D),' +
      '_[6]=j,_[7]=D,_[8]=f;else f=_[8];return f}'
    ),
    replace: Buffer.from(
      'let M=A?1:0,X;if(_[0]===Symbol.for("react.memo_cache_sentinel"))' +
      'X=nJH.default.createElement(V,{c:!0},"\\u2234 Thinking"," ",' +
      'nJH.default.createElement(IM,null)),_[0]=X;else X=_[0];' +
      'let P;if(_[1]!==M)P=nJH.default.createElement(B,{c:M},X),_[1]=M,_[2]=P;else P=_[2];return P}' +
      'let j=A?1:0,J;if(_[3]===Symbol.for("react.memo_cache_sentinel"))' +
      'J=nJH.default.createElement(V,{color:"warning",bold:!0},"\\ud83c\\udf51 Thinking"),_[3]=J;else J=_[3];' +
      'let D;if(_[4]!==z)D=nJH.default.createElement(B,{paddingLeft:2},' +
      'nJH.default.createElement(eA,null,z)),_[4]=z,_[5]=D;else D=_[5];' +
      'let f;if(_[6]!==j||_[7]!==D)f=nJH.default.createElement(B,' +
      '{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:j},J,D),' +
      '_[6]=j,_[7]=D,_[8]=f;else f=_[8];return f}'
    )
  }
];

function checkPatchStatus(inst) {
  try {
    if (inst.format === 'js') {
      return { status: 'legacy', canPatch: false, reason: 'Legacy cli.js — use pre-v2.1.113 custom-peach patch' };
    }
    const data = fs.readFileSync(inst.path);
    const marker = Buffer.from('function NA6(H){let _=lg7.c(9)');
    if (data.indexOf(marker) === -1) {
      return { status: 'unknown', canPatch: false, reason: 'v2.1.145 NA6 signature not found — wrong version?' };
    }
    const unpatched = PATCHES.reduce((a, p) => a + (data.indexOf(p.search) !== -1 ? 1 : 0), 0);
    const patched = PATCHES.reduce((a, p) => a + (data.indexOf(p.replace) !== -1 ? 1 : 0), 0);
    if (unpatched === 0 && patched === PATCHES.length) {
      return { status: 'patched', canPatch: false, variant: 'custom-peach' };
    }
    if (unpatched === PATCHES.length) return { status: 'unpatched', canPatch: true };
    // Partial — standard or custom already applied but not gate
    return { status: 'partial', canPatch: true, reason: 'Some patches applied (likely standard/custom) — will complete gate fix' };
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
    if (replaced > 0) console.log(`   ✅ ${patch.name}: ${replaced} site(s) patched`);
    else if (data.indexOf(patch.replace) !== -1) console.log(`   ℹ️  ${patch.name}: already patched`);
    else console.log(`   ⚠️  ${patch.name}: pattern not found (unexpected)`);
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
  console.log('Claude Code Thinking Display Patcher v2.1.145 (Custom Peach)');
  console.log('============================================================');
  console.log('Binary format (Bun SEA) — same-length byte patches + ad-hoc codesign');
  console.log('Applies: gate fix + 🍑 peach border with warning-theme colors\n');

  console.log(`User: ${os.userInfo().username}`);
  console.log(`Home: ${homeDir}\n`);

  console.log('🔍 Scanning for Claude Code installations...\n');
  const installations = getInstallationPaths();

  if (installations.length === 0) {
    console.error('❌ No Claude Code installations found!');
    console.error('Install v2.1.145 via: npm i -g @anthropic-ai/claude-code');
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

  console.log('─'.repeat(50));
  console.log('\nWhich installation(s) would you like to patch?\n');
  console.log('  [a] All patchable installations');
  for (const p of patchable) console.log(`  [${p.index}] ${p.name} only`);
  console.log('  [q] Quit without patching\n');

  const answer = await promptUser('Enter choice: ');
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
  console.log('   - Redact-thinking beta header disabled (full thinking content from API)');
  console.log('   - NA6 component always renders expanded thinking');
  console.log('   - Le5 gate patched: thinking & redacted_thinking render in default mode');
  console.log('     (no need for ctrl+o transcript mode or --verbose flag)');
  console.log('   - 🍑 Visual: warning-color border box + bold header in live render path');
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
