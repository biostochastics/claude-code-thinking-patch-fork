#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Custom Style Patcher v2.0.74');
console.log('==================================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.74 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch: Custom co2 styling with peach emoji and orange border (v2.0.74)
// Component name: co2
// React import: Vs
// Box component: T
// Text component: C
// Text wrapper: T$
const co2SearchPattern = 'function co2({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G}){if(!A)return null;if(!(B||G))return Vs.default.createElement(T,{marginTop:Q?1:0},Vs.default.createElement(C,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return Vs.default.createElement(T,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},Vs.default.createElement(C,{dimColor:!0,italic:!0},"∴ Thinking…"),Vs.default.createElement(T,{paddingLeft:2},Vs.default.createElement(C,{dimColor:!0,italic:!0},Vs.default.createElement(T$,null,A))))}';

// Custom co2 with peach emoji, orange border, and bold header
const co2Replacement = 'function co2({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G}){if(!A)return null;if(!1)return Vs.default.createElement(T,{marginTop:Q?1:0},Vs.default.createElement(C,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return Vs.default.createElement(T,{flexDirection:"column",borderStyle:"single",borderColor:"#FFA500",paddingX:1,marginTop:Q?1:0,width:"100%"},Vs.default.createElement(C,{color:"#FFA500",bold:!0},"🍑 Thinking Process"),Vs.default.createElement(T,{paddingLeft:1,marginTop:1},Vs.default.createElement(C,{dimColor:!0},Vs.default.createElement(T$,null,A))))}';

let patchApplied = false;

// Apply Patch
console.log('Applying patch: custom co2 styling...');
if (content.includes(co2SearchPattern)) {
  content = content.replace(co2SearchPattern, co2Replacement);
  patchApplied = true;
  console.log('✅ Patch applied: co2 now has custom border and colors');
  console.log('   • Changed visibility check: if(!(B||G)) → if(!1)');
  console.log('   • Added single-line border with orange (#FFA500) color');
  console.log('   • Changed header to "🍑 Thinking Process" with bold orange text');
  console.log('   • Adjusted padding and layout');
} else if (content.includes(co2Replacement)) {
  console.log('ℹ️  Patch already applied (peach orange version)');
  patchApplied = true;
} else {
  console.log('⚠️  Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.74)');
  console.log('   2. co2 function was modified by another patch');
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
  console.error('This script is for Claude Code v2.0.74');
  process.exit(1);
}
