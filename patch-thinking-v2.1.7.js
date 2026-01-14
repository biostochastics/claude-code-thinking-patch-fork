#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Patch v2.1.7');
console.log('====================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.1.7 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch: Thinking Visibility (v2.1.7)
// Component name: gkA (changed from dvA in v2.1.5)
// React import: T6A (changed from s4A)
// Box component: T
// Text component: C (changed from $, back to v2.1.1 naming)
// Text wrapper: JV (changed from QV)
// Keybind lookup: J3() (changed from u4)
// Parameter: hideInTranscript:Z=!1
const thinkingSearchPattern = 'function gkA({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G,hideInTranscript:Z=!1}){let Y=J3("app:toggleTranscript","Global","ctrl+o");if(!A)return null;if(Z)return null;if(!(B||G))return T6A.default.createElement(T,{marginTop:Q?1:0},T6A.default.createElement(C,{dimColor:!0,italic:!0},"∴ Thinking (",Y," to expand)"));return T6A.default.createElement(T,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},T6A.default.createElement(C,{dimColor:!0,italic:!0},"∴ Thinking…"),T6A.default.createElement(T,{paddingLeft:2},T6A.default.createElement(JV,null,A)))}';

const thinkingReplacement = 'function gkA({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G,hideInTranscript:Z=!1}){let Y=J3("app:toggleTranscript","Global","ctrl+o");if(!A)return null;if(!1)return null;if(!1)return T6A.default.createElement(T,{marginTop:Q?1:0},T6A.default.createElement(C,{dimColor:!0,italic:!0},"∴ Thinking (",Y," to expand)"));return T6A.default.createElement(T,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},T6A.default.createElement(C,{dimColor:!0,italic:!0},"∴ Thinking…"),T6A.default.createElement(T,{paddingLeft:2},T6A.default.createElement(JV,null,A)))}';

let patchApplied = false;

// Apply Patch
console.log('Applying patch: thinking visibility...');
if (content.includes(thinkingSearchPattern)) {
  content = content.replace(thinkingSearchPattern, thinkingReplacement);
  patchApplied = true;
  console.log('Patch applied: thinking content forced visible');
  console.log('   Changed: if(Z)return null -> if(!1)return null');
  console.log('   Changed: if(!(B||G)) -> if(!1)');
} else if (content.includes(thinkingReplacement)) {
  console.log('Patch already applied');
  patchApplied = true;
} else {
  console.log('Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.1.7)');
  console.log('   2. gkA function was modified by another patch');
  console.log('   3. The minified code structure changed');
}

// Write file if patch applied
if (patchApplied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('File written successfully\n');
  console.log('Patch applied! Please restart Claude Code for changes to take effect.');
  process.exit(0);
} else {
  console.error('\nPatch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.1.7');
  process.exit(1);
}
