#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Patch v2.0.69');
console.log('====================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.69 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch: Thinking Visibility (v2.0.69)
// Component name: sU2
// React import: ti
// Box component: j
// Text component: z
// Text wrapper: jM
const thinkingSearchPattern = 'function sU2({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G}){if(!A)return null;if(!(B||G))return ti.default.createElement(j,{marginTop:Q?1:0},ti.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return ti.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},ti.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking…"),ti.default.createElement(j,{paddingLeft:2},ti.default.createElement(z,{dimColor:!0,italic:!0},ti.default.createElement(jM,null,A))))}';

const thinkingReplacement = 'function sU2({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G}){if(!A)return null;if(!1)return ti.default.createElement(j,{marginTop:Q?1:0},ti.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return ti.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},ti.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking…"),ti.default.createElement(j,{paddingLeft:2},ti.default.createElement(z,{dimColor:!0,italic:!0},ti.default.createElement(jM,null,A))))}';

let patchApplied = false;

// Apply Patch
console.log('Applying patch: thinking visibility...');
if (content.includes(thinkingSearchPattern)) {
  content = content.replace(thinkingSearchPattern, thinkingReplacement);
  patchApplied = true;
  console.log('✅ Patch applied: thinking content forced visible');
  console.log('   Changed: if(!(B||G)) → if(!1)');
} else if (content.includes(thinkingReplacement)) {
  console.log('ℹ️  Patch already applied');
  patchApplied = true;
} else {
  console.log('⚠️  Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.69)');
  console.log('   2. sU2 function was modified by another patch');
  console.log('   3. The minified code structure changed');
}

// Write file if patch applied
if (patchApplied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('✅ File written successfully\n');
  console.log('🎉 Patch applied! Please restart Claude Code for changes to take effect.');
  process.exit(0);
} else {
  console.error('\n❌ Patch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.69');
  process.exit(1);
}
