#!/usr/bin/env node

/**
 * Claude Code Thinking Patcher - v2.0.42
 *
 * This patch makes thinking blocks always visible in Claude Code.
 *
 * Version-specific patterns for v2.0.42:
 * - Component name: xLQ (changed from n$Q in v2.0.37)
 * - Hook: HQ() (changed from EQ() in v2.0.37)
 * - React import: ys.default (changed from Fs.default in v2.0.37)
 *
 * Usage:
 *   node patch-thinking-v2.0.42.js
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

console.log('Claude Code Thinking Patcher v2.0.42');
console.log('=====================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.42 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch: xLQ Component (v2.0.42)
const xLQOriginalPattern = 'function xLQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=HQ();if(!A)return null;if(!(Q||I))return ys.default.createElement(S,{marginTop:B?1:0},ys.default.createElement(U,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return ys.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},ys.default.createElement(U,{dimColor:!0,italic:!0},"∴ Thinking…"),ys.default.createElement(S,{paddingLeft:2},ys.default.createElement(U,{dimColor:!0,italic:!0},tC(A,G))))}';

const xLQPatchedPattern = 'function xLQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=HQ();if(!A)return null;if(false)return ys.default.createElement(S,{marginTop:B?1:0},ys.default.createElement(U,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return ys.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},ys.default.createElement(U,{dimColor:!0,italic:!0},"∴ Thinking…"),ys.default.createElement(S,{paddingLeft:2},ys.default.createElement(U,{dimColor:!0,italic:!0},tC(A,G))))}';

let patchApplied = false;

// Apply Patch
console.log('Applying xLQ visibility fix...');
if (content.includes(xLQPatchedPattern)) {
  console.log('ℹ️  Patch already applied');
  patchApplied = true;
} else if (content.includes(xLQOriginalPattern)) {
  content = content.replace(xLQOriginalPattern, xLQPatchedPattern);
  patchApplied = true;
  console.log('✅ Patch applied: xLQ now shows thinking blocks');
  console.log('   • Changed if(!(Q||I)) to if(false)');
  console.log('   • Thinking blocks will now always be visible');
} else {
  console.log('⚠️  Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.42)');
  console.log('   2. xLQ function was modified by another patch');
  console.log('   3. The minified code structure changed');

  // Diagnostic checks
  if (!content.includes('function xLQ({param:{thinking:')) {
    console.error('\n❌ xLQ component not found - wrong version?');
  }
  if (!content.includes('ys.default.createElement')) {
    console.error('❌ React createElement pattern mismatch');
  }
}

// Write file if patch applied
if (patchApplied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('✅ File written successfully\n');

  console.log('Summary:');
  console.log('- xLQ visibility: PATCHED');
  console.log('\n🎉 Patch complete! Please restart Claude Code for changes to take effect.');
  console.log('\n💡 Tip: Use ctrl+o to toggle between compact and expanded views');
  process.exit(0);
} else {
  console.error('\n❌ Patch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.42');
  process.exit(1);
}
