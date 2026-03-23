#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const readline = require('readline');

// ============================================================
// Claude Code Thinking Display Patcher v2.1.81 (Standard)
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

// Patch patterns for v2.1.81
// Identifiers: rE8 (component), A16 (React), B (Box), T (Text), zw (ThinkingContent), z6 (cache)
// Gate function: ty_ (gates whether thinking blocks render at all)
// Note: Keybind helper SK moved to separate E$ sub-component in v2.1.81
const rE8SearchPattern = 'function rE8(A){let q=z6(9),{param:K,addMargin:_,isTranscriptMode:Y,verbose:z,hideInTranscript:w}=A,{thinking:O}=K,$=_===void 0?!1:_,H=w===void 0?!1:w;if(!O)return null;if(H)return null;if(!(Y||z)){let P=$?1:0,W;if(q[0]===Symbol.for("react.memo_cache_sentinel"))W=A16.default.createElement(T,{dimColor:!0,italic:!0},"\u2234 Thinking"," ",A16.default.createElement(E$,null)),q[0]=W;else W=q[0];let f;if(q[1]!==P)f=A16.default.createElement(B,{marginTop:P},W),q[1]=P,q[2]=f;else f=q[2];return f}let J=$?1:0,M;if(q[3]===Symbol.for("react.memo_cache_sentinel"))M=A16.default.createElement(T,{dimColor:!0,italic:!0},"\u2234 Thinking","\u2026"),q[3]=M;else M=q[3];let X;if(q[4]!==O)X=A16.default.createElement(B,{paddingLeft:2},A16.default.createElement(zw,{dimColor:!0},O)),q[4]=O,q[5]=X;else X=q[5];let D;if(q[6]!==J||q[7]!==X)D=A16.default.createElement(B,{flexDirection:"column",gap:1,marginTop:J,width:"100%"},M,X),q[6]=J,q[7]=X,q[8]=D;else D=q[8];return D}';

// Redact-thinking beta header - v2.1.76+ introduced server-side thinking redaction
// When showThinkingSummaries is not true, the "redact-thinking-2026-02-12" beta header
// is sent to the API, which causes the server to return redacted_thinking blocks
// instead of actual thinking content. We must disable this to receive thinking text.
const redactThinkingSearchPattern = 'if(Y&&RC7(A)&&!K7()&&kA().showThinkingSummaries!==!0&&l8("tengu_quiet_hollow",!1))q.push(nIA);';
const redactThinkingReplacement = 'if(!1)q.push(nIA);';

// Standard replacement - just makes thinking visible without custom styling
// Changes: if(H) -> if(!1), if(!(Y||z)) -> if(!1)
const rE8StandardReplacement = 'function rE8(A){let q=z6(9),{param:K,addMargin:_,isTranscriptMode:Y,verbose:z,hideInTranscript:w}=A,{thinking:O}=K,$=_===void 0?!1:_,H=w===void 0?!1:w;if(!O)return null;if(!1)return null;if(!1){let P=$?1:0,W;if(q[0]===Symbol.for("react.memo_cache_sentinel"))W=A16.default.createElement(T,{dimColor:!0,italic:!0},"\u2234 Thinking"," ",A16.default.createElement(E$,null)),q[0]=W;else W=q[0];let f;if(q[1]!==P)f=A16.default.createElement(B,{marginTop:P},W),q[1]=P,q[2]=f;else f=q[2];return f}let J=$?1:0,M;if(q[3]===Symbol.for("react.memo_cache_sentinel"))M=A16.default.createElement(T,{dimColor:!0,italic:!0},"\u2234 Thinking","\u2026"),q[3]=M;else M=q[3];let X;if(q[4]!==O)X=A16.default.createElement(B,{paddingLeft:2},A16.default.createElement(zw,{dimColor:!0},O)),q[4]=O,q[5]=X;else X=q[5];let D;if(q[6]!==J||q[7]!==X)D=A16.default.createElement(B,{flexDirection:"column",gap:1,marginTop:J,width:"100%"},M,X),q[6]=J,q[7]=X,q[8]=D;else D=q[8];return D}';

