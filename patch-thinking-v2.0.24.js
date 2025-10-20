#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Visibility Patcher v2.0.24');
console.log('==============================================\n');
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

let patch1Applied = false;
let patch2Applied = false;

// Apply Patch 1
console.log('Applying Patch 1: sTB banner removal...');
if (content.includes(bannerSearchPattern)) {
  content = content.replace(bannerSearchPattern, bannerReplacement);
  patch1Applied = true;
  console.log('✅ Patch 1 applied: sTB function now returns null');
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
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('✅ File written successfully\n');

  console.log('Summary:');
  console.log(`- Patch 1 (banner): ${patch1Applied ? 'APPLIED' : 'SKIPPED'}`);
  console.log(`- Patch 2 (visibility): ${patch2Applied ? 'APPLIED' : 'SKIPPED'}`);
  console.log('\n🎉 Patches applied! Please restart Claude Code for changes to take effect.');
  process.exit(0);
} else {
  console.error('\n❌ No patches applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.24');
  process.exit(1);
}
