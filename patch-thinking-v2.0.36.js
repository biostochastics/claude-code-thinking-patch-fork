#!/usr/bin/env node

/**
 * Claude Code Thinking Patcher - v2.0.36
 *
 * This patch makes thinking blocks always visible in Claude Code.
 *
 * Version-specific patterns for v2.0.36:
 * - Component name: pSQ (changed from OSQ in v2.0.35)
 * - Hook: HQ() (same as v2.0.35)
 * - React import: hs.default (changed from _s.default in v2.0.35)
 *
 * Usage:
 *   node patch-thinking-v2.0.36.js
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

console.log('Claude Code Thinking Patcher v2.0.36');
console.log('=====================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.36 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch 1: pSQ Component (v2.0.36)
const psqOriginalPattern = 'function pSQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=HQ();if(!A)return null;if(!(Q||I))return hs.default.createElement(S,{marginTop:B?1:0},hs.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return hs.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},hs.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),hs.default.createElement(S,{paddingLeft:2},hs.default.createElement(w,{dimColor:!0,italic:!0},gC(A,G))))}';

const psqPatchedPattern = 'function pSQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=HQ();if(!A)return null;if(false)return hs.default.createElement(S,{marginTop:B?1:0},hs.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return hs.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},hs.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),hs.default.createElement(S,{paddingLeft:2},hs.default.createElement(w,{dimColor:!0,italic:!0},gC(A,G))))}';

let patchApplied = false;

// Apply Patch
console.log('Applying pSQ visibility fix...');
if (content.includes(psqPatchedPattern)) {
  console.log('ℹ️  Patch already applied');
  patchApplied = true;
} else if (content.includes(psqOriginalPattern)) {
  content = content.replace(psqOriginalPattern, psqPatchedPattern);
  patchApplied = true;
  console.log('✅ Patch applied: pSQ now shows thinking blocks');
  console.log('   • Changed if(!(Q||I)) to if(false)');
  console.log('   • Thinking blocks will now always be visible');
} else {
  console.log('⚠️  Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.36)');
  console.log('   2. pSQ function was modified by another patch');
  console.log('   3. The minified code structure changed');

  // Diagnostic checks
  if (!content.includes('function pSQ({param:{thinking:')) {
    console.error('\n❌ pSQ component not found - wrong version?');
  }
  if (!content.includes('hs.default.createElement')) {
    console.error('❌ React createElement pattern mismatch');
  }
}

// Write file if patch applied
if (patchApplied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('✅ File written successfully\n');

  console.log('Summary:');
  console.log('- pSQ visibility: PATCHED');
  console.log('\n🎉 Patch complete! Please restart Claude Code for changes to take effect.');
  console.log('\n💡 Tip: Use ctrl+o to toggle between compact and expanded views');
  process.exit(0);
} else {
  console.error('\n❌ Patch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.36');
  process.exit(1);
}
