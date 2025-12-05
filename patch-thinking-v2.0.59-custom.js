#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Custom Style Patcher v2.0.59');
console.log('==================================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.59 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch: Custom F89 styling with peach emoji and orange border (v2.0.59)
// Component name: F89
// React import: MQA
// Hook: qB
// Text helper: fD
const F89SearchPattern = 'function F89({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G}){let[Z]=qB();if(!A)return null;if(!(B||G))return MQA.default.createElement(S,{marginTop:Q?1:0},MQA.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return MQA.default.createElement(S,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},MQA.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking…"),MQA.default.createElement(S,{paddingLeft:2},MQA.default.createElement($,{dimColor:!0,italic:!0},fD(A,Z))))}';

// Custom F89 with peach emoji, orange border, and bold header
const F89Replacement = 'function F89({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G}){let[Z]=qB();if(!A)return null;if(!1)return MQA.default.createElement(S,{marginTop:Q?1:0},MQA.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return MQA.default.createElement(S,{flexDirection:"column",borderStyle:"single",borderColor:"#FFA500",paddingX:1,marginTop:Q?1:0,width:"100%"},MQA.default.createElement($,{color:"#FFA500",bold:!0},"🍑 Thinking Process"),MQA.default.createElement(S,{paddingLeft:1,marginTop:1},MQA.default.createElement($,{dimColor:!0},fD(A,Z))))}';

let patchApplied = false;

// Apply Patch
console.log('Applying patch: custom F89 styling...');
if (content.includes(F89SearchPattern)) {
  content = content.replace(F89SearchPattern, F89Replacement);
  patchApplied = true;
  console.log('✅ Patch applied: F89 now has custom border and colors');
  console.log('   • Changed visibility check: if(!(B||G)) → if(!1)');
  console.log('   • Added single-line border with orange (#FFA500) color');
  console.log('   • Changed header to "🍑 Thinking Process" with bold orange text');
  console.log('   • Adjusted padding and layout');
} else if (content.includes(F89Replacement)) {
  console.log('ℹ️  Patch already applied (peach orange version)');
  patchApplied = true;
} else {
  console.log('⚠️  Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.59)');
  console.log('   2. F89 function was modified by another patch');
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
  console.error('This script is for Claude Code v2.0.59');
  process.exit(1);
}
