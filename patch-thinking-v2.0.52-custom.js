#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Custom Style Patcher v2.0.52');
console.log('==================================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.52 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch: Custom o09 styling with peach emoji and orange border (v2.0.52)
// Component name: o09
// React import: x0A
// Hook: OB
// Text helper: wD
const o09SearchPattern = 'function o09({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G}){let[Z]=OB();if(!A)return null;if(!(B||G))return x0A.default.createElement(j,{marginTop:Q?1:0},x0A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return x0A.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},x0A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking…"),x0A.default.createElement(j,{paddingLeft:2},x0A.default.createElement($,{dimColor:!0,italic:!0},wD(A,Z))))}';

// Custom o09 with peach emoji, orange border, and bold header
const o09Replacement = 'function o09({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G}){let[Z]=OB();if(!A)return null;if(!1)return x0A.default.createElement(j,{marginTop:Q?1:0},x0A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return x0A.default.createElement(j,{flexDirection:"column",borderStyle:"single",borderColor:"#FFA500",paddingX:1,marginTop:Q?1:0,width:"100%"},x0A.default.createElement($,{color:"#FFA500",bold:!0},"🍑 Thinking Process"),x0A.default.createElement(j,{paddingLeft:1,marginTop:1},x0A.default.createElement($,{dimColor:!0},wD(A,Z))))}';

let patchApplied = false;

// Apply Patch
console.log('Applying patch: custom o09 styling...');
if (content.includes(o09SearchPattern)) {
  content = content.replace(o09SearchPattern, o09Replacement);
  patchApplied = true;
  console.log('✅ Patch applied: o09 now has custom border and colors');
  console.log('   • Changed visibility check: if(!(B||G)) → if(!1)');
  console.log('   • Added single-line border with orange (#FFA500) color');
  console.log('   • Changed header to "🍑 Thinking Process" with bold orange text');
  console.log('   • Adjusted padding and layout');
} else if (content.includes(o09Replacement)) {
  console.log('ℹ️  Patch already applied (peach orange version)');
  patchApplied = true;
} else {
  console.log('⚠️  Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.52)');
  console.log('   2. o09 function was modified by another patch');
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
  console.error('This script is for Claude Code v2.0.52');
  process.exit(1);
}
