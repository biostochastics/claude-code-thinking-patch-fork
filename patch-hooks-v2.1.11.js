#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Hook Highlighter v2.1.11');
console.log('=====================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.1.11 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

let patchesApplied = 0;

// Patch 1: hook_success - add cyan color
console.log('\nApplying patch 1: hook_success cyan highlight...');
const hookSuccessSearch = 'case"hook_success":if(A.hookEvent==="Stop"||A.hookEvent==="SubagentStop")return null;if(B)return Z6.default.createElement(FI,null,A.hookName," hook succeeded",A.content?`: ${A.content}`:"");return null;';
const hookSuccessReplace = 'case"hook_success":if(A.hookEvent==="Stop"||A.hookEvent==="SubagentStop")return null;if(B)return Z6.default.createElement(FI,{color:"cyan"},A.hookName," hook succeeded",A.content?`: ${A.content}`:"");return null;';

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

// Patch 2: hook_system_message - add cyan color
console.log('\nApplying patch 2: hook_system_message cyan highlight...');
const hookSystemSearch = 'case"hook_system_message":return Z6.default.createElement(FI,null,A.hookName," says: ",A.content);';
const hookSystemReplace = 'case"hook_system_message":return Z6.default.createElement(FI,{color:"cyan"},A.hookName," says: ",A.content);';

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

// Patch 3: hook_permission_decision - add cyan color
console.log('\nApplying patch 3: hook_permission_decision cyan highlight...');
const hookPermissionSearch = 'case"hook_permission_decision":{let Z=A.decision==="allow"?"Allowed":"Denied";return Z6.default.createElement(FI,null,Z," by ",Z6.default.createElement($,{bold:!0},A.hookEvent)," hook")}';
const hookPermissionReplace = 'case"hook_permission_decision":{let Z=A.decision==="allow"?"Allowed":"Denied";return Z6.default.createElement(FI,{color:"cyan"},Z," by ",Z6.default.createElement($,{bold:!0},A.hookEvent)," hook")}';

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

// Patch 4: hook_error_during_execution - add cyan color (it's a warning, not critical error)
console.log('\nApplying patch 4: hook_error_during_execution cyan highlight...');
const hookWarningSearch = 'case"hook_error_during_execution":if(A.hookEvent==="Stop"||A.hookEvent==="SubagentStop")return null;if(B)return Z6.default.createElement(FI,null,A.hookName," hook warning: ",A.content);return Z6.default.createElement(FI,null,A.hookName," hook warning");';
const hookWarningReplace = 'case"hook_error_during_execution":if(A.hookEvent==="Stop"||A.hookEvent==="SubagentStop")return null;if(B)return Z6.default.createElement(FI,{color:"cyan"},A.hookName," hook warning: ",A.content);return Z6.default.createElement(FI,{color:"cyan"},A.hookName," hook warning");';

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

// Note: hook_blocking_error and hook_non_blocking_error keep their "error" color (red)
// This makes sense as these are actual errors that should stand out
console.log('\nNote: hook_blocking_error and hook_non_blocking_error retain red "error" color');

// Write file if any patches applied
if (patchesApplied > 0) {
  console.log(`\nWriting patched file (${patchesApplied} patches applied)...`);
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('File written successfully\n');
  console.log('Hook highlighting patch applied!');
  console.log('Please restart Claude Code for changes to take effect.');
  console.log('\nHook Highlight Features:');
  console.log('   - hook_success: cyan');
  console.log('   - hook_system_message: cyan');
  console.log('   - hook_permission_decision: cyan');
  console.log('   - hook_error_during_execution: cyan');
  console.log('   - hook_blocking_error: red (unchanged)');
  console.log('   - hook_non_blocking_error: red (unchanged)');
  console.log('   - hook_stopped_continuation: warning (unchanged)');
  process.exit(0);
} else {
  console.error('\nNo patches applied - patterns may have changed or already patched');
  console.error('This script is for Claude Code v2.1.11');
  process.exit(1);
}
