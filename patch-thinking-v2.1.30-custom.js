#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const readline = require('readline');

// ============================================================
// Claude Code Thinking Custom Style Patcher v2.1.30
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

// Patch patterns for v2.1.30
// Identifiers: FD6 (component), A31 (React), h (Box), f (Text), DJ (ThinkingContent), pq (keybind)
const FD6SearchPattern = 'function FD6(A){let q=t(17),{param:K,addMargin:Y,isTranscriptMode:z,hideInTranscript:w}=A,{thinking:H}=K,O=Y===void 0?!1:Y,$=w===void 0?!1:w,_=pq("app:toggleTranscript","Global","ctrl+o"),J;if(q[0]===Symbol.for("react.memo_cache_sentinel"))J=!1,q[0]=J;else J=q[0];if(!H&&!J)return null;if($)return null;let D=z,j;if(q[1]!==H)j="∴ Thinking",q[1]=H,q[2]=j;else j=q[2];let M=j;if(!D){let V=O?1:0,N;if(q[3]!==_||q[4]!==M)N=A31.default.createElement(f,{dimColor:!0,italic:!0},M," (",_," to expand)"),q[3]=_,q[4]=M,q[5]=N;else N=q[5];let T;if(q[6]!==V||q[7]!==N)T=A31.default.createElement(h,{marginTop:V},N),q[6]=V,q[7]=N,q[8]=T;else T=q[8];return T}let P=O?1:0,W;if(q[9]!==M)W=A31.default.createElement(f,{dimColor:!0,italic:!0},M,"…"),q[9]=M,q[10]=W;else W=q[10];let G;if(q[11]!==H)G=A31.default.createElement(h,{paddingLeft:2},A31.default.createElement(DJ,{dimColor:!0},H)),q[11]=H,q[12]=G;else G=q[12];let Z;if(q[13]!==P||q[14]!==W||q[15]!==G)Z=A31.default.createElement(h,{flexDirection:"column",gap:1,marginTop:P,width:"100%"},W,G),q[13]=P,q[14]=W,q[15]=G,q[16]=Z;else Z=q[16];return Z}';

// Custom replacement with orange border and bold header (no emoji)
// Changes: if($) -> if(!1), if(!D) -> if(!1), plus custom styling
const FD6CustomReplacement = 'function FD6(A){let q=t(17),{param:K,addMargin:Y,isTranscriptMode:z,hideInTranscript:w}=A,{thinking:H}=K,O=Y===void 0?!1:Y,$=w===void 0?!1:w,_=pq("app:toggleTranscript","Global","ctrl+o"),J;if(q[0]===Symbol.for("react.memo_cache_sentinel"))J=!1,q[0]=J;else J=q[0];if(!H&&!J)return null;if(!1)return null;let D=z,j;if(q[1]!==H)j="∴ Thinking",q[1]=H,q[2]=j;else j=q[2];let M=j;if(!1){let V=O?1:0,N;if(q[3]!==_||q[4]!==M)N=A31.default.createElement(f,{dimColor:!0,italic:!0},M," (",_," to expand)"),q[3]=_,q[4]=M,q[5]=N;else N=q[5];let T;if(q[6]!==V||q[7]!==N)T=A31.default.createElement(h,{marginTop:V},N),q[6]=V,q[7]=N,q[8]=T;else T=q[8];return T}let P=O?1:0,W;if(q[9]!==M)W=A31.default.createElement(f,{color:"#FFA500",bold:!0},"∴ Thinking"),q[9]=M,q[10]=W;else W=q[10];let G;if(q[11]!==H)G=A31.default.createElement(h,{paddingLeft:1,marginTop:1},A31.default.createElement(DJ,null,H)),q[11]=H,q[12]=G;else G=q[12];let Z;if(q[13]!==P||q[14]!==W||q[15]!==G)Z=A31.default.createElement(h,{flexDirection:"column",borderStyle:"single",borderColor:"#FFA500",paddingX:1,marginTop:P,width:"100%"},W,G),q[13]=P,q[14]=W,q[15]=G,q[16]=Z;else Z=q[16];return Z}';

// Standard replacement (for detection and upgrade)
const FD6StandardReplacement = 'function FD6(A){let q=t(17),{param:K,addMargin:Y,isTranscriptMode:z,hideInTranscript:w}=A,{thinking:H}=K,O=Y===void 0?!1:Y,$=w===void 0?!1:w,_=pq("app:toggleTranscript","Global","ctrl+o"),J;if(q[0]===Symbol.for("react.memo_cache_sentinel"))J=!1,q[0]=J;else J=q[0];if(!H&&!J)return null;if(!1)return null;let D=z,j;if(q[1]!==H)j="∴ Thinking",q[1]=H,q[2]=j;else j=q[2];let M=j;if(!1){let V=O?1:0,N;if(q[3]!==_||q[4]!==M)N=A31.default.createElement(f,{dimColor:!0,italic:!0},M," (",_," to expand)"),q[3]=_,q[4]=M,q[5]=N;else N=q[5];let T;if(q[6]!==V||q[7]!==N)T=A31.default.createElement(h,{marginTop:V},N),q[6]=V,q[7]=N,q[8]=T;else T=q[8];return T}let P=O?1:0,W;if(q[9]!==M)W=A31.default.createElement(f,{dimColor:!0,italic:!0},M,"…"),q[9]=M,q[10]=W;else W=q[10];let G;if(q[11]!==H)G=A31.default.createElement(h,{paddingLeft:2},A31.default.createElement(DJ,{dimColor:!0},H)),q[11]=H,q[12]=G;else G=q[12];let Z;if(q[13]!==P||q[14]!==W||q[15]!==G)Z=A31.default.createElement(h,{flexDirection:"column",gap:1,marginTop:P,width:"100%"},W,G),q[13]=P,q[14]=W,q[15]=G,q[16]=Z;else Z=q[16];return Z}';

