#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Custom Style Patcher v2.1.12');
console.log('==================================================\n');
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

// Patch: Custom WkA styling with peach emoji and orange border (v2.1.12)
// Component name: WkA (changed from FkA in v2.1.11)
// React import: z9A (changed from U9A)
// Box component: j (unchanged)
// Text component: $ (unchanged)
// Text wrapper: $D (unchanged)
// Keybind lookup: S4() (changed from x4)
// Parameter: hideInTranscript:Z=!1
const WkASearchPattern = 'function WkA({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G,hideInTranscript:Z=!1}){let Y=S4("app:toggleTranscript","Global","ctrl+o");if(!A)return null;if(Z)return null;if(!(B||G))return z9A.default.createElement(j,{marginTop:Q?1:0},z9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (",Y," to expand)"));return z9A.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},z9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking…"),z9A.default.createElement(j,{paddingLeft:2},z9A.default.createElement($D,null,A)))}';

// Custom WkA with peach emoji, orange border, and bold header
// NOTE: $D is a Box component, cannot be nested inside $ (Text)
// The let Y=S4(...) line is kept but Y is not used in the custom version
const WkAReplacement = 'function WkA({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G,hideInTranscript:Z=!1}){let Y=S4("app:toggleTranscript","Global","ctrl+o");if(!A)return null;if(!1)return null;if(!1)return z9A.default.createElement(j,{marginTop:Q?1:0},z9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (",Y," to expand)"));return z9A.default.createElement(j,{flexDirection:"column",borderStyle:"single",borderColor:"#FFA500",paddingX:1,marginTop:Q?1:0,width:"100%"},z9A.default.createElement($,{color:"#FFA500",bold:!0},"🍑 Thinking Process"),z9A.default.createElement(j,{paddingLeft:1,marginTop:1},z9A.default.createElement($D,null,A)))}';

let patchApplied = false;

// Apply Patch
console.log('Applying patch: custom WkA styling...');
if (content.includes(WkASearchPattern)) {
  content = content.replace(WkASearchPattern, WkAReplacement);
  patchApplied = true;
  console.log('Patch applied: WkA now has custom border and colors');
  console.log('   - Changed hideInTranscript check: if(Z) -> if(!1)');
  console.log('   - Changed visibility check: if(!(B||G)) -> if(!1)');
  console.log('   - Added single-line border with orange (#FFA500) color');
  console.log('   - Changed header to "🍑 Thinking Process" with bold orange text');
  console.log('   - Adjusted padding and layout');
} else if (content.includes(WkAReplacement)) {
  console.log('Patch already applied (peach orange version)');
  patchApplied = true;
} else {
  console.log('Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.1.12)');
  console.log('   2. WkA function was modified by another patch');
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
  console.error('This script is for Claude Code v2.1.12');
  process.exit(1);
}
