#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Custom Style Patcher v2.0.49');
console.log('==================================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.49 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch: Custom b92 styling with peach emoji and orange border (v2.0.49)
// Component name: b92
// React import: zAA
// Hook: LB
const b92SearchPattern = 'function b92({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G}){let[Z]=LB();if(!A)return null;if(!(B||G))return zAA.default.createElement(j,{marginTop:Q?1:0},zAA.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return zAA.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},zAA.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking…"),zAA.default.createElement(j,{paddingLeft:2},zAA.default.createElement($,{dimColor:!0,italic:!0},QD(A,Z))))}';

// Custom b92 with peach emoji, orange border, and bold header
const b92Replacement = 'function b92({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G}){let[Z]=LB();if(!A)return null;if(!1)return zAA.default.createElement(j,{marginTop:Q?1:0},zAA.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return zAA.default.createElement(j,{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:Q?1:0,width:"100%"},zAA.default.createElement($,{color:"warning",bold:!0},"🍑 Thinking Process"),zAA.default.createElement(j,{paddingLeft:1,marginTop:1},zAA.default.createElement($,{dimColor:!0},QD(A,Z))))}';

let patchApplied = false;

// Apply Patch
console.log('Applying patch: custom b92 styling...');
if (content.includes(b92SearchPattern)) {
  content = content.replace(b92SearchPattern, b92Replacement);
  patchApplied = true;
  console.log('✅ Patch applied: b92 now has custom border and colors');
  console.log('   • Changed visibility check: if(!(B||G)) → if(!1)');
  console.log('   • Added single-line border with orange/warning color');
  console.log('   • Changed header to "🍑 Thinking Process" with bold orange text');
  console.log('   • Adjusted padding and layout');
} else if (content.includes(b92Replacement)) {
  console.log('ℹ️  Patch already applied (peach orange version)');
  patchApplied = true;
} else {
  console.log('⚠️  Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.49)');
  console.log('   2. b92 function was modified by another patch');
  console.log('   3. The minified code structure changed');
}

// Write file if patch applied
if (patchApplied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('✅ File written successfully\n');
  console.log('🎉 Patch applied! Please restart Claude Code for changes to take effect.');
  console.log('\n📝 Custom Style Features:');
  console.log('   - Thinking blocks now have an orange bordered box');
  console.log('   - Header text is "🍑 Thinking Process" in bold orange');
  console.log('   - Improved visual separation from other content');
  process.exit(0);
} else {
  console.error('\n❌ Patch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.49');
  process.exit(1);
}
