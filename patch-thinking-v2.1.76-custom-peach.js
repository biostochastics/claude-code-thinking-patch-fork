#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const readline = require('readline');

// ============================================================
// Claude Code Thinking Custom Peach Style Patcher v2.1.76
// Now with multi-installation support!
// ============================================================

const homeDir = os.homedir();

// Safe command execution helper
function safeExec(command, args = []) {
  try {
    return execFileSync(command, args, { encoding: 'utf8' }).trim();
  } catch (e) {
    return null;
  }
}

// Known installation paths to check
function getInstallationPaths() {
  const paths = [];

  // 1. ~/.claude/local/ installation (claude update installs here)
  const claudeLocalPath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');
  if (fs.existsSync(claudeLocalPath)) {
    paths.push({
      name: '~/.claude/local/',
      path: claudeLocalPath,
      description: 'Claude managed installation (from `claude update`)'
    });
  }

  // 2. npm global installation (check via npm root -g)
  const npmGlobalRoot = safeExec('npm', ['root', '-g']);
  if (npmGlobalRoot) {
    const npmGlobalPath = path.join(npmGlobalRoot, '@anthropic-ai/claude-code/cli.js');
    if (fs.existsSync(npmGlobalPath) && npmGlobalPath !== claudeLocalPath) {
      paths.push({
        name: 'npm global',
        path: npmGlobalPath,
        description: 'Global npm installation (deprecated but still works)'
      });
    }
  }

  // 3. nvm-managed npm global (might be different from above)
  if (process.env.NVM_DIR) {
    const nodeVersion = process.version;
    const nvmPath = path.join(process.env.NVM_DIR, 'versions/node', nodeVersion, 'lib/node_modules/@anthropic-ai/claude-code/cli.js');
    if (fs.existsSync(nvmPath) && !paths.some(p => p.path === nvmPath)) {
      paths.push({
        name: 'nvm global',
        path: nvmPath,
        description: `nvm-managed installation (Node ${nodeVersion})`
      });
    }
  }

  // 4. Check which claude points to
  const whichClaude = safeExec('which', ['claude']);
  if (whichClaude) {
    try {
      const realPath = fs.realpathSync(whichClaude);
      const cliPath = realPath.endsWith('cli.js') ? realPath : path.join(path.dirname(realPath), 'cli.js');
      if (fs.existsSync(cliPath) && !paths.some(p => p.path === cliPath)) {
        paths.push({
          name: 'PATH claude',
          path: cliPath,
          description: `Current PATH installation (${whichClaude})`
        });
      }
    } catch (e) {
      // Symlink resolution failed
    }
  }

  return paths;
}

// Patch patterns for v2.1.76
// Identifiers: _N1 (component), lY6 (React), m (Box), T (Text), U_ (ThinkingContent), Rq (keybind), A6 (cache)
// Gate function: oTY (gates whether thinking blocks render at all)
const _N1SearchPattern = 'function _N1(A){let q=A6(11),{param:K,addMargin:Y,isTranscriptMode:z,verbose:_,hideInTranscript:w}=A,{thinking:O}=K,$=Y===void 0?!1:Y,H=w===void 0?!1:w,j=Rq("app:toggleTranscript","Global","ctrl+o");if(!O)return null;if(H)return null;if(!(z||_)){let W=$?1:0,Z=`${"\u2234 Thinking"} (${j} to expand)`,G;if(q[0]!==Z)G=lY6.default.createElement(T,{dimColor:!0,italic:!0},Z),q[0]=Z,q[1]=G;else G=q[1];let f;if(q[2]!==W||q[3]!==G)f=lY6.default.createElement(m,{marginTop:W},G),q[2]=W,q[3]=G,q[4]=f;else f=q[4];return f}let M=$?1:0,D;if(q[5]===Symbol.for("react.memo_cache_sentinel"))D=lY6.default.createElement(T,{dimColor:!0,italic:!0},"\u2234 Thinking","\u2026"),q[5]=D;else D=q[5];let X;if(q[6]!==O)X=lY6.default.createElement(m,{paddingLeft:2},lY6.default.createElement(U_,{dimColor:!0},O)),q[6]=O,q[7]=X;else X=q[7];let P;if(q[8]!==M||q[9]!==X)P=lY6.default.createElement(m,{flexDirection:"column",gap:1,marginTop:M,width:"100%"},D,X),q[8]=M,q[9]=X,q[10]=P;else P=q[10];return P}';

