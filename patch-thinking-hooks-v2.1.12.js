#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const readline = require('readline');

// ============================================================
// Claude Code Thinking + Hooks Combined Patcher v2.1.12
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
        description: 'Global npm installation'
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

// ==================== THINKING PATCH PATTERNS ====================
// v2.1.12 identifiers:
// Component name: WkA, React import: z9A, Keybind lookup: S4()
const WkASearchPattern = 'function WkA({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G,hideInTranscript:Z=!1}){let Y=S4("app:toggleTranscript","Global","ctrl+o");if(!A)return null;if(Z)return null;if(!(B||G))return z9A.default.createElement(j,{marginTop:Q?1:0},z9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (",Y," to expand)"));return z9A.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},z9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking…"),z9A.default.createElement(j,{paddingLeft:2},z9A.default.createElement($D,null,A)))}';

// Custom replacement with peach emoji and orange border
const WkAReplacement = 'function WkA({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G,hideInTranscript:Z=!1}){let Y=S4("app:toggleTranscript","Global","ctrl+o");if(!A)return null;if(!1)return null;if(!1)return z9A.default.createElement(j,{marginTop:Q?1:0},z9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (",Y," to expand)"));return z9A.default.createElement(j,{flexDirection:"column",borderStyle:"single",borderColor:"#FFA500",paddingX:1,marginTop:Q?1:0,width:"100%"},z9A.default.createElement($,{color:"#FFA500",bold:!0},"🍑 Thinking Process"),z9A.default.createElement(j,{paddingLeft:1,marginTop:1},z9A.default.createElement($D,null,A)))}';

// ==================== HOOK PATCH PATTERNS ====================
// React import: G6, Text component: FI
const hookPatches = [
  {
    name: 'hook_success',
    search: 'case"hook_success":if(A.hookEvent==="Stop"||A.hookEvent==="SubagentStop")return null;if(B)return G6.default.createElement(FI,null,A.hookName," hook succeeded",A.content?`: ${A.content}`:"");return null;',
    replace: 'case"hook_success":if(A.hookEvent==="Stop"||A.hookEvent==="SubagentStop")return null;if(B)return G6.default.createElement(FI,{color:"cyan"},A.hookName," hook succeeded",A.content?`: ${A.content}`:"");return null;'
  },
  {
    name: 'hook_system_message',
    search: 'case"hook_system_message":return G6.default.createElement(FI,null,A.hookName," says: ",A.content);',
    replace: 'case"hook_system_message":return G6.default.createElement(FI,{color:"cyan"},A.hookName," says: ",A.content);'
  },
  {
    name: 'hook_permission_decision',
    search: 'case"hook_permission_decision":{let Z=A.decision==="allow"?"Allowed":"Denied";return G6.default.createElement(FI,null,Z," by ",G6.default.createElement($,{bold:!0},A.hookEvent)," hook")}',
    replace: 'case"hook_permission_decision":{let Z=A.decision==="allow"?"Allowed":"Denied";return G6.default.createElement(FI,{color:"cyan"},Z," by ",G6.default.createElement($,{bold:!0},A.hookEvent)," hook")}'
  },
  {
    name: 'hook_error_during_execution',
    search: 'case"hook_error_during_execution":if(A.hookEvent==="Stop"||A.hookEvent==="SubagentStop")return null;if(B)return G6.default.createElement(FI,null,A.hookName," hook warning: ",A.content);return G6.default.createElement(FI,null,A.hookName," hook warning");',
    replace: 'case"hook_error_during_execution":if(A.hookEvent==="Stop"||A.hookEvent==="SubagentStop")return null;if(B)return G6.default.createElement(FI,{color:"cyan"},A.hookName," hook warning: ",A.content);return G6.default.createElement(FI,{color:"cyan"},A.hookName," hook warning");'
  }
];

function checkPatchStatus(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check thinking patch status
    let thinkingStatus = 'unknown';
    if (content.includes(WkAReplacement)) {
      thinkingStatus = 'patched';
    } else if (content.includes('if(!1)return null;if(!1)') && content.includes('🍑 Thinking Process')) {
      thinkingStatus = 'patched';
    } else if (content.includes('if(!1)return null;if(!1)') && content.includes('function WkA({param:{thinking:A}')) {
      thinkingStatus = 'patched-other';
    } else if (content.includes(WkASearchPattern)) {
      thinkingStatus = 'unpatched';
    }

    // Check hooks patch status
    let hooksPatchedCount = 0;
    let hooksUnpatchedCount = 0;
    for (const patch of hookPatches) {
      if (content.includes(patch.replace)) {
        hooksPatchedCount++;
      } else if (content.includes(patch.search)) {
        hooksUnpatchedCount++;
      }
    }

    let hooksStatus = 'unknown';
    if (hooksPatchedCount === hookPatches.length) {
      hooksStatus = 'patched';
    } else if (hooksUnpatchedCount > 0) {
      hooksStatus = 'partial';
    } else if (hooksPatchedCount > 0) {
      hooksStatus = 'partial';
    }

    // Determine overall status
    const canPatch = thinkingStatus === 'unpatched' || hooksUnpatchedCount > 0;

    return {
      status: (thinkingStatus === 'patched' && hooksStatus === 'patched') ? 'patched' :
              canPatch ? 'patchable' : 'partial',
      canPatch,
      thinking: thinkingStatus,
      hooks: hooksStatus,
      hooksDetail: `${hooksPatchedCount}/${hookPatches.length}`
    };
  } catch (e) {
    return { status: 'error', canPatch: false, reason: e.message };
  }
}

