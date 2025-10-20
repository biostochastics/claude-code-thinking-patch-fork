#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Custom Style Patcher v2.0.24');
console.log('==================================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.24 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch 1: sTB Banner Removal (v2.0.24)
const bannerSearchPattern = 'function sTB({addMargin:A=!1}){return mx0.default.createElement(S,{marginTop:A?1:0},mx0.default.createElement($,{dimColor:!0,italic:!0},"✻ Thinking…"))}';
const bannerReplacement = 'function sTB({addMargin:A=!1}){return null}';

// Patch 2: Thinking Visibility (v2.0.24)
const thinkingSearchPattern = 'case"thinking":if(!K)return null;if(D)return null;return Y7.createElement(nTB,{addMargin:B,param:A,isTranscriptMode:K});';
const thinkingReplacement = 'case"thinking":if(D)return null;return Y7.createElement(nTB,{addMargin:B,param:A,isTranscriptMode:!0});';

// Patch 3: Custom nTB styling with border and color (v2.0.24)
// Original nTB function that we want to replace
const ntbSearchPattern = 'function nTB({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q}){let[Z]=xB();if(!A)return null;if(!Q)return $a.default.createElement(S,{marginTop:B?1:0},$a.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return $a.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},$a.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking…"),$a.default.createElement(S,{paddingLeft:2},$a.default.createElement($,{dimColor:!0,italic:!0},MV(A,Z))))}';

// Custom nTB with border and orange color
const ntbReplacement = 'function nTB({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q}){let[Z]=xB();if(!A)return null;if(!Q)return $a.default.createElement(S,{marginTop:B?1:0},$a.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return $a.default.createElement(S,{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:B?1:0,width:"100%"},$a.default.createElement($,{color:"warning",bold:!0},"🍑 Thinking Process"),$a.default.createElement(S,{paddingLeft:1,marginTop:1},$a.default.createElement($,{dimColor:!0},MV(A,Z))))}';

let patch1Applied = false;
let patch2Applied = false;
let patch3Applied = false;

// Apply Patch 1
console.log('Applying Patch 1: sTB banner removal...');
if (content.includes(bannerSearchPattern)) {
  content = content.replace(bannerSearchPattern, bannerReplacement);
  patch1Applied = true;
  console.log('✅ Patch 1 applied: sTB function now returns null');
} else if (content.includes(bannerReplacement)) {
  console.log('ℹ️  Patch 1 already applied');
  patch1Applied = true;
} else {
  console.log('⚠️  Patch 1 pattern not found (may already be patched or version changed)');
}

// Apply Patch 2
console.log('\nApplying Patch 2: thinking visibility...');
if (content.includes(thinkingSearchPattern)) {
  content = content.replace(thinkingSearchPattern, thinkingReplacement);
  patch2Applied = true;
  console.log('✅ Patch 2 applied: thinking content forced visible');
} else if (content.includes(thinkingReplacement)) {
  console.log('ℹ️  Patch 2 already applied');
  patch2Applied = true;
} else {
  console.log('⚠️  Patch 2 pattern not found (may already be patched or version changed)');
}

// Apply Patch 3
console.log('\nApplying Patch 3: custom nTB styling...');
if (content.includes(ntbSearchPattern)) {
  content = content.replace(ntbSearchPattern, ntbReplacement);
  patch3Applied = true;
  console.log('✅ Patch 3 applied: nTB now has custom border and colors');
  console.log('   • Added single-line border with orange/warning color');
  console.log('   • Changed header to "🍑 Thinking Process" with bold orange text');
  console.log('   • Adjusted padding and layout');
} else if (content.includes(ntbReplacement)) {
  console.log('ℹ️  Patch 3 already applied (orange peach version)');
  patch3Applied = true;
} else {
  console.log('⚠️  Patch 3 pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.24)');
  console.log('   2. nTB function was modified by another patch');
  console.log('   3. The minified code structure changed');
}

// Write file if patches applied
if (patch1Applied || patch2Applied || patch3Applied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('✅ File written successfully\n');

  console.log('Summary:');
  console.log(`- Patch 1 (banner): ${patch1Applied ? 'APPLIED' : 'SKIPPED'}`);
  console.log(`- Patch 2 (visibility): ${patch2Applied ? 'APPLIED' : 'SKIPPED'}`);
  console.log(`- Patch 3 (custom style): ${patch3Applied ? 'APPLIED' : 'SKIPPED'}`);
  console.log('\n🎉 Patches applied! Please restart Claude Code for changes to take effect.');
  console.log('\n📝 Custom Style Features:');
  console.log('   - Thinking blocks now have an orange bordered box');
  console.log('   - Header text is "🍑 Thinking Process" in bold orange');
  console.log('   - Improved visual separation from other content');
  process.exit(0);
} else {
  console.error('\n❌ No patches applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.24');
  process.exit(1);
}