// oTY function patterns - this function gates whether thinking blocks are rendered at all
// The check `if(!D&&!w)return null` blocks rendering when not in transcript mode
// We need to change both occurrences (for redacted_thinking and thinking cases) to if(!1)
const oTYSearchPattern = 'case"redacted_thinking":{if(!D&&!w)return null;';
const oTYReplacement = 'case"redacted_thinking":{if(!1)return null;';
const oTYThinkingSearchPattern = 'case"thinking":{if(!D&&!w)return null;';
const oTYThinkingReplacement = 'case"thinking":{if(!1)return null;';

// Redact-thinking beta header - v2.1.76 introduced server-side thinking redaction
// When showThinkingSummaries is not true, the "redact-thinking-2026-02-12" beta header
// is sent to the API, which causes the server to return redacted_thinking blocks
// instead of actual thinking content. We must disable this to receive thinking text.
const redactThinkingSearchPattern = 'if(z&&Bvq(A)&&!q7()&&mA().showThinkingSummaries!==!0&&w8("tengu_quiet_hollow",!1))q.push(wLA);';
const redactThinkingReplacement = 'if(!1)q.push(wLA);';

// Custom replacement with peach emoji, orange border, and bold header
// Changes: if(H) -> if(!1), if(!(z||_)) -> if(!1), plus custom styling
// Uses "warning" theme color for borders (orange-ish) and overflow:hidden for proper rendering
const _N1CustomReplacement = 'function _N1(A){let q=A6(11),{param:K,addMargin:Y,isTranscriptMode:z,verbose:_,hideInTranscript:w}=A,{thinking:O}=K,$=Y===void 0?!1:Y,H=w===void 0?!1:w,j=Rq("app:toggleTranscript","Global","ctrl+o");if(!O)return null;if(!1)return null;if(!1){let W=$?1:0,Z=`${"\u2234 Thinking"} (${j} to expand)`,G;if(q[0]!==Z)G=lY6.default.createElement(T,{dimColor:!0,italic:!0},Z),q[0]=Z,q[1]=G;else G=q[1];let f;if(q[2]!==W||q[3]!==G)f=lY6.default.createElement(m,{marginTop:W},G),q[2]=W,q[3]=G,q[4]=f;else f=q[4];return f}let M=$?1:0,D;if(q[5]===Symbol.for("react.memo_cache_sentinel"))D=lY6.default.createElement(T,{color:"warning",bold:!0},"\ud83c\udf51 Thinking Process"),q[5]=D;else D=q[5];let X;if(q[6]!==O)X=lY6.default.createElement(m,{paddingLeft:1,marginTop:1},lY6.default.createElement(U_,null,O)),q[6]=O,q[7]=X;else X=q[7];let P;if(q[8]!==M||q[9]!==X)P=lY6.default.createElement(m,{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:M,overflow:"hidden"},D,X),q[8]=M,q[9]=X,q[10]=P;else P=q[10];return P}';

// Standard replacement (for detection and upgrade)
const _N1StandardReplacement = 'function _N1(A){let q=A6(11),{param:K,addMargin:Y,isTranscriptMode:z,verbose:_,hideInTranscript:w}=A,{thinking:O}=K,$=Y===void 0?!1:Y,H=w===void 0?!1:w,j=Rq("app:toggleTranscript","Global","ctrl+o");if(!O)return null;if(!1)return null;if(!1){let W=$?1:0,Z=`${"\u2234 Thinking"} (${j} to expand)`,G;if(q[0]!==Z)G=lY6.default.createElement(T,{dimColor:!0,italic:!0},Z),q[0]=Z,q[1]=G;else G=q[1];let f;if(q[2]!==W||q[3]!==G)f=lY6.default.createElement(m,{marginTop:W},G),q[2]=W,q[3]=G,q[4]=f;else f=q[4];return f}let M=$?1:0,D;if(q[5]===Symbol.for("react.memo_cache_sentinel"))D=lY6.default.createElement(T,{dimColor:!0,italic:!0},"\u2234 Thinking","\u2026"),q[5]=D;else D=q[5];let X;if(q[6]!==O)X=lY6.default.createElement(m,{paddingLeft:2},lY6.default.createElement(U_,{dimColor:!0},O)),q[6]=O,q[7]=X;else X=q[7];let P;if(q[8]!==M||q[9]!==X)P=lY6.default.createElement(m,{flexDirection:"column",gap:1,marginTop:M,width:"100%"},D,X),q[8]=M,q[9]=X,q[10]=P;else P=q[10];return P}';

// Old custom replacement pattern (with hex colors - has rendering issues)
const _N1OldCustomReplacement = 'borderColor:"#FFA500",paddingX:1,marginTop:M,width:"100%"';

