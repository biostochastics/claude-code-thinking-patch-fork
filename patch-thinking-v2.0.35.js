#!/usr/bin/env node

/**
 * Claude Code Thinking Patcher - v2.0.35
 *
 * This patch restores full thinking visibility by disabling the collapsed view.
 *
 * Version-specific patterns for v2.0.35:
 * - Component name: OSQ (changed from LSQ in v2.0.34)
 * - Hook: HQ() (changed from UQ() in v2.0.34)
 * - React import: _s.default.createElement
 *
 * Usage:
 *   node patch-thinking-v2.0.35.js
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

console.log('Claude Code Thinking Patcher v2.0.35');
console.log('======================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.35 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch: OSQ Component (v2.0.35)
const osqOriginal = 'function OSQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=HQ();if(!A)return null;if(!(Q||I))return _s.default.createElement(S,{marginTop:B?1:0},_s.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return _s.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},_s.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),_s.default.createElement(S,{paddingLeft:2},_s.default.createElement(w,{dimColor:!0,italic:!0},gC(A,G))))}';

const osqPatched = 'function OSQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=HQ();if(!A)return null;if(false)return _s.default.createElement(S,{marginTop:B?1:0},_s.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return _s.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},_s.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),_s.default.createElement(S,{paddingLeft:2},_s.default.createElement(w,{dimColor:!0,italic:!0},gC(A,G))))}';

let patchApplied = false;

// Apply Patch
console.log('Applying OSQ patch...');
if (content.includes(osqPatched)) {
  console.log('ℹ️  Patch already applied');
  patchApplied = true;
} else if (content.includes(osqOriginal)) {
  content = content.replace(osqOriginal, osqPatched);
  patchApplied = true;
  console.log('✅ Patch applied: OSQ now shows thinking');
  console.log('   Changed: if(!(Q||I)) → if(false)');
} else {
  console.log('⚠️  Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.35)');
  console.log('   2. OSQ function was modified by another patch');
  console.log('   3. The minified code structure changed');

  // Diagnostic checks
  if (!content.includes('function OSQ({param:{thinking:')) {
    console.error('\n❌ OSQ component not found - wrong version?');
  }
  if (!content.includes('HQ()')) {
    console.error('❌ HQ() hook not found - identifier mismatch');
  }
  if (!content.includes('_s.default.createElement')) {
    console.error('❌ React createElement pattern mismatch');
  }
}

// Write file if patch applied
if (patchApplied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('✅ File written successfully\n');

  console.log('Summary:');
  console.log('- OSQ visibility: PATCHED');
  console.log('\n🎉 Patch applied! Please restart Claude Code for changes to take effect.');
  console.log('\n💡 Tip: Use ctrl+o to toggle between compact and expanded views');
  process.exit(0);
} else {
  console.error('\n❌ Patch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.35');
  process.exit(1);
}
