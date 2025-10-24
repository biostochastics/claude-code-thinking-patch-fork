#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Custom Style Patcher v2.0.26');
console.log('==================================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.26 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch 1: Thinking Visibility (v2.0.26)
// Based on multi-model consensus analysis (GPT-5, Opus, Gemini)
// Critical: Must remove guard AND force expanded mode
const thinkingSearchPattern = 'case"thinking":if(!V)return null;return Y3.createElement(CTQ,{addMargin:B,param:A,isTranscriptMode:V});';
const thinkingReplacement = 'case"thinking":return Y3.createElement(CTQ,{addMargin:B,param:A,isTranscriptMode:!0});';

// Patch 2: Custom CTQ styling with border and color (v2.0.26)
// Original CTQ function
const ctqSearchPattern = 'function CTQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q}){let[I]=RQ();if(!A)return null;if(!Q)return Ta.default.createElement(S,{marginTop:B?1:0},Ta.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return Ta.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},Ta.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking…"),Ta.default.createElement(S,{paddingLeft:2},Ta.default.createElement(z,{dimColor:!0,italic:!0},OF(A,I))))}';

// Custom CTQ with border and orange color
const ctqReplacement = 'function CTQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q}){let[I]=RQ();if(!A)return null;if(!Q)return Ta.default.createElement(S,{marginTop:B?1:0},Ta.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return Ta.default.createElement(S,{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:B?1:0,width:"100%"},Ta.default.createElement(z,{color:"warning",bold:!0},"🍑 Thinking Process"),Ta.default.createElement(S,{paddingLeft:1,marginTop:1},Ta.default.createElement(z,{dimColor:!0},OF(A,I))))}';

let patch1Applied = false;
let patch2Applied = false;

// Apply Patch 1
console.log('Applying Patch 1: thinking visibility...');
if (content.includes(thinkingSearchPattern)) {
  content = content.replace(thinkingSearchPattern, thinkingReplacement);
  patch1Applied = true;
  console.log('✅ Patch 1 applied: guard removed, thinking content forced visible');
} else if (content.includes(thinkingReplacement)) {
  console.log('ℹ️  Patch 1 already applied');
  patch1Applied = true;
} else {
  console.log('⚠️  Patch 1 pattern not found (may already be patched or version changed)');
}

// Apply Patch 2
console.log('\nApplying Patch 2: custom CTQ styling...');
if (content.includes(ctqSearchPattern)) {
  content = content.replace(ctqSearchPattern, ctqReplacement);
  patch2Applied = true;
  console.log('✅ Patch 2 applied: CTQ now has custom border and colors');
} else if (content.includes(ctqReplacement)) {
  console.log('ℹ️  Patch 2 already applied');
  patch2Applied = true;
} else {
  console.log('⚠️  Patch 2 pattern not found (may already be patched or version changed)');
}

// Write file if patches applied
if (patch1Applied || patch2Applied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('✅ File written successfully\n');

  console.log('Summary:');
  console.log(`- Patch 1 (visibility): ${patch1Applied ? 'APPLIED' : 'SKIPPED'}`);
  console.log(`- Patch 2 (custom style): ${patch2Applied ? 'APPLIED' : 'SKIPPED'}`);
  if (patch2Applied) {
    console.log('\nCustom styling applied:');
    console.log('  - Border: single-line orange/warning border');
    console.log('  - Header: "🍑 Thinking Process" in bold orange');
    console.log('  - Content: Indented with padding');
  }
  console.log('\n🎉 Patches applied! Please restart Claude Code for changes to take effect.');
  process.exit(0);
} else {
  console.error('\n❌ No patches applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.26');
  process.exit(1);
}