function checkPatchStatus(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for standard patched version (this script's target)
    if (content.includes(rE8StandardReplacement)) {
      return { status: 'patched', canPatch: false, variant: 'standard' };
    }

    // Check for any custom patch variant (has different styling)
    if (content.includes('if(!1)return null;') && content.includes('function rE8(A)') && content.includes('borderStyle')) {
      return { status: 'patched', canPatch: false, variant: 'custom' };
    }

    // Check for unpatched original
    if (content.includes(rE8SearchPattern)) {
      return { status: 'unpatched', canPatch: true };
    }

    // Check if it's a different version (has rE8 but different pattern)
    if (content.includes('function rE8(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Different version or structure' };
    }

    // Check for v2.1.76 version (_N1 function)
    if (content.includes('function _N1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.76 detected - use patch-thinking-v2.1.76.js' };
    }

    // Check for v2.1.74 version (kv1 function)
    if (content.includes('function kv1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.74 detected - use patch-thinking-v2.1.74.js' };
    }

    // Check for v2.1.69 version (LN1 function)
    if (content.includes('function LN1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.69 detected - use patch-thinking-v2.1.69.js' };
    }

    // Check for v2.1.63 version (qN1 function)
    if (content.includes('function qN1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.63 detected - use patch-thinking-v2.1.63.js' };
    }

    // Check for v2.1.50 version (rT1 function)
    if (content.includes('function rT1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.50 detected - use patch-thinking-v2.1.50.js' };
    }

    // Check for v2.1.44 version (dW6 function)
    if (content.includes('function dW6(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.44 detected - use patch-thinking-v2.1.44.js' };
    }

    // Check for v2.1.37 version (Mj6 function)
    if (content.includes('function Mj6(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.37 detected - use patch-thinking-v2.1.37.js' };
    }

    // Check for v2.1.32 version (Cj6 function)
    if (content.includes('function Cj6(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.32 detected - use patch-thinking-v2.1.32.js' };
    }

    // Check for v2.1.30 version (FD6 function)
    if (content.includes('function FD6(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.30 detected - use patch-thinking-v2.1.30.js' };
    }

    // Check for v2.1.19 version (oG1 function)
    if (content.includes('function oG1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.19 detected - use patch-thinking-v2.1.19.js' };
    }

    // Check for older v2.1.x versions (WkA function)
    if (content.includes('function WkA({param:{thinking:A}')) {
      return { status: 'unknown', canPatch: false, reason: 'Older version (v2.1.4-v2.1.12) - use patch-thinking-v2.1.12.js' };
    }

    return { status: 'unknown', canPatch: false, reason: 'rE8 function not found (wrong version?)' };
  } catch (e) {
    return { status: 'error', canPatch: false, reason: e.message };
  }
}

function applyPatch(installation) {
  console.log(`\nPatching: ${installation.name}`);
  console.log(`Path: ${installation.path}`);

  let content = fs.readFileSync(installation.path, 'utf8');
  let modified = false;

  // First, patch the redact-thinking beta header (critical for v2.1.76+)
  // Without this, the API returns redacted_thinking blocks with no content
  if (content.includes(redactThinkingSearchPattern)) {
    content = content.replace(redactThinkingSearchPattern, redactThinkingReplacement);
    modified = true;
    console.log('   \u2705 Redact-thinking beta header disabled (API will now return full thinking content)');
  } else if (content.includes(redactThinkingReplacement)) {
    console.log('   \u2139\ufe0f  Redact-thinking already patched');
  }

  if (content.includes(rE8StandardReplacement)) {
    if (modified) {
      fs.writeFileSync(installation.path, content, 'utf8');
      console.log('   \u2705 Redact-thinking patch applied (rE8 was already patched)');
      return true;
    }
    console.log('   \u26a0\ufe0f  Already patched (standard version)');
    return true;
  }

  if (content.includes(rE8SearchPattern)) {
    content = content.replace(rE8SearchPattern, rE8StandardReplacement);
    modified = true;
    console.log('   \u2705 rE8 patch applied!');
    console.log('   - Changed hideInTranscript check: if(H) -> if(!1)');
    console.log('   - Changed visibility check: if(!(Y||z)) -> if(!1)');
  }

  if (modified) {
    fs.writeFileSync(installation.path, content, 'utf8');
    return true;
  } else {
    console.log('   \u274c Pattern not found - cannot patch');
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
  console.log('Claude Code Thinking Display Patcher v2.1.81 (Standard)');
  console.log('========================================================');
  console.log('For npm-installed Node.js versions\n');
  console.log(`User: ${os.userInfo().username}`);
  console.log(`Home: ${homeDir}\n`);

  // Find all installations
  console.log('\ud83d\udd0d Scanning for Claude Code installations...\n');
  const installations = getInstallationPaths();

  if (installations.length === 0) {
    console.error('\u274c No Claude Code installations found!');
    console.error('Please make sure Claude Code v2.1.81 is installed via npm.');
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
                       status.status === 'unpatched' ? '\u2b1a' : '\u2753';
    let statusText;
    if (status.status === 'patched') {
      statusText = `PATCHED (${status.variant})`;
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
    console.log('\u2139\ufe0f  No installations need patching (all already patched or incompatible)');
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
  console.log('Features:');
  console.log('   - Thinking blocks are now always visible');
  console.log('   - No need to press ctrl+o to view thinking');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
