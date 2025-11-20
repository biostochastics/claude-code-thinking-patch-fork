#!/usr/bin/env node

/**
 * Claude Code Thinking Patcher - v2.0.47
 *
 * This patch makes thinking blocks always visible in Claude Code.
 *
 * Version-specific patterns for v2.0.47:
 * - Component name: D22 (changed from T32 in v2.0.46)
 * - Hook: qB() (same as v2.0.46)
 * - React import: ZAA.default (changed from hAA in v2.0.46)
 * - S component: j (same as v2.0.46)
 * - w component: w (changed from $ in v2.0.46)
 * - Text helper: tK (changed from QD in v2.0.46)
 *
 * Usage:
 *   node patch-thinking-v2.0.47.js
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

console.log('Claude Code Thinking Patcher v2.0.47');
console.log('=====================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.47 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch: D22 Component (v2.0.47)
const D22OriginalPattern = 'function D22({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G}){let[Z]=qB();if(!A)return null;if(!(B||G))return ZAA.default.createElement(j,{marginTop:Q?1:0},ZAA.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return ZAA.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},ZAA.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),ZAA.default.createElement(j,{paddingLeft:2},ZAA.default.createElement(w,{dimColor:!0,italic:!0},tK(A,Z))))}';

const D22PatchedPattern = 'function D22({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G}){let[Z]=qB();if(!A)return null;if(false)return ZAA.default.createElement(j,{marginTop:Q?1:0},ZAA.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return ZAA.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},ZAA.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),ZAA.default.createElement(j,{paddingLeft:2},ZAA.default.createElement(w,{dimColor:!0,italic:!0},tK(A,Z))))}';

let patchApplied = false;

// Apply Patch
console.log('Applying D22 visibility fix...');
if (content.includes(D22PatchedPattern)) {
  console.log('ℹ️  Patch already applied');
  patchApplied = true;
} else if (content.includes(D22OriginalPattern)) {
  content = content.replace(D22OriginalPattern, D22PatchedPattern);
  patchApplied = true;
  console.log('✅ Patch applied: D22 now shows thinking blocks');
  console.log('   • Changed if(!(B||G)) to if(false)');
  console.log('   • Thinking blocks will now always be visible');
} else {
  console.log('⚠️  Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.47)');
  console.log('   2. D22 function was modified by another patch');
  console.log('   3. The minified code structure changed');

  // Diagnostic checks
  if (!content.includes('function D22({param:{thinking:')) {
    console.error('\n❌ D22 component not found - wrong version?');
  }
  if (!content.includes('ZAA.default.createElement')) {
    console.error('❌ React createElement pattern mismatch');
  }
}

// Write file if patch applied
if (patchApplied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('✅ File written successfully\n');

  console.log('Summary:');
  console.log('- D22 visibility: PATCHED');
  console.log('\n🎉 Patch complete! Please restart Claude Code for changes to take effect.');
  console.log('\n💡 Tip: Use ctrl+o to toggle between compact and expanded views');
  process.exit(0);
} else {
  console.error('\n❌ Patch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.47');
  process.exit(1);
}
