#!/usr/bin/env node

/**
 * Claude Code Thinking Patcher - v2.0.37
 *
 * This patch makes thinking blocks always visible in Claude Code.
 *
 * Version-specific patterns for v2.0.37:
 * - Component name: n$Q (changed from pSQ in v2.0.36)
 * - Hook: EQ() (changed from HQ() in v2.0.36)
 * - React import: Fs.default (changed from hs.default in v2.0.36)
 *
 * Usage:
 *   node patch-thinking-v2.0.37.js
 *
 * To revert:
 *   npm install --force @anthropic-ai/claude-code
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Patcher v2.0.37');
console.log('=====================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.37 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch 1: n$Q Component (v2.0.37)
const n$QOriginalPattern = 'function n$Q({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=EQ();if(!A)return null;if(!(Q||I))return Fs.default.createElement(S,{marginTop:B?1:0},Fs.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return Fs.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},Fs.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),Fs.default.createElement(S,{paddingLeft:2},Fs.default.createElement(w,{dimColor:!0,italic:!0},bC(A,G))))}';

const n$QPatchedPattern = 'function n$Q({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=EQ();if(!A)return null;if(false)return Fs.default.createElement(S,{marginTop:B?1:0},Fs.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return Fs.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},Fs.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),Fs.default.createElement(S,{paddingLeft:2},Fs.default.createElement(w,{dimColor:!0,italic:!0},bC(A,G))))}';

let patchApplied = false;

// Apply Patch
console.log('Applying n$Q visibility fix...');
if (content.includes(n$QPatchedPattern)) {
  console.log('ℹ️  Patch already applied');
  patchApplied = true;
} else if (content.includes(n$QOriginalPattern)) {
  content = content.replace(n$QOriginalPattern, n$QPatchedPattern);
  patchApplied = true;
  console.log('✅ Patch applied: n$Q now shows thinking blocks');
  console.log('   • Changed if(!(Q||I)) to if(false)');
  console.log('   • Thinking blocks will now always be visible');
} else {
  console.log('⚠️  Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.37)');
  console.log('   2. n$Q function was modified by another patch');
  console.log('   3. The minified code structure changed');

  // Diagnostic checks
  if (!content.includes('function n$Q({param:{thinking:')) {
    console.error('\n❌ n$Q component not found - wrong version?');
  }
  if (!content.includes('Fs.default.createElement')) {
    console.error('❌ React createElement pattern mismatch');
  }
}

// Write file if patch applied
if (patchApplied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('✅ File written successfully\n');

  console.log('Summary:');
  console.log('- n$Q visibility: PATCHED');
  console.log('\n🎉 Patch complete! Please restart Claude Code for changes to take effect.');
  console.log('\n💡 Tip: Use ctrl+o to toggle between compact and expanded views');
  process.exit(0);
} else {
  console.error('\n❌ Patch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.37');
  process.exit(1);
}