function checkPatchStatus(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for custom patched version (this script's target)
    if (content.includes(FD6CustomReplacement)) {
      return { status: 'patched', canPatch: false, variant: 'custom' };
    }

    // Check for standard patched version
    if (content.includes(FD6StandardReplacement)) {
      return { status: 'patched-other', canPatch: true, variant: 'standard', note: 'Has standard patch, can upgrade to custom' };
    }

    // Check for any other patch variant (has the if(!1) pattern but different styling)
    if (content.includes('if(!1)return null;') && content.includes('function FD6(A)')) {
      return { status: 'patched', canPatch: false, variant: 'custom-other' };
    }

    // Check for unpatched original
    if (content.includes(FD6SearchPattern)) {
      return { status: 'unpatched', canPatch: true };
    }

    // Check if it's a different version (has FD6 but different pattern)
    if (content.includes('function FD6(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Different version or structure' };
    }

    // Check for v2.1.19 version (oG1 function)
    if (content.includes('function oG1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Version v2.1.19 detected - use patch-thinking-v2.1.19-custom.js' };
    }

    // Check for older v2.1.x versions (WkA function)
    if (content.includes('function WkA({param:{thinking:A}')) {
      return { status: 'unknown', canPatch: false, reason: 'Older version (v2.1.4-v2.1.12) - use patch-thinking-v2.1.12-custom.js' };
    }

    return { status: 'unknown', canPatch: false, reason: 'FD6 function not found (wrong version?)' };
  } catch (e) {
    return { status: 'error', canPatch: false, reason: e.message };
  }
}

function applyPatch(installation) {
  console.log(`\nPatching: ${installation.name}`);
  console.log(`Path: ${installation.path}`);

  let content = fs.readFileSync(installation.path, 'utf8');

  if (content.includes(FD6CustomReplacement)) {
    console.log('   ⚠️  Already patched (custom version)');
    return true;
  }

  // Can patch from standard version too
  if (content.includes(FD6StandardReplacement)) {
    content = content.replace(FD6StandardReplacement, FD6CustomReplacement);
    fs.writeFileSync(installation.path, content, 'utf8');
    console.log('   ✅ Upgraded from standard to custom style!');
    console.log('   - Added single-line border with orange (#FFA500) color');
    console.log('   - Changed header to "∴ Thinking" with bold orange text');
    return true;
  }

  if (content.includes(FD6SearchPattern)) {
    content = content.replace(FD6SearchPattern, FD6CustomReplacement);
    fs.writeFileSync(installation.path, content, 'utf8');
    console.log('   ✅ Patch applied successfully!');
    console.log('   - Changed hideInTranscript check: if($) -> if(!1)');
    console.log('   - Changed visibility check: if(!D) -> if(!1)');
    console.log('   - Added single-line border with orange (#FFA500) color');
    console.log('   - Changed header to "∴ Thinking" with bold orange text');
    return true;
  } else {
    console.log('   ❌ Pattern not found - cannot patch');
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
  console.log('Claude Code Thinking Custom Style Patcher v2.1.30');
  console.log('==================================================');
  console.log('For npm-installed Node.js versions\n');
  console.log(`User: ${os.userInfo().username}`);
  console.log(`Home: ${homeDir}\n`);

  // Find all installations
  console.log('🔍 Scanning for Claude Code installations...\n');
  const installations = getInstallationPaths();

  if (installations.length === 0) {
    console.error('❌ No Claude Code installations found!');
    console.error('Please make sure Claude Code v2.1.30 is installed via npm.');
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

    const statusIcon = status.status === 'patched' ? '✅' :
                       status.status === 'patched-other' ? '🔄' :
                       status.status === 'unpatched' ? '⬚' : '❓';
    let statusText;
    if (status.status === 'patched') {
      const variantLabel = status.variant === 'custom' ? 'custom' :
                           status.variant === 'custom-other' ? 'custom (other)' : '';
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
      console.log(`📍 Currently active: ${whichClaude}`);
      console.log(`   Resolves to: ${realPath}\n`);
    } catch (e) {
      console.log(`📍 Currently active: ${whichClaude}\n`);
    }
  } else {
    console.log('📍 Could not determine active installation\n');
  }

  if (patchable.length === 0) {
    console.log('ℹ️  No installations need patching (all have custom patch or incompatible)');
    process.exit(0);
  }

  // Ask user what to patch
  console.log('─'.repeat(50));
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
      console.log('\n❌ Invalid choice');
      process.exit(1);
    }
  }

  // Apply patches
  console.log('\n' + '═'.repeat(50));
  console.log('Applying patches...');
  console.log('═'.repeat(50));

  let successCount = 0;
  for (const inst of toPatch) {
    if (applyPatch(inst)) {
      successCount++;
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`\n✅ Done! Patched ${successCount}/${toPatch.length} installation(s)`);
  console.log('\n⚠️  Please restart Claude Code for changes to take effect.\n');
  console.log('Custom Style Features:');
  console.log('   - Thinking blocks now have an orange bordered box');
  console.log('   - Header text is "∴ Thinking" in bold orange');
  console.log('   - Improved visual separation from other content');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
