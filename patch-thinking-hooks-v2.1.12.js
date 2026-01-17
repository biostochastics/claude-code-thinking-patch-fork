#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking + Hooks Combined Patcher v2.1.12');
console.log('======================================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.1.12 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

let patchesApplied = 0;

// ==================== THINKING CUSTOM STYLE PATCH ====================
console.log('\n--- THINKING CUSTOM STYLE PATCH (Peach + Orange Border) ---');

// v2.1.12 identifiers:
// Component name: WkA (changed from FkA in v2.1.11)
// React import: z9A (changed from U9A)
// Keybind lookup: S4() (changed from x4)
const WkASearchPattern = 'function WkA({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G,hideInTranscript:Z=!1}){let Y=S4("app:toggleTranscript","Global","ctrl+o");if(!A)return null;if(Z)return null;if(!(B||G))return z9A.default.createElement(j,{marginTop:Q?1:0},z9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (",Y," to expand)"));return z9A.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},z9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking…"),z9A.default.createElement(j,{paddingLeft:2},z9A.default.createElement($D,null,A)))}';

// Custom replacement with peach emoji and orange border
const WkAReplacement = 'function WkA({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G,hideInTranscript:Z=!1}){let Y=S4("app:toggleTranscript","Global","ctrl+o");if(!A)return null;if(!1)return null;if(!1)return z9A.default.createElement(j,{marginTop:Q?1:0},z9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (",Y," to expand)"));return z9A.default.createElement(j,{flexDirection:"column",borderStyle:"single",borderColor:"#FFA500",paddingX:1,marginTop:Q?1:0,width:"100%"},z9A.default.createElement($,{color:"#FFA500",bold:!0},"🍑 Thinking Process"),z9A.default.createElement(j,{paddingLeft:1,marginTop:1},z9A.default.createElement($D,null,A)))}';

console.log('Applying patch: WkA custom styling...');
if (content.includes(WkASearchPattern)) {
  content = content.replace(WkASearchPattern, WkAReplacement);
  patchesApplied++;
  console.log('   Applied: Thinking blocks with peach emoji and orange border');
} else if (content.includes(WkAReplacement)) {
  console.log('   Already applied');
  patchesApplied++;
} else {
  console.log('   Pattern not found');
}

// ==================== HOOK HIGHLIGHT PATCHES (CYAN) ====================
console.log('\n--- HOOK HIGHLIGHT PATCHES (CYAN) ---');

// v2.1.12 hook identifiers:
// React import: G6 (changed from Z6 in v2.1.11)
// Text component: FI (unchanged)

// Patch: hook_success - add cyan color
console.log('\nApplying patch: hook_success cyan highlight...');
const hookSuccessSearch = 'case"hook_success":if(A.hookEvent==="Stop"||A.hookEvent==="SubagentStop")return null;if(B)return G6.default.createElement(FI,null,A.hookName," hook succeeded",A.content?`: ${A.content}`:"");return null;';
const hookSuccessReplace = 'case"hook_success":if(A.hookEvent==="Stop"||A.hookEvent==="SubagentStop")return null;if(B)return G6.default.createElement(FI,{color:"cyan"},A.hookName," hook succeeded",A.content?`: ${A.content}`:"");return null;';

if (content.includes(hookSuccessSearch)) {
  content = content.replace(hookSuccessSearch, hookSuccessReplace);
  patchesApplied++;
  console.log('   Applied: hook_success now displays in cyan');
} else if (content.includes(hookSuccessReplace)) {
  console.log('   Already applied');
  patchesApplied++;
} else {
  console.log('   Pattern not found');
}

// Patch: hook_system_message - add cyan color
console.log('\nApplying patch: hook_system_message cyan highlight...');
const hookSystemSearch = 'case"hook_system_message":return G6.default.createElement(FI,null,A.hookName," says: ",A.content);';
const hookSystemReplace = 'case"hook_system_message":return G6.default.createElement(FI,{color:"cyan"},A.hookName," says: ",A.content);';

if (content.includes(hookSystemSearch)) {
  content = content.replace(hookSystemSearch, hookSystemReplace);
  patchesApplied++;
  console.log('   Applied: hook_system_message now displays in cyan');
} else if (content.includes(hookSystemReplace)) {
  console.log('   Already applied');
  patchesApplied++;
} else {
  console.log('   Pattern not found');
}

// Patch: hook_permission_decision - add cyan color
console.log('\nApplying patch: hook_permission_decision cyan highlight...');
const hookPermissionSearch = 'case"hook_permission_decision":{let Z=A.decision==="allow"?"Allowed":"Denied";return G6.default.createElement(FI,null,Z," by ",G6.default.createElement($,{bold:!0},A.hookEvent)," hook")}';
const hookPermissionReplace = 'case"hook_permission_decision":{let Z=A.decision==="allow"?"Allowed":"Denied";return G6.default.createElement(FI,{color:"cyan"},Z," by ",G6.default.createElement($,{bold:!0},A.hookEvent)," hook")}';

if (content.includes(hookPermissionSearch)) {
  content = content.replace(hookPermissionSearch, hookPermissionReplace);
  patchesApplied++;
  console.log('   Applied: hook_permission_decision now displays in cyan');
} else if (content.includes(hookPermissionReplace)) {
  console.log('   Already applied');
  patchesApplied++;
} else {
  console.log('   Pattern not found');
}

// Patch: hook_error_during_execution - add cyan color
console.log('\nApplying patch: hook_error_during_execution cyan highlight...');
const hookWarningSearch = 'case"hook_error_during_execution":if(A.hookEvent==="Stop"||A.hookEvent==="SubagentStop")return null;if(B)return G6.default.createElement(FI,null,A.hookName," hook warning: ",A.content);return G6.default.createElement(FI,null,A.hookName," hook warning");';
const hookWarningReplace = 'case"hook_error_during_execution":if(A.hookEvent==="Stop"||A.hookEvent==="SubagentStop")return null;if(B)return G6.default.createElement(FI,{color:"cyan"},A.hookName," hook warning: ",A.content);return G6.default.createElement(FI,{color:"cyan"},A.hookName," hook warning");';

if (content.includes(hookWarningSearch)) {
  content = content.replace(hookWarningSearch, hookWarningReplace);
  patchesApplied++;
  console.log('   Applied: hook_error_during_execution now displays in cyan');
} else if (content.includes(hookWarningReplace)) {
  console.log('   Already applied');
  patchesApplied++;
} else {
  console.log('   Pattern not found');
}

console.log('\nNote: hook_blocking_error and hook_non_blocking_error retain red "error" color');

// Write file if any patches applied
if (patchesApplied > 0) {
  console.log(`\n========================================`);
  console.log(`Writing patched file (${patchesApplied} patches applied)...`);
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('File written successfully\n');
  console.log('Combined patch applied!');
  console.log('Please restart Claude Code for changes to take effect.');
  console.log('\nPatch Features:');
  console.log('   THINKING (Custom Style):');
  console.log('     - Thinking blocks are always visible');
  console.log('     - Orange bordered box (#FFA500)');
  console.log('     - Header: "🍑 Thinking Process" in bold orange');
  console.log('   HOOKS (cyan highlighting):');
  console.log('     - hook_success: cyan');
  console.log('     - hook_system_message: cyan');
  console.log('     - hook_permission_decision: cyan');
  console.log('     - hook_error_during_execution: cyan');
  console.log('     - hook_blocking_error: red (unchanged)');
  console.log('     - hook_non_blocking_error: red (unchanged)');
  process.exit(0);
} else {
  console.error('\nNo patches applied - patterns may have changed');
  console.error('This script is for Claude Code v2.1.12');
  process.exit(1);
}
