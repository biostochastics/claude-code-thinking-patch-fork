#!/usr/bin/env node

/**
 * Claude Code Thinking Custom Style Patcher - v2.0.36
 *
 * This patch adds custom styling to thinking blocks:
 * - Orange bordered box around thinking content
 * - Peach emoji (🍑) header in bold orange text
 * - Enhanced visual separation
 *
 * Version-specific patterns for v2.0.36:
 * - Component name: pSQ (changed from OSQ in v2.0.35)
 * - Hook: HQ() (same as v2.0.35)
 * - React import: hs.default (changed from _s.default in v2.0.35)
 *
 * Usage:
 *   node patch-thinking-v2.0.36-custom-peach.js
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

console.log('Claude Code Thinking Custom Style Patcher v2.0.36');
console.log('====================================================\n');
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

// Patch 1: pSQ Component Styling (v2.0.36)
// Original pSQ function (unpatched)
const psqOriginalPattern = 'function pSQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=HQ();if(!A)return null;if(!(Q||I))return hs.default.createElement(S,{marginTop:B?1:0},hs.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return hs.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},hs.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),hs.default.createElement(S,{paddingLeft:2},hs.default.createElement(w,{dimColor:!0,italic:!0},gC(A,G))))}';

// Standard-patched pSQ function (with if(false))
const psqStandardPatchedPattern = 'function pSQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=HQ();if(!A)return null;if(false)return hs.default.createElement(S,{marginTop:B?1:0},hs.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return hs.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},hs.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),hs.default.createElement(S,{paddingLeft:2},hs.default.createElement(w,{dimColor:!0,italic:!0},gC(A,G))))}';

// Custom pSQ with peach emoji and orange border (works with both original and patched)
const psqReplacement = 'function pSQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=HQ();if(!A)return null;if(false)return hs.default.createElement(S,{marginTop:B?1:0},hs.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return hs.default.createElement(S,{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:B?1:0,width:"100%"},hs.default.createElement(w,{color:"warning",bold:!0},"🍑 Thinking Process"),hs.default.createElement(S,{paddingLeft:1,marginTop:1},hs.default.createElement(w,{dimColor:!0},gC(A,G))))}';

let patchApplied = false;
let patchSource = 'unknown';

// Apply Patch
console.log('Applying custom pSQ styling...');
if (content.includes(psqReplacement)) {
  console.log('ℹ️  Patch already applied (orange peach version)');
  patchApplied = true;
  patchSource = 'already-applied';
} else if (content.includes(psqStandardPatchedPattern)) {
  content = content.replace(psqStandardPatchedPattern, psqReplacement);
  patchApplied = true;
  patchSource = 'standard-patched';
  console.log('✅ Patch applied: pSQ now has custom border and colors');
  console.log('   • Upgrading from standard patch to custom peach style');
  console.log('   • Added single-line border with orange/warning color');
  console.log('   • Changed header to "🍑 Thinking Process" with bold orange text');
  console.log('   • Adjusted padding and layout');
} else if (content.includes(psqOriginalPattern)) {
  content = content.replace(psqOriginalPattern, psqReplacement);
  patchApplied = true;
  patchSource = 'original';
  console.log('✅ Patch applied: pSQ now has custom border and colors');
  console.log('   • Added visibility fix (if(false))');
  console.log('   • Added single-line border with orange/warning color');
  console.log('   • Changed header to "🍑 Thinking Process" with bold orange text');
  console.log('   • Adjusted padding and layout');
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
  console.log(`- Custom pSQ style: APPLIED (source: ${patchSource})`);
  console.log('\n🎉 Patch applied! Please restart Claude Code for changes to take effect.');
  console.log('\n📝 Custom Style Features:');
  console.log('   - Thinking blocks now have an orange bordered box');
  console.log('   - Header text is "🍑 Thinking Process" in bold orange');
  console.log('   - Improved visual separation from other content');
  console.log('\n💡 Tip: Use ctrl+o to toggle between compact and expanded views');
  process.exit(0);
} else {
  console.error('\n❌ Patch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.36');
  process.exit(1);
}
