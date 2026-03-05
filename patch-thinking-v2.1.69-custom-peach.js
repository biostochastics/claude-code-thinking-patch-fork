#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const readline = require('readline');

// ============================================================
// Claude Code Thinking Custom Peach Style Patcher v2.1.69
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

// Patch patterns for v2.1.69
// Identifiers: LN1 (component), Ww6 (React), B (Box), T (Text), zO (ThinkingContent), YK (keybind), K6 (cache)
// Gate function: TcY (gates whether thinking blocks render at all)
const LN1SearchPattern = 'function LN1(A){let q=K6(11),{param:K,addMargin:Y,isTranscriptMode:z,verbose:w,hideInTranscript:_}=A,{thinking:$}=K,O=Y===void 0?!1:Y,H=_===void 0?!1:_,j=YK("app:toggleTranscript","Global","ctrl+o");if(!$)return null;if(H)return null;if(!(z||w)){let W=O?1:0,G=`${"\u2234 Thinking"} (${j} to expand)`,Z;if(q[0]!==G)Z=Ww6.default.createElement(T,{dimColor:!0,italic:!0},G),q[0]=G,q[1]=Z;else Z=q[1];let f;if(q[2]!==W||q[3]!==Z)f=Ww6.default.createElement(B,{marginTop:W},Z),q[2]=W,q[3]=Z,q[4]=f;else f=q[4];return f}let M=O?1:0,D;if(q[5]===Symbol.for("react.memo_cache_sentinel"))D=Ww6.default.createElement(T,{dimColor:!0,italic:!0},"\u2234 Thinking","\u2026"),q[5]=D;else D=q[5];let X;if(q[6]!==$)X=Ww6.default.createElement(B,{paddingLeft:2},Ww6.default.createElement(zO,{dimColor:!0},$)),q[6]=$,q[7]=X;else X=q[7];let P;if(q[8]!==M||q[9]!==X)P=Ww6.default.createElement(B,{flexDirection:"column",gap:1,marginTop:M,width:"100%"},D,X),q[8]=M,q[9]=X,q[10]=P;else P=q[10];return P}';

// TcY function patterns - this function gates whether thinking blocks are rendered at all
// The check `if(!D&&!_)return null` blocks rendering when not in transcript mode
// We need to change both occurrences (for redacted_thinking and thinking cases) to if(!1)
const TcYSearchPattern = 'case"redacted_thinking":{if(!D&&!_)return null;';
const TcYReplacement = 'case"redacted_thinking":{if(!1)return null;';
const TcYThinkingSearchPattern = 'case"thinking":{if(!D&&!_)return null;';
const TcYThinkingReplacement = 'case"thinking":{if(!1)return null;';

// Custom replacement with peach emoji, orange border, and bold header
// Changes: if(H) -> if(!1), if(!(z||w)) -> if(!1), plus custom styling
// Uses "warning" theme color for borders (orange-ish) and overflow:hidden for proper rendering
const LN1CustomReplacement = 'function LN1(A){let q=K6(11),{param:K,addMargin:Y,isTranscriptMode:z,verbose:w,hideInTranscript:_}=A,{thinking:$}=K,O=Y===void 0?!1:Y,H=_===void 0?!1:_,j=YK("app:toggleTranscript","Global","ctrl+o");if(!$)return null;if(!1)return null;if(!1){let W=O?1:0,G=`${"\u2234 Thinking"} (${j} to expand)`,Z;if(q[0]!==G)Z=Ww6.default.createElement(T,{dimColor:!0,italic:!0},G),q[0]=G,q[1]=Z;else Z=q[1];let f;if(q[2]!==W||q[3]!==Z)f=Ww6.default.createElement(B,{marginTop:W},Z),q[2]=W,q[3]=Z,q[4]=f;else f=q[4];return f}let M=O?1:0,D;if(q[5]===Symbol.for("react.memo_cache_sentinel"))D=Ww6.default.createElement(T,{color:"warning",bold:!0},"\ud83c\udf51 Thinking Process"),q[5]=D;else D=q[5];let X;if(q[6]!==$)X=Ww6.default.createElement(B,{paddingLeft:1,marginTop:1},Ww6.default.createElement(zO,null,$)),q[6]=$,q[7]=X;else X=q[7];let P;if(q[8]!==M||q[9]!==X)P=Ww6.default.createElement(B,{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:M,overflow:"hidden"},D,X),q[8]=M,q[9]=X,q[10]=P;else P=q[10];return P}';

