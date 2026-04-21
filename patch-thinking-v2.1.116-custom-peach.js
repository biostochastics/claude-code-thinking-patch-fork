#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');
const readline = require('readline');

// ============================================================
// Claude Code Thinking Display Patcher v2.1.116 (Custom Peach)
//
// FORMAT: v2.1.113+ ships a native Bun SEA binary (bin/claude.exe).
// All replacements must be SAME-LENGTH byte substitutions.
//
// Visual styling IS available via a 5th patch that repurposes the
// dead-code branch (if(!(1||1)){...}) created by patch #2. The
// 25 bytes freed from simplifying dead-code props exactly offsets
// the 25 bytes added by border/color styling in the live path.
//
// Identifiers: Vi_ (component), L5H (React), m (Box), L (Text),
//   pA (ThinkingContent), u97 (cache, 9 slots), jY (Spinner)
// Gate function: RH5 — thinking + redacted_thinking cases patched
// Redact-thinking beta header variable: fZ_
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

// Same-length byte patches for v2.1.116. All `search`/`replace` pairs must
// have identical byte lengths — the binary's Mach-O layout depends on offsets.
const PATCHES = [
  {
    name: 'Redact-thinking beta header disabled',
    search: Buffer.from('if(O&&zFq(H)&&!S8()&&y8().showThinkingSummaries!==!0)_.push(fZ_);'),
    replace: Buffer.from('if(0&&zFq(H)&&!S8()&&y8().showThinkingSummaries!==!0)_.push(fZ_);')
  },
  {
    name: 'Vi_ component always renders expanded',
    search: Buffer.from('function Vi_(H){let _=u97.c(9),{param:q,addMargin:K,isTranscriptMode:O,verbose:T,hideInTranscript:$}=H,{thinking:A}=q,z=K===void 0?!1:K,Y=$===void 0?!1:$;if(!A)return null;if(Y)return null;if(!(O||T)){'),
    replace: Buffer.from('function Vi_(H){let _=u97.c(9),{param:q,addMargin:K,isTranscriptMode:O,verbose:T,hideInTranscript:$}=H,{thinking:A}=q,z=K===void 0?!1:K,Y=$===void 0?!1:$;if(!A)return null;if(0)return null;if(!(1||1)){')
  },
  {
    name: 'RH5 gate — redacted_thinking case always renders',
    search: Buffer.from('case"redacted_thinking":{if(!f&&!$)return null;'),
    replace: Buffer.from('case"redacted_thinking":{if(!1&&!1)return null;')
  },
  {
    name: 'RH5 gate — thinking case always renders',
    search: Buffer.from('case"thinking":{if(!f&&!$)return null;'),
    replace: Buffer.from('case"thinking":{if(!1&&!1)return null;')
  },
  {
    // v2.1.116 API behavior: if thinking.display is unset, server defaults to
    // "omitted" → returns empty thinking blocks (signature only, no text).
    // Force oH="summarized" so every thinking request includes display:"summarized".
    // oH flows into __={type:"adaptive",display:oH} and __={type:"enabled",...,display:oH}.
    // Whitespace pads to 22 bytes to preserve Mach-O offsets.
    name: 'Force thinking.display="summarized" (API returns content, not just signature)',
    search:  Buffer.from('oH=LH?q.display:void 0'),
    replace: Buffer.from('oH="summarized"       ')
  },
  {
    // Dead-code branch (if(!(1||1)){...}) has 25 bytes freed by simplifying
    // props ({dimColor:!0,italic:!0}→{c:!0}, {marginTop:J}→{c:J}) which
    // exactly offsets the 25 bytes added by border+color styling in the live path.
    name: 'Vi_ visual styling — peach border + warning colors',
    search: Buffer.from(
      'let J=z?1:0,P;if(_[0]===Symbol.for("react.memo_cache_sentinel"))' +
      'P=L5H.default.createElement(L,{dimColor:!0,italic:!0},"\\u2234 Thinking"," ",' +
      'L5H.default.createElement(jY,null)),_[0]=P;else P=_[0];' +
      'let X;if(_[1]!==J)X=L5H.default.createElement(m,{marginTop:J},P),_[1]=J,_[2]=X;else X=_[2];return X}' +
      'let j=z?1:0,D;if(_[3]===Symbol.for("react.memo_cache_sentinel"))' +
      'D=L5H.default.createElement(L,{dimColor:!0,italic:!0},"\\u2234 Thinking","\\u2026"),_[3]=D;else D=_[3];' +
      'let f;if(_[4]!==A)f=L5H.default.createElement(m,{paddingLeft:2},' +
      'L5H.default.createElement(pA,{dimColor:!0},A)),_[4]=A,_[5]=f;else f=_[5];' +
      'let M;if(_[6]!==j||_[7]!==f)M=L5H.default.createElement(m,' +
      '{flexDirection:"column",gap:1,marginTop:j,width:"100%"},D,f),' +
      '_[6]=j,_[7]=f,_[8]=M;else M=_[8];return M}'
    ),
    replace: Buffer.from(
      'let J=z?1:0,P;if(_[0]===Symbol.for("react.memo_cache_sentinel"))' +
      'P=L5H.default.createElement(L,{c:!0},"\\u2234 Thinking"," ",' +
      'L5H.default.createElement(jY,null)),_[0]=P;else P=_[0];' +
      'let X;if(_[1]!==J)X=L5H.default.createElement(m,{c:J},P),_[1]=J,_[2]=X;else X=_[2];return X}' +
      'let j=z?1:0,D;if(_[3]===Symbol.for("react.memo_cache_sentinel"))' +
      'D=L5H.default.createElement(L,{color:"warning",bold:!0},"\\ud83c\\udf51 Thinking"),_[3]=D;else D=_[3];' +
      'let f;if(_[4]!==A)f=L5H.default.createElement(m,{paddingLeft:2},' +
      'L5H.default.createElement(pA,null,A)),_[4]=A,_[5]=f;else f=_[5];' +
      'let M;if(_[6]!==j||_[7]!==f)M=L5H.default.createElement(m,' +
      '{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:j},D,f),' +
      '_[6]=j,_[7]=f,_[8]=M;else M=_[8];return M}'
    )
  }
];