function applyPatch(installation) {
  console.log(`\nPatching: ${installation.name}`);
  console.log(`Path: ${installation.path}`);

  let content = fs.readFileSync(installation.path, 'utf8');
  let thinkingApplied = false;
  let hooksApplied = 0;

  // Apply thinking patch
  console.log('\n   --- THINKING PATCH (Custom 🍑) ---');
  if (content.includes(WkAReplacement)) {
    console.log('   ⚠️  Already has custom peach styling');
    thinkingApplied = true;
  } else if (content.includes('if(!1)return null;if(!1)') && content.includes('function WkA({param:{thinking:A}')) {
    console.log('   ⚠️  Has different thinking patch variant');
    thinkingApplied = true;
  } else if (content.includes(WkASearchPattern)) {
    content = content.replace(WkASearchPattern, WkAReplacement);
    console.log('   ✅ Applied custom peach styling');
    console.log('      - Orange border (#FFA500)');
    console.log('      - Header: "🍑 Thinking Process"');
    thinkingApplied = true;
  } else {
    console.log('   ❓ Thinking pattern not found');
  }

  // Apply hooks patches
  console.log('\n   --- HOOKS PATCHES (Cyan) ---');
  for (const patch of hookPatches) {
    if (content.includes(patch.replace)) {
      console.log(`   ⚠️  ${patch.name}: already cyan`);
      hooksApplied++;
    } else if (content.includes(patch.search)) {
      content = content.replace(patch.search, patch.replace);
      console.log(`   ✅ ${patch.name}: now cyan`);
      hooksApplied++;
    } else {
      console.log(`   ❓ ${patch.name}: pattern not found`);
    }
  }

  // Write file if any changes made
  if (thinkingApplied || hooksApplied > 0) {
    fs.writeFileSync(installation.path, content, 'utf8');
    console.log(`\n   📝 File saved`);
  }

  return thinkingApplied || hooksApplied > 0;
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
  console.log('Claude Code Thinking + Hooks Combined Patcher v2.1.12');
  console.log('======================================================');
  console.log('Now with multi-installation support!\n');
  console.log(`User: ${os.userInfo().username}`);
  console.log(`Home: ${homeDir}\n`);

  // Find all installations
  console.log('🔍 Scanning for Claude Code installations...\n');
  const installations = getInstallationPaths();

  if (installations.length === 0) {
    console.error('❌ No Claude Code installations found!');
    console.error('Please make sure Claude Code v2.1.12 is installed.');
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
                       status.status === 'patchable' ? '⬚' :
                       status.status === 'partial' ? '🔶' : '❓';

    let statusText;
    if (status.status === 'patched') {
      statusText = 'FULLY PATCHED';
    } else if (status.status === 'patchable') {
      statusText = `PATCHABLE (thinking: ${status.thinking}, hooks: ${status.hooksDetail})`;
    } else if (status.status === 'partial') {
      statusText = `PARTIAL (thinking: ${status.thinking}, hooks: ${status.hooksDetail})`;
    } else {
      statusText = `UNKNOWN (${status.reason || 'patterns not found'})`;
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
    console.log('ℹ️  No installations need patching (all fully patched or incompatible)');
    console.log('\nCombined Patch Features:');
    console.log('   THINKING (Custom 🍑):');
    console.log('     - Always visible thinking blocks');
    console.log('     - Orange bordered box (#FFA500)');
    console.log('     - Header: "🍑 Thinking Process"');
    console.log('   HOOKS (Cyan):');
    console.log('     - hook_success, hook_system_message,');
    console.log('     - hook_permission_decision, hook_error_during_execution');
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
  console.log('Applying combined patches...');
  console.log('═'.repeat(50));

  let successCount = 0;
  for (const inst of toPatch) {
    if (applyPatch(inst)) {
      successCount++;
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`\n✅ Done! Processed ${successCount}/${toPatch.length} installation(s)`);
  console.log('\n⚠️  Please restart Claude Code for changes to take effect.\n');
  console.log('Combined Patch Features:');
  console.log('   THINKING (Custom 🍑):');
  console.log('     - Always visible thinking blocks');
  console.log('     - Orange bordered box (#FFA500)');
  console.log('     - Header: "🍑 Thinking Process"');
  console.log('   HOOKS (Cyan):');
  console.log('     - hook_success: cyan');
  console.log('     - hook_system_message: cyan');
  console.log('     - hook_permission_decision: cyan');
  console.log('     - hook_error_during_execution: cyan');
  console.log('     - hook_blocking_error: red (unchanged)');
  console.log('     - hook_non_blocking_error: red (unchanged)');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
