#!/usr/bin/env node

/**
 * Claude Code Thinking Patcher - v2.0.44 Custom (Peach Styled)
 *
 * This patch makes thinking blocks always visible AND adds custom styling:
 * - Peach emoji (🍑) header
 * - Orange border around thinking blocks
 * - Enhanced visual presentation
 *
 * Version-specific patterns for v2.0.44:
 * - Component name: mRQ (same as v2.0.43)
 * - Hook: UQ() (same as v2.0.43)
 * - React import: Gr.default (same as v2.0.43)
 *
 * Usage:
 *   node patch-thinking-v2.0.44-custom.js
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

console.log('Claude Code Thinking Patcher v2.0.44 - Custom Peach Style');
console.log('==========================================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.44 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch: mRQ Component (v2.0.44) - Custom styled version
const mRQOriginalPattern = 'function mRQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=UQ();if(!A)return null;if(!(Q||I))return Gr.default.createElement(S,{marginTop:B?1:0},Gr.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return Gr.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},Gr.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),Gr.default.createElement(S,{paddingLeft:2},Gr.default.createElement(w,{dimColor:!0,italic:!0},BV(A,G))))}';

const mRQCustomPattern = 'function mRQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=UQ();if(!A)return null;if(false)return Gr.default.createElement(S,{marginTop:B?1:0},Gr.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return Gr.default.createElement(S,{flexDirection:"column",borderStyle:"single",borderColor:"yellow",paddingX:1,marginTop:B?1:0,width:"100%"},Gr.default.createElement(w,{bold:!0,color:"yellow"},"🍑 Thinking Process"),Gr.default.createElement(S,{paddingLeft:1,paddingTop:0},Gr.default.createElement(w,{dimColor:!0,italic:!0},BV(A,G))))}';

let patchApplied = false;

// Apply Patch
console.log('Applying custom styled mRQ patch...');
if (content.includes(mRQCustomPattern)) {
  console.log('ℹ️  Custom patch already applied');
  patchApplied = true;
} else if (content.includes(mRQOriginalPattern)) {
  content = content.replace(mRQOriginalPattern, mRQCustomPattern);
  patchApplied = true;
  console.log('✅ Custom patch applied successfully!');
  console.log('   • Visibility: Always shown (if(false))');
  console.log('   • Border: Single-line orange border');
  console.log('   • Header: 🍑 Thinking Process (bold orange)');
  console.log('   • Layout: Enhanced spacing and visual separation');
} else {
  console.log('⚠️  Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.44)');
  console.log('   2. mRQ function was modified by another patch');
  console.log('   3. The minified code structure changed');

  // Diagnostic checks
  if (!content.includes('function mRQ({param:{thinking:')) {
    console.error('\n❌ mRQ component not found - wrong version?');
  }
  if (!content.includes('Gr.default.createElement')) {
    console.error('❌ React createElement pattern mismatch');
  }
  if (content.includes('borderStyle:"single"') && content.includes('🍑')) {
    console.log('\nℹ️  Note: Custom styling detected - may already be patched');
  }
}

// Write file if patch applied
if (patchApplied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('✅ File written successfully\n');

  console.log('Summary:');
  console.log('- mRQ visibility: PATCHED (always visible)');
  console.log('- Custom styling: APPLIED');
  console.log('  ├─ Border: Orange single-line box');
  console.log('  ├─ Header: 🍑 Thinking Process');
  console.log('  └─ Colors: Bold orange header, dim italic content');
  console.log('\n🎉 Custom patch complete! Please restart Claude Code for changes to take effect.');
  console.log('\n💡 Tip: Thinking blocks now have enhanced visual styling for better readability');
  process.exit(0);
} else {
  console.error('\n❌ Patch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.44');
  process.exit(1);
}
