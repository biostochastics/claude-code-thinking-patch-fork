#!/usr/bin/env node

/**
 * Claude Code Thinking Patcher - v2.0.46
 *
 * This patch makes thinking blocks always visible in Claude Code.
 *
 * Version-specific patterns for v2.0.46:
 * - Component name: T32 (changed from N32 in v2.0.45)
 * - Hook: qB() (same as v2.0.45)
 * - React import: hAA.default (same as v2.0.45)
 * - S component: j (same as v2.0.45)
 * - w component: $ (same as v2.0.45)
 * - Text helper: QD (same as v2.0.45)
 *
 * Usage:
 *   node patch-thinking-v2.0.46.js
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

console.log('Claude Code Thinking Patcher v2.0.46');
console.log('=====================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.46 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch: T32 Component (v2.0.46)
const T32OriginalPattern = 'function T32({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:Z}){let[G]=qB();if(!A)return null;if(!(B||Z))return hAA.default.createElement(j,{marginTop:Q?1:0},hAA.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return hAA.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},hAA.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking…"),hAA.default.createElement(j,{paddingLeft:2},hAA.default.createElement($,{dimColor:!0,italic:!0},QD(A,G))))}';

const T32PatchedPattern = 'function T32({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:Z}){let[G]=qB();if(!A)return null;if(false)return hAA.default.createElement(j,{marginTop:Q?1:0},hAA.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return hAA.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},hAA.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking…"),hAA.default.createElement(j,{paddingLeft:2},hAA.default.createElement($,{dimColor:!0,italic:!0},QD(A,G))))}';

let patchApplied = false;

// Apply Patch
console.log('Applying T32 visibility fix...');
if (content.includes(T32PatchedPattern)) {
  console.log('ℹ️  Patch already applied');
  patchApplied = true;
} else if (content.includes(T32OriginalPattern)) {
  content = content.replace(T32OriginalPattern, T32PatchedPattern);
  patchApplied = true;
  console.log('✅ Patch applied: T32 now shows thinking blocks');
  console.log('   • Changed if(!(B||Z)) to if(false)');
  console.log('   • Thinking blocks will now always be visible');
} else {
  console.log('⚠️  Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.46)');
  console.log('   2. T32 function was modified by another patch');
  console.log('   3. The minified code structure changed');

  // Diagnostic checks
  if (!content.includes('function T32({param:{thinking:')) {
    console.error('\n❌ T32 component not found - wrong version?');
  }
  if (!content.includes('hAA.default.createElement')) {
    console.error('❌ React createElement pattern mismatch');
  }
}

// Write file if patch applied
if (patchApplied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('✅ File written successfully\n');

  console.log('Summary:');
  console.log('- T32 visibility: PATCHED');
  console.log('\n🎉 Patch complete! Please restart Claude Code for changes to take effect.');
  console.log('\n💡 Tip: Use ctrl+o to toggle between compact and expanded views');
  process.exit(0);
} else {
  console.error('\n❌ Patch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.46');
  process.exit(1);
}
