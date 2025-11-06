#!/usr/bin/env node

/**
 * Claude Code Thinking Custom Style Patcher - v2.0.34
 *
 * This patch adds custom styling to thinking blocks:
 * - Orange bordered box around thinking content
 * - Peach emoji (🍑) header in bold orange text
 * - Enhanced visual separation
 *
 * Version-specific patterns for v2.0.34:
 * - Component name: LSQ (changed from FpB in v2.0.15)
 * - React import: _s.default.createElement
 * - Hook: UQ() for columns
 *
 * Usage:
 *   node patch-thinking-v2.0.34-custom.js
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

console.log('Claude Code Thinking Custom Style Patcher v2.0.34');
console.log('====================================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.34 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch 1: LSQ Component Styling (v2.0.34)
// Original LSQ function (unpatched)
const lsqOriginalPattern = 'function LSQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=UQ();if(!A)return null;if(!(Q||I))return _s.default.createElement(S,{marginTop:B?1:0},_s.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return _s.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},_s.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),_s.default.createElement(S,{paddingLeft:2},_s.default.createElement(w,{dimColor:!0,italic:!0},gC(A,G))))}';

// Standard-patched LSQ function (with if(false))
const lsqStandardPatchedPattern = 'function LSQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=UQ();if(!A)return null;if(false)return _s.default.createElement(S,{marginTop:B?1:0},_s.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return _s.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},_s.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),_s.default.createElement(S,{paddingLeft:2},_s.default.createElement(w,{dimColor:!0,italic:!0},gC(A,G))))}';

// Custom LSQ with peach emoji and orange border (works with both original and patched)
const lsqReplacement = 'function LSQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=UQ();if(!A)return null;if(false)return _s.default.createElement(S,{marginTop:B?1:0},_s.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return _s.default.createElement(S,{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:B?1:0,width:"100%"},_s.default.createElement(w,{color:"warning",bold:!0},"🍑 Thinking Process"),_s.default.createElement(S,{paddingLeft:1,marginTop:1},_s.default.createElement(w,{dimColor:!0},gC(A,G))))}';

let patchApplied = false;
let patchSource = 'unknown';

// Apply Patch
console.log('Applying custom LSQ styling...');
if (content.includes(lsqReplacement)) {
  console.log('ℹ️  Patch already applied (orange peach version)');
  patchApplied = true;
  patchSource = 'already-applied';
} else if (content.includes(lsqStandardPatchedPattern)) {
  content = content.replace(lsqStandardPatchedPattern, lsqReplacement);
  patchApplied = true;
  patchSource = 'standard-patched';
  console.log('✅ Patch applied: LSQ now has custom border and colors');
  console.log('   • Upgrading from standard patch to custom peach style');
  console.log('   • Added single-line border with orange/warning color');
  console.log('   • Changed header to "🍑 Thinking Process" with bold orange text');
  console.log('   • Adjusted padding and layout');
} else if (content.includes(lsqOriginalPattern)) {
  content = content.replace(lsqOriginalPattern, lsqReplacement);
  patchApplied = true;
  patchSource = 'original';
  console.log('✅ Patch applied: LSQ now has custom border and colors');
  console.log('   • Added visibility fix (if(false))');
  console.log('   • Added single-line border with orange/warning color');
  console.log('   • Changed header to "🍑 Thinking Process" with bold orange text');
  console.log('   • Adjusted padding and layout');
} else {
  console.log('⚠️  Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.34)');
  console.log('   2. LSQ function was modified by another patch');
  console.log('   3. The minified code structure changed');

  // Diagnostic checks
  if (!content.includes('function LSQ({param:{thinking:')) {
    console.error('\n❌ LSQ component not found - wrong version?');
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
  console.log(`- Custom LSQ style: APPLIED (source: ${patchSource})`);
  console.log('\n🎉 Patch applied! Please restart Claude Code for changes to take effect.');
  console.log('\n📝 Custom Style Features:');
  console.log('   - Thinking blocks now have an orange bordered box');
  console.log('   - Header text is "🍑 Thinking Process" in bold orange');
  console.log('   - Improved visual separation from other content');
  console.log('\n💡 Tip: Use ctrl+o to toggle between compact and expanded views');
  process.exit(0);
} else {
  console.error('\n❌ Patch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.34');
  process.exit(1);
}