// Standard replacement (for detection and upgrade)
const LN1StandardReplacement = 'function LN1(A){let q=K6(11),{param:K,addMargin:Y,isTranscriptMode:z,verbose:w,hideInTranscript:_}=A,{thinking:$}=K,O=Y===void 0?!1:Y,H=_===void 0?!1:_,j=YK("app:toggleTranscript","Global","ctrl+o");if(!$)return null;if(!1)return null;if(!1){let W=O?1:0,G=`${"\u2234 Thinking"} (${j} to expand)`,Z;if(q[0]!==G)Z=Ww6.default.createElement(T,{dimColor:!0,italic:!0},G),q[0]=G,q[1]=Z;else Z=q[1];let f;if(q[2]!==W||q[3]!==Z)f=Ww6.default.createElement(B,{marginTop:W},Z),q[2]=W,q[3]=Z,q[4]=f;else f=q[4];return f}let M=O?1:0,D;if(q[5]===Symbol.for("react.memo_cache_sentinel"))D=Ww6.default.createElement(T,{dimColor:!0,italic:!0},"\u2234 Thinking","\u2026"),q[5]=D;else D=q[5];let X;if(q[6]!==$)X=Ww6.default.createElement(B,{paddingLeft:2},Ww6.default.createElement(zO,{dimColor:!0},$)),q[6]=$,q[7]=X;else X=q[7];let P;if(q[8]!==M||q[9]!==X)P=Ww6.default.createElement(B,{flexDirection:"column",gap:1,marginTop:M,width:"100%"},D,X),q[8]=M,q[9]=X,q[10]=P;else P=q[10];return P}';

// Old custom replacement pattern (with hex colors - has rendering issues)
const LN1OldCustomReplacement = 'borderColor:"#FFA500",paddingX:1,marginTop:M,width:"100%"';

function checkPatchStatus(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check TcY patch status (the outer gate that controls if thinking blocks render at all)
    const tcYPatched = content.includes(TcYReplacement) && content.includes(TcYThinkingReplacement);
    const tcYNeedsPatching = content.includes(TcYSearchPattern) || content.includes(TcYThinkingSearchPattern);

    // Check for new custom peach patched version (this script's target with theme colors)
    if (content.includes(LN1CustomReplacement)) {
      if (tcYPatched) {
        return { status: 'patched', canPatch: false, variant: 'custom-peach-v3' };
      } else if (tcYNeedsPatching) {
        return { status: 'patched-other', canPatch: true, variant: 'custom-peach-v2-no-tcy', note: 'Has LN1 patch but missing TcY gate patch (thinking hidden by default)' };
      }
      return { status: 'patched', canPatch: false, variant: 'custom-peach-v2' };
    }

    // Check for old custom peach version (with hex colors - can upgrade)
    if (content.includes(LN1OldCustomReplacement) && content.includes('\ud83c\udf51 Thinking Process')) {
      return { status: 'patched-other', canPatch: true, variant: 'custom-peach-v1', note: 'Has old hex-color patch, can upgrade to theme colors' };
    }

    // Check for standard patched version
    if (content.includes(LN1StandardReplacement)) {
      return { status: 'patched-other', canPatch: true, variant: 'standard', note: 'Has standard patch, can upgrade to custom' };
    }

    // Check for any other patch variant (has the if(!1) pattern in LN1 but different styling)
    if (content.includes('function LN1(A)') && content.match(/function LN1\(A\)[^}]*if\(!1\)return null/)) {
      if (tcYNeedsPatching) {
        return { status: 'patched-other', canPatch: true, variant: 'partial-no-tcy', note: 'LN1 patched but TcY gate not patched (thinking hidden by default)' };
      }
      return { status: 'patched', canPatch: false, variant: 'custom-other' };
    }

    // Check for unpatched original
    if (content.includes(LN1SearchPattern)) {
      return { status: 'unpatched', canPatch: true };
    }

    // Check if it's a different version (has LN1 but different pattern)
    if (content.includes('function LN1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Different version or structure' };
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

    return { status: 'unknown', canPatch: false, reason: 'LN1 function not found (wrong version?)' };
  } catch (e) {
    return { status: 'error', canPatch: false, reason: e.message };
  }
}