function checkPatchStatus(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check redact-thinking patch status (v2.1.76+ server-side redaction)
    const redactPatched = content.includes(redactThinkingReplacement);
    const redactNeedsPatching = content.includes(redactThinkingSearchPattern);

    // Check oTY patch status (the outer gate that controls if thinking blocks render at all)
    const oTYPatched = content.includes(oTYReplacement) && content.includes(oTYThinkingReplacement);
    const oTYNeedsPatching = content.includes(oTYSearchPattern) || content.includes(oTYThinkingSearchPattern);

    // Check for new custom peach patched version (this script's target with theme colors)
    if (content.includes(_N1CustomReplacement)) {
      if (oTYPatched && redactPatched) {
        return { status: 'patched', canPatch: false, variant: 'custom-peach-v3' };
      } else if (oTYNeedsPatching || redactNeedsPatching) {
        const missing = [];
        if (oTYNeedsPatching) missing.push('oTY gate');
        if (redactNeedsPatching) missing.push('redact-thinking header');
        return { status: 'patched-other', canPatch: true, variant: 'custom-peach-incomplete', note: `Has _N1 patch but missing: ${missing.join(', ')}` };
      }
      return { status: 'patched', canPatch: false, variant: 'custom-peach-v2' };
    }

    // Check for old custom peach version (with hex colors - can upgrade)
    if (content.includes(_N1OldCustomReplacement) && content.includes('\ud83c\udf51 Thinking Process')) {
      return { status: 'patched-other', canPatch: true, variant: 'custom-peach-v1', note: 'Has old hex-color patch, can upgrade to theme colors' };
    }

    // Check for standard patched version
    if (content.includes(_N1StandardReplacement)) {
      return { status: 'patched-other', canPatch: true, variant: 'standard', note: 'Has standard patch, can upgrade to custom' };
    }

    // Check for any other patch variant (has the if(!1) pattern in _N1 but different styling)
    if (content.includes('function _N1(A)') && content.match(/function _N1\(A\)[^}]*if\(!1\)return null/)) {
      if (oTYNeedsPatching) {
        return { status: 'patched-other', canPatch: true, variant: 'partial-no-oTY', note: '_N1 patched but oTY gate not patched (thinking hidden by default)' };
      }
      return { status: 'patched', canPatch: false, variant: 'custom-other' };
    }

    // Check for unpatched original
    if (content.includes(_N1SearchPattern)) {
      return { status: 'unpatched', canPatch: true };
    }

    // Check if it's a different version (has _N1 but different pattern)
    if (content.includes('function _N1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Different version or structure' };
    }

    // Check for v2.1.74 version (kv1 function)
    if (content.includes('function kv1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.74 detected - use patch-thinking-v2.1.74-custom-peach.js' };
    }

    // Check for v2.1.69 version (LN1 function)
    if (content.includes('function LN1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.69 detected - use patch-thinking-v2.1.69-custom-peach.js' };
    }

    // Check for v2.1.63 version (qN1 function)
    if (content.includes('function qN1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.63 detected - use patch-thinking-v2.1.63-custom-peach.js' };
    }

    // Check for v2.1.50 version (rT1 function)
    if (content.includes('function rT1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.50 detected - use patch-thinking-v2.1.50-custom-peach.js' };
    }

    // Check for v2.1.44 version (dW6 function)
    if (content.includes('function dW6(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.44 detected - use patch-thinking-v2.1.44-custom-peach.js' };
    }

    // Check for v2.1.37 version (Mj6 function)
    if (content.includes('function Mj6(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.37 detected - use patch-thinking-v2.1.37-custom-peach.js' };
    }

    // Check for v2.1.32 version (Cj6 function)
    if (content.includes('function Cj6(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.32 detected - use patch-thinking-v2.1.32-custom-peach.js' };
    }

    // Check for v2.1.30 version (FD6 function)
    if (content.includes('function FD6(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.30 detected - use patch-thinking-v2.1.30-custom-peach.js' };
    }

    // Check for v2.1.19 version (oG1 function)
    if (content.includes('function oG1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.19 detected - use patch-thinking-v2.1.19-custom.js' };
    }

    // Check for older v2.1.x versions (WkA function)
    if (content.includes('function WkA({param:{thinking:A}')) {
      return { status: 'unknown', canPatch: false, reason: 'Older version (v2.1.4-v2.1.12) - use patch-thinking-v2.1.12-custom.js' };
    }

    return { status: 'unknown', canPatch: false, reason: '_N1 function not found (wrong version?)' };
  } catch (e) {
    return { status: 'error', canPatch: false, reason: e.message };
  }
}

