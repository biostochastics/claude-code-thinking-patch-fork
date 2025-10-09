#!/usr/bin/env node

const fs = require('fs');
const path = '/Users/aleks/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js';

console.log('Claude Code Thinking Visibility Patcher v2.0.11');
console.log('==============================================\n');

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(path, 'utf8');

// Patch 1: er2 Banner Removal (v2.0.11)
const bannerSearchPattern = 'function er2({streamMode:A}){let[B,Q]=BY1.useState(null),[Z,G]=BY1.useState(null);if(BY1.useEffect(()=>{if(A==="thinking"&&B===null)Q(Date.now());else if(A!=="thinking"&&B!==null)G(Date.now()-B),Q(null)},[A,B]),A==="thinking")return _E.createElement(S,{marginTop:1},_E.createElement(E,{dimColor:!0},"∴ Thinking…"));if(Z!==null)return _E.createElement(S,{marginTop:1},_E.createElement(E,{dimColor:!0},"∴ Thought for ",Math.max(1,Math.round(Z/1000)),"s"," ",_E.createElement(E,{dimColor:!0,bold:!0},"(ctrl+o")," ","to show thinking)"));return null}';
const bannerReplacement = 'function er2({streamMode:A}){return null}';

// Patch 2: Thinking Visibility (v2.0.11)
const thinkingSearchPattern = 'case"thinking":if(!K)return null;if(z)return null;return _8.createElement(SOB,{addMargin:B,param:A,isTranscriptMode:K});';
const thinkingReplacement = 'case"thinking":if(z)return null;return _8.createElement(SOB,{addMargin:B,param:A,isTranscriptMode:!0});';

let patch1Applied = false;
let patch2Applied = false;

// Apply Patch 1
console.log('Applying Patch 1: er2 banner removal...');
if (content.includes(bannerSearchPattern)) {
  content = content.replace(bannerSearchPattern, bannerReplacement);
  patch1Applied = true;
  console.log('✅ Patch 1 applied: er2 function now returns null');
} else {
  console.log('⚠️  Patch 1 pattern not found (may already be patched or version changed)');
}

// Apply Patch 2
console.log('\nApplying Patch 2: thinking visibility...');
if (content.includes(thinkingSearchPattern)) {
  content = content.replace(thinkingSearchPattern, thinkingReplacement);
  patch2Applied = true;
  console.log('✅ Patch 2 applied: thinking content forced visible');
} else {
  console.log('⚠️  Patch 2 pattern not found (may already be patched or version changed)');
}

// Write file if patches applied
if (patch1Applied || patch2Applied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(path, content, 'utf8');
  console.log('✅ File written successfully\n');

  console.log('Summary:');
  console.log(`- Patch 1 (banner): ${patch1Applied ? 'APPLIED' : 'SKIPPED'}`);
  console.log(`- Patch 2 (visibility): ${patch2Applied ? 'APPLIED' : 'SKIPPED'}`);
  console.log('\n🎉 Patches applied! Please restart Claude Code for changes to take effect.');
  process.exit(0);
} else {
  console.error('\n❌ No patches applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.11');
  process.exit(1);
}
