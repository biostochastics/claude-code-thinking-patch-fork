#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const readline = require('readline');

// ============================================================
// Claude Code Thinking Custom Style Patcher v2.1.19
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

// Patch patterns for v2.1.19
// Identifiers: oG1 (component), VqA (React), I (Box), f (Text), qO (ThinkingContent), w5 (keybind)
const oG1SearchPattern = 'function oG1(A){let K=a(17),{param:q,addMargin:Y,isTranscriptMode:z,verbose:w,hideInTranscript:H}=A,{thinking:J}=q,X=Y===void 0?!1:Y,O=H===void 0?!1:H,$=w5("app:toggleTranscript","Global","ctrl+o"),_;if(K[0]===Symbol.for("react.memo_cache_sentinel"))_=!1,K[0]=_;else _=K[0];if(!J&&!_)return null;if(O)return null;let G=z||w,W;if(K[1]!==J)W="∴ Thinking",K[1]=J,K[2]=W;else W=K[2];let D=W;if(!G){let N=X?1:0,T;if(K[3]!==$||K[4]!==D)T=VqA.default.createElement(f,{dimColor:!0,italic:!0},D," (",$," to expand)"),K[3]=$,K[4]=D,K[5]=T;else T=K[5];let k;if(K[6]!==N||K[7]!==T)k=VqA.default.createElement(I,{marginTop:N},T),K[6]=N,K[7]=T,K[8]=k;else k=K[8];return k}let j=X?1:0,M;if(K[9]!==D)M=VqA.default.createElement(f,{dimColor:!0,italic:!0},D,"…"),K[9]=D,K[10]=M;else M=K[10];let P;if(K[11]!==J)P=VqA.default.createElement(I,{paddingLeft:2},VqA.default.createElement(qO,null,J)),K[11]=J,K[12]=P;else P=K[12];let V;if(K[13]!==j||K[14]!==M||K[15]!==P)V=VqA.default.createElement(I,{flexDirection:"column",gap:1,marginTop:j,width:"100%"},M,P),K[13]=j,K[14]=M,K[15]=P,K[16]=V;else V=K[16];return V}';

// Custom replacement with peach emoji, orange border, and bold header
// Changes: if(O) -> if(!1), if(!G) -> if(!1), plus custom styling
const oG1CustomReplacement = 'function oG1(A){let K=a(17),{param:q,addMargin:Y,isTranscriptMode:z,verbose:w,hideInTranscript:H}=A,{thinking:J}=q,X=Y===void 0?!1:Y,O=H===void 0?!1:H,$=w5("app:toggleTranscript","Global","ctrl+o"),_;if(K[0]===Symbol.for("react.memo_cache_sentinel"))_=!1,K[0]=_;else _=K[0];if(!J&&!_)return null;if(!1)return null;let G=z||w,W;if(K[1]!==J)W="∴ Thinking",K[1]=J,K[2]=W;else W=K[2];let D=W;if(!1){let N=X?1:0,T;if(K[3]!==$||K[4]!==D)T=VqA.default.createElement(f,{dimColor:!0,italic:!0},D," (",$," to expand)"),K[3]=$,K[4]=D,K[5]=T;else T=K[5];let k;if(K[6]!==N||K[7]!==T)k=VqA.default.createElement(I,{marginTop:N},T),K[6]=N,K[7]=T,K[8]=k;else k=K[8];return k}let j=X?1:0,M;if(K[9]!==D)M=VqA.default.createElement(f,{color:"#FFA500",bold:!0},"🍑 Thinking Process"),K[9]=D,K[10]=M;else M=K[10];let P;if(K[11]!==J)P=VqA.default.createElement(I,{paddingLeft:1,marginTop:1},VqA.default.createElement(qO,null,J)),K[11]=J,K[12]=P;else P=K[12];let V;if(K[13]!==j||K[14]!==M||K[15]!==P)V=VqA.default.createElement(I,{flexDirection:"column",borderStyle:"single",borderColor:"#FFA500",paddingX:1,marginTop:j,width:"100%"},M,P),K[13]=j,K[14]=M,K[15]=P,K[16]=V;else V=K[16];return V}';