// Old _N1 custom replacement (with hex colors - for upgrading)
const _N1OldCustomReplacementFull = 'function _N1(A){let q=A6(11),{param:K,addMargin:Y,isTranscriptMode:z,verbose:_,hideInTranscript:w}=A,{thinking:O}=K,$=Y===void 0?!1:Y,H=w===void 0?!1:w,j=Rq("app:toggleTranscript","Global","ctrl+o");if(!O)return null;if(!1)return null;if(!1){let W=$?1:0,Z=`${"\u2234 Thinking"} (${j} to expand)`,G;if(q[0]!==Z)G=lY6.default.createElement(T,{dimColor:!0,italic:!0},Z),q[0]=Z,q[1]=G;else G=q[1];let f;if(q[2]!==W||q[3]!==G)f=lY6.default.createElement(m,{marginTop:W},G),q[2]=W,q[3]=G,q[4]=f;else f=q[4];return f}let M=$?1:0,D;if(q[5]===Symbol.for("react.memo_cache_sentinel"))D=lY6.default.createElement(T,{color:"#FFA500",bold:!0},"\ud83c\udf51 Thinking Process"),q[5]=D;else D=q[5];let X;if(q[6]!==O)X=lY6.default.createElement(m,{paddingLeft:1,marginTop:1},lY6.default.createElement(U_,null,O)),q[6]=O,q[7]=X;else X=q[7];let P;if(q[8]!==M||q[9]!==X)P=lY6.default.createElement(m,{flexDirection:"column",borderStyle:"single",borderColor:"#FFA500",paddingX:1,marginTop:M,width:"100%"},D,X),q[8]=M,q[9]=X,q[10]=P;else P=q[10];return P}';

function applyPatch(installation) {
  console.log(`\nPatching: ${installation.name}`);
  console.log(`Path: ${installation.path}`);

  let content = fs.readFileSync(installation.path, 'utf8');
  let modified = false;
  let oTYPatched = false;

  // First, patch the redact-thinking beta header (critical for v2.1.76+)
  // Without this, the API returns redacted_thinking blocks with no content
  if (content.includes(redactThinkingSearchPattern)) {
    content = content.replace(redactThinkingSearchPattern, redactThinkingReplacement);
    modified = true;
    console.log('   \u2705 Redact-thinking beta header disabled (API will now return full thinking content)');
  } else if (content.includes(redactThinkingReplacement)) {
    console.log('   \u2139\ufe0f  Redact-thinking already patched');
  }

  // Next, always check and apply oTY patches (the outer gate)
  if (content.includes(oTYSearchPattern)) {
    content = content.replace(oTYSearchPattern, oTYReplacement);
    oTYPatched = true;
    console.log('   \u2705 oTY redacted_thinking gate patched: if(!D&&!w) -> if(!1)');
  }
  if (content.includes(oTYThinkingSearchPattern)) {
    content = content.replace(oTYThinkingSearchPattern, oTYThinkingReplacement);
    oTYPatched = true;
    console.log('   \u2705 oTY thinking gate patched: if(!D&&!w) -> if(!1)');
  }

  // Check if _N1 is already fully patched with custom peach style
  if (content.includes(_N1CustomReplacement)) {
    if (oTYPatched) {
      fs.writeFileSync(installation.path, content, 'utf8');
      console.log('   \u2705 oTY gate patches applied (_N1 was already patched)');
      return true;
    }
    console.log('   \u26a0\ufe0f  Already fully patched (custom peach v3)');
    return true;
  }

  // Upgrade from old hex-color version to new theme-color version
  if (content.includes(_N1OldCustomReplacementFull)) {
    content = content.replace(_N1OldCustomReplacementFull, _N1CustomReplacement);
    modified = true;
    console.log('   \u2705 _N1 upgraded from hex colors to theme colors!');
  }
  // Can patch from standard version too
  else if (content.includes(_N1StandardReplacement)) {
    content = content.replace(_N1StandardReplacement, _N1CustomReplacement);
    modified = true;
    console.log('   \u2705 _N1 upgraded from standard to custom peach style!');
  }
  // Patch fresh from original
  else if (content.includes(_N1SearchPattern)) {
    content = content.replace(_N1SearchPattern, _N1CustomReplacement);
    modified = true;
    console.log('   \u2705 _N1 patch applied!');
    console.log('      - Changed hideInTranscript check: if(H) -> if(!1)');
    console.log('      - Changed visibility check: if(!(z||_)) -> if(!1)');
    console.log('      - Added single-line border with warning theme color');
    console.log('      - Changed header to "\ud83c\udf51 Thinking Process" with bold text');
  }

  if (modified || oTYPatched) {
    fs.writeFileSync(installation.path, content, 'utf8');
    if (!modified && oTYPatched) {
      console.log('   \u2705 oTY gate patches applied successfully!');
    }
    return true;
  } else {
    console.log('   \u274c No patchable patterns found');
    console.log('   This may be wrong version or already modified');
    return false;
  }
}

