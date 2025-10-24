#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Visibility Patcher v2.0.26');
console.log('==============================================\n');
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

// Patch: Thinking Visibility (v2.0.26)
// Based on multi-model consensus analysis (GPT-5, Opus, Gemini)
// Critical: Must remove guard AND force expanded mode
const thinkingSearchPattern = 'case"thinking":if(!V)return null;return Y3.createElement(CTQ,{addMargin:B,param:A,isTranscriptMode:V});';
const thinkingReplacement = 'case"thinking":return Y3.createElement(CTQ,{addMargin:B,param:A,isTranscriptMode:!0});';

let patchApplied = false;

// Apply Patch
console.log('Applying Patch: thinking visibility...');
if (content.includes(thinkingSearchPattern)) {
  content = content.replace(thinkingSearchPattern, thinkingReplacement);
  patchApplied = true;
  console.log('✅ Patch applied: guard removed, thinking content forced visible');
} else {
  console.log('⚠️  Patch pattern not found (may already be patched or version changed)');
}

// Write file if patch applied
if (patchApplied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('✅ File written successfully\n');

  console.log('Summary:');
  console.log('- Guard removed: if(!V)return null');
  console.log('- isTranscriptMode forced to true');
  console.log('- Thinking content will always be visible and expanded');
  console.log('\n🎉 Patch applied! Please restart Claude Code for changes to take effect.');
  process.exit(0);
} else {
  console.error('\n❌ No patch applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.26');
  process.exit(1);
}
