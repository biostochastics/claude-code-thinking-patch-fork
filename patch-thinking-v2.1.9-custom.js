#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Custom Style Patcher v2.1.9');
console.log('==================================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.1.9 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch: Custom NfA styling with peach emoji and orange border (v2.1.9)
// Component name: NfA (changed from gkA in v2.1.7)
// React import: V3A (changed from T6A)
// Box component: T
// Text component: C (unchanged)
// Text wrapper: VK (changed from JV)
// Keybind lookup: v6() (changed from J3)
// Parameter: hideInTranscript:Z=!1
const NfASearchPattern = 'function NfA({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G,hideInTranscript:Z=!1}){let Y=v6("app:toggleTranscript","Global","ctrl+o");if(!A)return null;if(Z)return null;if(!(B||G))return V3A.default.createElement(T,{marginTop:Q?1:0},V3A.default.createElement(C,{dimColor:!0,italic:!0},"∴ Thinking (",Y," to expand)"));return V3A.default.createElement(T,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},V3A.default.createElement(C,{dimColor:!0,italic:!0},"∴ Thinking…"),V3A.default.createElement(T,{paddingLeft:2},V3A.default.createElement(VK,null,A)))}';

// Custom NfA with peach emoji, orange border, and bold header
// NOTE: VK is a Box component, cannot be nested inside C (Text)
// The let Y=v6(...) line is kept but Y is not used in the custom version
const NfAReplacement = 'function NfA({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G,hideInTranscript:Z=!1}){let Y=v6("app:toggleTranscript","Global","ctrl+o");if(!A)return null;if(!1)return null;if(!1)return V3A.default.createElement(T,{marginTop:Q?1:0},V3A.default.createElement(C,{dimColor:!0,italic:!0},"∴ Thinking (",Y," to expand)"));return V3A.default.createElement(T,{flexDirection:"column",borderStyle:"single",borderColor:"#FFA500",paddingX:1,marginTop:Q?1:0,width:"100%"},V3A.default.createElement(C,{color:"#FFA500",bold:!0},"🍑 Thinking Process"),V3A.default.createElement(T,{paddingLeft:1,marginTop:1},V3A.default.createElement(VK,null,A)))}';

let patchApplied = false;

// Apply Patch
console.log('Applying patch: custom NfA styling...');
if (content.includes(NfASearchPattern)) {
  content = content.replace(NfASearchPattern, NfAReplacement);
  patchApplied = true;
  console.log('Patch applied: NfA now has custom border and colors');
  console.log('   - Changed hideInTranscript check: if(Z) -> if(!1)');
  console.log('   - Changed visibility check: if(!(B||G)) -> if(!1)');
  console.log('   - Added single-line border with orange (#FFA500) color');
  console.log('   - Changed header to "🍑 Thinking Process" with bold orange text');
  console.log('   - Adjusted padding and layout');
} else if (content.includes(NfAReplacement)) {
  console.log('Patch already applied (peach orange version)');
  patchApplied = true;
} else {
  console.log('Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.1.9)');
  console.log('   2. NfA function was modified by another patch');
  console.log('   3. The minified code structure changed');
}

// Write file if patch applied
if (patchApplied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('File written successfully\n');
  console.log('Patch applied! Please restart Claude Code for changes to take effect.');
  console.log('\nCustom Style Features:');
  console.log('   - Thinking blocks now have an orange bordered box');
  console.log('   - Header text is "🍑 Thinking Process" in bold orange');
  console.log('   - Improved visual separation from other content');
  process.exit(0);
} else {
  console.error('\nPatch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.1.9');
  process.exit(1);
}