// Old LN1 custom replacement (with hex colors - for upgrading)
const LN1OldCustomReplacementFull = 'function LN1(A){let q=K6(11),{param:K,addMargin:Y,isTranscriptMode:z,verbose:w,hideInTranscript:_}=A,{thinking:$}=K,O=Y===void 0?!1:Y,H=_===void 0?!1:_,j=YK("app:toggleTranscript","Global","ctrl+o");if(!$)return null;if(!1)return null;if(!1){let W=O?1:0,G=`${"\u2234 Thinking"} (${j} to expand)`,Z;if(q[0]!==G)Z=Ww6.default.createElement(T,{dimColor:!0,italic:!0},G),q[0]=G,q[1]=Z;else Z=q[1];let f;if(q[2]!==W||q[3]!==Z)f=Ww6.default.createElement(B,{marginTop:W},Z),q[2]=W,q[3]=Z,q[4]=f;else f=q[4];return f}let M=O?1:0,D;if(q[5]===Symbol.for("react.memo_cache_sentinel"))D=Ww6.default.createElement(T,{color:"#FFA500",bold:!0},"\ud83c\udf51 Thinking Process"),q[5]=D;else D=q[5];let X;if(q[6]!==$)X=Ww6.default.createElement(B,{paddingLeft:1,marginTop:1},Ww6.default.createElement(zO,null,$)),q[6]=$,q[7]=X;else X=q[7];let P;if(q[8]!==M||q[9]!==X)P=Ww6.default.createElement(B,{flexDirection:"column",borderStyle:"single",borderColor:"#FFA500",paddingX:1,marginTop:M,width:"100%"},D,X),q[8]=M,q[9]=X,q[10]=P;else P=q[10];return P}';

function applyPatch(installation) {
  console.log(`\nPatching: ${installation.name}`);
  console.log(`Path: ${installation.path}`);

  let content = fs.readFileSync(installation.path, 'utf8');
  let modified = false;
  let tcYPatched = false;

  // First, always check and apply TcY patches (the outer gate)
  if (content.includes(TcYSearchPattern)) {
    content = content.replace(TcYSearchPattern, TcYReplacement);
    tcYPatched = true;
    console.log('   \u2705 TcY redacted_thinking gate patched: if(!D&&!_) -> if(!1)');
  }
  if (content.includes(TcYThinkingSearchPattern)) {
    content = content.replace(TcYThinkingSearchPattern, TcYThinkingReplacement);
    tcYPatched = true;
    console.log('   \u2705 TcY thinking gate patched: if(!D&&!_) -> if(!1)');
  }

  // Check if LN1 is already fully patched with custom peach style
  if (content.includes(LN1CustomReplacement)) {
    if (tcYPatched) {
      fs.writeFileSync(installation.path, content, 'utf8');
      console.log('   \u2705 TcY gate patches applied (LN1 was already patched)');
      return true;
    }
    console.log('   \u26a0\ufe0f  Already fully patched (custom peach v3)');
    return true;
  }

  // Upgrade from old hex-color version to new theme-color version
  if (content.includes(LN1OldCustomReplacementFull)) {
    content = content.replace(LN1OldCustomReplacementFull, LN1CustomReplacement);
    modified = true;
    console.log('   \u2705 LN1 upgraded from hex colors to theme colors!');
  }
  // Can patch from standard version too
  else if (content.includes(LN1StandardReplacement)) {
    content = content.replace(LN1StandardReplacement, LN1CustomReplacement);
    modified = true;
    console.log('   \u2705 LN1 upgraded from standard to custom peach style!');
  }
  // Patch fresh from original
  else if (content.includes(LN1SearchPattern)) {
    content = content.replace(LN1SearchPattern, LN1CustomReplacement);
    modified = true;
    console.log('   \u2705 LN1 patch applied!');
    console.log('      - Changed hideInTranscript check: if(H) -> if(!1)');
    console.log('      - Changed visibility check: if(!(z||w)) -> if(!1)');
    console.log('      - Added single-line border with warning theme color');
    console.log('      - Changed header to "\ud83c\udf51 Thinking Process" with bold text');
  }

  if (modified || tcYPatched) {
    fs.writeFileSync(installation.path, content, 'utf8');
    if (!modified && tcYPatched) {
      console.log('   \u2705 TcY gate patches applied successfully!');
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
  console.log('Claude Code Thinking Custom Peach Style Patcher v2.1.69');
  console.log('========================================================');
  console.log('For npm-installed Node.js versions\n');
  console.log(`User: ${os.userInfo().username}`);
  console.log(`Home: ${homeDir}\n`);

  // Find all installations
  console.log('\ud83d\udd0d Scanning for Claude Code installations...\n');
  const installations = getInstallationPaths();

  if (installations.length === 0) {
    console.error('\u274c No Claude Code installations found!');
    console.error('Please make sure Claude Code v2.1.69 is installed via npm.');
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