function checkPatchStatus(inst) {
  try {
    if (inst.format === 'js') {
      return { status: 'legacy', canPatch: false, reason: 'Legacy cli.js — use pre-v2.1.113 custom-peach patch' };
    }
    const data = fs.readFileSync(inst.path);
    const marker = Buffer.from('function Vi_(H){let _=u97.c(9)');
    if (data.indexOf(marker) === -1) {
      return { status: 'unknown', canPatch: false, reason: 'v2.1.116 Vi_ signature not found — wrong version?' };
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
  console.log('Claude Code Thinking Display Patcher v2.1.116 (Custom Peach)');
  console.log('============================================================');
  console.log('Binary format (Bun SEA) — same-length byte patches + ad-hoc codesign');
  console.log('Applies: gate fix + 🍑 peach border with warning-theme colors\n');

  console.log(`User: ${os.userInfo().username}`);
  console.log(`Home: ${homeDir}\n`);

  console.log('🔍 Scanning for Claude Code installations...\n');
  const installations = getInstallationPaths();

  if (installations.length === 0) {
    console.error('❌ No Claude Code installations found!');
    console.error('Install v2.1.116 via: npm i -g @anthropic-ai/claude-code');
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
  console.log('   - Vi_ component always renders expanded thinking');
  console.log('   - RH5 gate patched: thinking & redacted_thinking render in default mode');
  console.log('     (no need for ctrl+o transcript mode or --verbose flag)');
  console.log('   - 🍑 Visual: warning-color border box + bold header in live render path');
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
