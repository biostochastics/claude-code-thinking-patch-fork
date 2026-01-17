#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Standard Patcher v2.1.11');
console.log('==============================================\n');
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

// Patch: Standard FkA - always show thinking (v2.1.11)
// Component name: FkA (changed from NfA in v2.1.9)
// React import: U9A (changed from V3A)
// Box component: j (changed from T!)
// Text component: $
// Text wrapper: $D (changed from VK)
// Keybind lookup: x4() (changed from v6)
// Parameter: hideInTranscript:Z=!1
const FkASearchPattern = 'function FkA({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G,hideInTranscript:Z=!1}){let Y=x4("app:toggleTranscript","Global","ctrl+o");if(!A)return null;if(Z)return null;if(!(B||G))return U9A.default.createElement(j,{marginTop:Q?1:0},U9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (",Y," to expand)"));return U9A.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},U9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking…"),U9A.default.createElement(j,{paddingLeft:2},U9A.default.createElement($D,null,A)))}';

// Standard replacement: always show thinking by changing conditions to if(!1)
const FkAReplacement = 'function FkA({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G,hideInTranscript:Z=!1}){let Y=x4("app:toggleTranscript","Global","ctrl+o");if(!A)return null;if(!1)return null;if(!1)return U9A.default.createElement(j,{marginTop:Q?1:0},U9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (",Y," to expand)"));return U9A.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},U9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking…"),U9A.default.createElement(j,{paddingLeft:2},U9A.default.createElement($D,null,A)))}';

let patchApplied = false;

// Apply Patch
console.log('Applying patch: standard FkA visibility...');
if (content.includes(FkASearchPattern)) {
  content = content.replace(FkASearchPattern, FkAReplacement);
  patchApplied = true;
  console.log('Patch applied: FkA now always shows thinking');
  console.log('   - Changed hideInTranscript check: if(Z) -> if(!1)');
  console.log('   - Changed visibility check: if(!(B||G)) -> if(!1)');
} else if (content.includes(FkAReplacement)) {
  console.log('Patch already applied (standard version)');
  patchApplied = true;
} else {
  console.log('Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.1.11)');
  console.log('   2. FkA function was modified by another patch');
  console.log('   3. The minified code structure changed');
}

// Write file if patch applied
if (patchApplied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('File written successfully\n');
  console.log('Patch applied! Please restart Claude Code for changes to take effect.');
  console.log('\nStandard Patch Features:');
  console.log('   - Thinking blocks are always visible');
  console.log('   - No styling changes (default appearance)');
  process.exit(0);
} else {
  console.error('\nPatch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.1.11');
  process.exit(1);
}