// Standard replacement (for detection and upgrade)
const oG1StandardReplacement = 'function oG1(A){let K=a(17),{param:q,addMargin:Y,isTranscriptMode:z,verbose:w,hideInTranscript:H}=A,{thinking:J}=q,X=Y===void 0?!1:Y,O=H===void 0?!1:H,$=w5("app:toggleTranscript","Global","ctrl+o"),_;if(K[0]===Symbol.for("react.memo_cache_sentinel"))_=!1,K[0]=_;else _=K[0];if(!J&&!_)return null;if(!1)return null;let G=z||w,W;if(K[1]!==J)W="∴ Thinking",K[1]=J,K[2]=W;else W=K[2];let D=W;if(!1){let N=X?1:0,T;if(K[3]!==$||K[4]!==D)T=VqA.default.createElement(f,{dimColor:!0,italic:!0},D," (",$," to expand)"),K[3]=$,K[4]=D,K[5]=T;else T=K[5];let k;if(K[6]!==N||K[7]!==T)k=VqA.default.createElement(I,{marginTop:N},T),K[6]=N,K[7]=T,K[8]=k;else k=K[8];return k}let j=X?1:0,M;if(K[9]!==D)M=VqA.default.createElement(f,{dimColor:!0,italic:!0},D,"…"),K[9]=D,K[10]=M;else M=K[10];let P;if(K[11]!==J)P=VqA.default.createElement(I,{paddingLeft:2},VqA.default.createElement(qO,null,J)),K[11]=J,K[12]=P;else P=K[12];let V;if(K[13]!==j||K[14]!==M||K[15]!==P)V=VqA.default.createElement(I,{flexDirection:"column",gap:1,marginTop:j,width:"100%"},M,P),K[13]=j,K[14]=M,K[15]=P,K[16]=V;else V=K[16];return V}';

function checkPatchStatus(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for custom peach patched version (this script's target)
    if (content.includes(oG1CustomReplacement)) {
      return { status: 'patched', canPatch: false, variant: 'custom-peach' };
    }

    // Check for standard patched version
    if (content.includes(oG1StandardReplacement)) {
      return { status: 'patched-other', canPatch: true, variant: 'standard', note: 'Has standard patch, can upgrade to custom' };
    }

    // Check for any other patch variant (has the if(!1) pattern but different styling)
    if (content.includes('if(!1)return null;') && content.includes('function oG1(A)')) {
      return { status: 'patched', canPatch: false, variant: 'custom-other' };
    }

    // Check for unpatched original
    if (content.includes(oG1SearchPattern)) {
      return { status: 'unpatched', canPatch: true };
    }

    // Check if it's a different version (has oG1 but different pattern)
    if (content.includes('function oG1(A)')) {
      return { status: 'unknown', canPatch: false, reason: 'Different version or structure' };
    }

    // Check for older v2.1.x versions (WkA function)
    if (content.includes('function WkA({param:{thinking:A}')) {
      return { status: 'unknown', canPatch: false, reason: 'Older version (v2.1.4-v2.1.12) - use patch-thinking-v2.1.12-custom.js' };
    }

    return { status: 'unknown', canPatch: false, reason: 'oG1 function not found (wrong version?)' };
  } catch (e) {
    return { status: 'error', canPatch: false, reason: e.message };
  }
}

function applyPatch(installation) {
  console.log(`\nPatching: ${installation.name}`);
  console.log(`Path: ${installation.path}`);

  let content = fs.readFileSync(installation.path, 'utf8');

  if (content.includes(oG1CustomReplacement)) {
    console.log('   ⚠️  Already patched (custom peach version)');
    return true;
  }

  // Can patch from standard version too
  if (content.includes(oG1StandardReplacement)) {
    content = content.replace(oG1StandardReplacement, oG1CustomReplacement);
    fs.writeFileSync(installation.path, content, 'utf8');
    console.log('   ✅ Upgraded from standard to custom peach style!');
    console.log('   - Added single-line border with orange (#FFA500) color');
    console.log('   - Changed header to "🍑 Thinking Process" with bold orange text');
    return true;
  }

  if (content.includes(oG1SearchPattern)) {
    content = content.replace(oG1SearchPattern, oG1CustomReplacement);
    fs.writeFileSync(installation.path, content, 'utf8');
    console.log('   ✅ Patch applied successfully!');
    console.log('   - Changed hideInTranscript check: if(O) -> if(!1)');
    console.log('   - Changed visibility check: if(!G) -> if(!1)');
    console.log('   - Added single-line border with orange (#FFA500) color');
    console.log('   - Changed header to "🍑 Thinking Process" with bold orange text');
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
  console.log('Claude Code Thinking Custom Style Patcher v2.1.19');
  console.log('==================================================');
  console.log('For npm-installed Node.js versions\n');
  console.log(`User: ${os.userInfo().username}`);
  console.log(`Home: ${homeDir}\n`);

  // Find all installations
  console.log('🔍 Scanning for Claude Code installations...\n');
  const installations = getInstallationPaths();

  if (installations.length === 0) {
    console.error('❌ No Claude Code installations found!');
    console.error('Please make sure Claude Code v2.1.19 is installed via npm.');
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
      const variantLabel = status.variant === 'custom-peach' ? 'custom 🍑' :
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
      console.log(`📍 Currently active: ${whichClaude}`);
      console.log(`   Resolves to: ${realPath}\n`);
    } catch (e) {
      console.log(`📍 Currently active: ${whichClaude}\n`);
    }
  } else {
    console.log('📍 Could not determine active installation\n');
  }

  if (patchable.length === 0) {
    console.log('ℹ️  No installations need patching (all have custom 🍑 patch or incompatible)');
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
  console.log('   - Header text is "🍑 Thinking Process" in bold orange');
  console.log('   - Improved visual separation from other content');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