function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main() {
  console.log('Claude Code Thinking Custom Peach Style Patcher v2.1.76');
  console.log('========================================================');
  console.log('For npm-installed Node.js versions\n');
  console.log(`User: ${os.userInfo().username}`);
  console.log(`Home: ${homeDir}\n`);

  // Find all installations
  console.log('\ud83d\udd0d Scanning for Claude Code installations...\n');
  const installations = getInstallationPaths();

  if (installations.length === 0) {
    console.error('\u274c No Claude Code installations found!');
    console.error('Please make sure Claude Code v2.1.76 is installed via npm.');
    console.error('See: https://code.claude.com/docs/en/setup#npm-installation-deprecated');
    process.exit(1);
  }

  // Check status of each installation
  console.log('Found installations:\n');
  const patchable = [];

  for (let i = 0; i < installations.length; i++) {
    const inst = installations[i];
    const status = checkPatchStatus(inst.path);
    inst.patchStatus = status;

    const statusIcon = status.status === 'patched' ? '\u2705' :
                       status.status === 'patched-other' ? '\ud83d\udd04' :
                       status.status === 'unpatched' ? '\u2b1a' : '\u2753';
    let statusText;
    if (status.status === 'patched') {
      const variantLabel = status.variant === 'custom-peach' ? 'custom \ud83c\udf51' :
                           status.variant === 'custom-other' ? 'custom' : '';
      statusText = `PATCHED (${variantLabel})`;
    } else if (status.status === 'patched-other') {
      statusText = `PATCHED (${status.variant}) - upgradeable`;
    } else if (status.status === 'unpatched') {
      statusText = 'UNPATCHED';
    } else {
      statusText = `UNKNOWN (${status.reason})`;
    }

    console.log(`  [${i + 1}] ${statusIcon} ${inst.name} - ${statusText}`);
    console.log(`      ${inst.description}`);
    console.log(`      ${inst.path}`);
    console.log();

    if (status.canPatch) {
      patchable.push({ index: i + 1, ...inst });
    }
  }

  // Show which one is currently active
  const whichClaude = safeExec('which', ['claude']);
  if (whichClaude) {
    try {
      const realPath = fs.realpathSync(whichClaude);
      console.log(`\ud83d\udccd Currently active: ${whichClaude}`);
      console.log(`   Resolves to: ${realPath}\n`);
    } catch (e) {
      console.log(`\ud83d\udccd Currently active: ${whichClaude}\n`);
    }
  } else {
    console.log('\ud83d\udccd Could not determine active installation\n');
  }

  if (patchable.length === 0) {
    console.log('\u2139\ufe0f  No installations need patching (all have custom \ud83c\udf51 patch or incompatible)');
    process.exit(0);
  }

  // Ask user what to patch
  console.log('\u2500'.repeat(50));
  console.log('\nWhich installation(s) would you like to patch?\n');
  console.log('  [a] All patchable installations');
  for (const p of patchable) {
    console.log(`  [${p.index}] ${p.name} only`);
  }
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
    if (found) {
      toPatch = [found];
    } else {
      console.log('\n\u274c Invalid choice');
      process.exit(1);
    }
  }

  // Apply patches
  console.log('\n' + '\u2550'.repeat(50));
  console.log('Applying patches...');
  console.log('\u2550'.repeat(50));

  let successCount = 0;
  for (const inst of toPatch) {
    if (applyPatch(inst)) {
      successCount++;
    }
  }

  console.log('\n' + '\u2550'.repeat(50));
  console.log(`\n\u2705 Done! Patched ${successCount}/${toPatch.length} installation(s)`);
  console.log('\n\u26a0\ufe0f  Please restart Claude Code for changes to take effect.\n');
  console.log('Custom Style Features:');
  console.log('   - Thinking blocks now have an orange bordered box');
  console.log('   - Header text is "\ud83c\udf51 Thinking Process" in bold orange');
  console.log('   - Improved visual separation from other content');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
