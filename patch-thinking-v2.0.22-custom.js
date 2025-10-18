#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Custom Style Patcher v2.0.22');
console.log('==================================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.22 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch 1: YOB Banner Removal (v2.0.22)
const bannerSearchPattern = 'function YOB({streamMode:A}){let[B,Q]=zK1.useState(null),[Z,G]=zK1.useState(null);if(zK1.useEffect(()=>{if(A==="thinking"&&B===null)Q(Date.now());else if(A!=="thinking"&&B!==null)G(Date.now()-B),Q(null)},[A,B]),A==="thinking")return NM.createElement(j,{marginTop:1},NM.createElement($,{dimColor:!0},"∴ Thinking…"));if(Z!==null)return NM.createElement(j,{marginTop:1},NM.createElement($,{dimColor:!0},"∴ Thought for ",Math.max(1,Math.round(Z/1000)),"s"," ",NM.createElement($,{dimColor:!0,bold:!0},"(ctrl+o")," ","to show thinking)"));return null}';
const bannerReplacement = 'function YOB({streamMode:A}){return null}';

// Patch 2: Thinking Visibility (v2.0.22)
const thinkingSearchPattern = 'case"thinking":if(!K)return null;if(D)return null;return e3.createElement(nNB,{addMargin:B,param:A,isTranscriptMode:K});';
const thinkingReplacement = 'case"thinking":if(D)return null;return e3.createElement(nNB,{addMargin:B,param:A,isTranscriptMode:!0});';

// Patch 3: Custom nNB styling with border and color (v2.0.22)
// Original nNB function that we want to replace
const nNBSearchPattern = 'function nNB({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q}){let[Z]=cB();if(!A)return null;if(!Q)return wn.default.createElement(j,{marginTop:B?1:0},wn.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return wn.default.createElement(j,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},wn.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking…"),wn.default.createElement(j,{paddingLeft:2},wn.default.createElement($,{dimColor:!0,italic:!0},FV(A,Z))))}';

// Old green version (for migration from previous versions)
const nNBOldGreenPattern = 'function nNB({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q}){let[Z]=cB();if(!A)return null;if(!Q)return wn.default.createElement(j,{marginTop:B?1:0},wn.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return wn.default.createElement(j,{flexDirection:"column",borderStyle:"single",borderColor:"suggestion",paddingX:1,marginTop:B?1:0,width:"100%"},wn.default.createElement($,{color:"suggestion",bold:!0},"💭 Thinking Process"),wn.default.createElement(j,{paddingLeft:1,marginTop:1},wn.default.createElement($,{dimColor:!0},FV(A,Z))))}';

// Custom nNB with border and orange color (peach emoji)
const nNBReplacement = 'function nNB({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q}){let[Z]=cB();if(!A)return null;if(!Q)return wn.default.createElement(j,{marginTop:B?1:0},wn.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return wn.default.createElement(j,{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:B?1:0,width:"100%"},wn.default.createElement($,{color:"warning",bold:!0},"🍑 Thinking Process"),wn.default.createElement(j,{paddingLeft:1,marginTop:1},wn.default.createElement($,{dimColor:!0},FV(A,Z))))}';

let patch1Applied = false;
let patch2Applied = false;
let patch3Applied = false;

// Apply Patch 1
console.log('Applying Patch 1: YOB banner removal...');
if (content.includes(bannerSearchPattern)) {
  content = content.replace(bannerSearchPattern, bannerReplacement);
  patch1Applied = true;
  console.log('✅ Patch 1 applied: YOB function now returns null');
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
console.log('\nApplying Patch 3: custom nNB styling...');
if (content.includes(nNBSearchPattern)) {
  content = content.replace(nNBSearchPattern, nNBReplacement);
  patch3Applied = true;
  console.log('✅ Patch 3 applied: nNB now has custom border and colors');
  console.log('   • Added single-line border with orange/warning color');
  console.log('   • Changed header to "🍑 Thinking Process" with bold orange text');
  console.log('   • Adjusted padding and layout');
} else if (content.includes(nNBOldGreenPattern)) {
  content = content.replace(nNBOldGreenPattern, nNBReplacement);
  patch3Applied = true;
  console.log('✅ Patch 3 applied: Updated from green to orange styling');
  console.log('   • Changed border color: green → orange');
  console.log('   • Changed header: 💭 → 🍑');
  console.log('   • Updated text color: green → orange');
} else if (content.includes(nNBReplacement)) {
  console.log('ℹ️  Patch 3 already applied (orange peach version)');
  patch3Applied = true;
} else {
  console.log('⚠️  Patch 3 pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.22)');
  console.log('   2. nNB function was modified by another patch');
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
  console.error('This script is for Claude Code v2.0.22');
  process.exit(1);
}
