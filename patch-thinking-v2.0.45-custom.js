#!/usr/bin/env node

/**
 * Claude Code Thinking Patcher - v2.0.45 Custom (Peach Styled)
 *
 * This patch makes thinking blocks always visible AND adds custom styling:
 * - Peach emoji (🍑) header
 * - Orange border around thinking blocks
 * - Enhanced visual presentation
 *
 * Version-specific patterns for v2.0.45:
 * - Component name: N32 (changed from mRQ in v2.0.44)
 * - Hook: qB() (changed from UQ() in v2.0.44)
 * - React import: hAA.default (changed from Gr.default in v2.0.44)
 * - S component: j (changed from S in v2.0.44)
 * - w component: $ (changed from w in v2.0.44)
 * - Text helper: QD (changed from BV in v2.0.44)
 *
 * Usage:
 *   node patch-thinking-v2.0.45-custom.js
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

console.log('Claude Code Thinking Patcher v2.0.45 - Custom Peach Style');
console.log('==========================================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.45 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Patch: N32 Component (v2.0.45) - Custom styled version
const N32OriginalPattern = 'function N32({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:Z}){let[G]=qB();if(!A)return null;if(!(B||Z))return hAA.default.createElement(j,{marginTop:Q?1:0},hAA.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return hAA.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},hAA.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking…"),hAA.default.createElement(j,{paddingLeft:2},hAA.default.createElement($,{dimColor:!0,italic:!0},QD(A,G))))}';

const N32CustomPattern = 'function N32({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:Z}){let[G]=qB();if(!A)return null;if(false)return hAA.default.createElement(j,{marginTop:Q?1:0},hAA.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return hAA.default.createElement(j,{flexDirection:"column",borderStyle:"single",borderColor:"yellow",paddingX:1,marginTop:Q?1:0,width:"100%"},hAA.default.createElement($,{bold:!0,color:"yellow"},"🍑 Thinking Process"),hAA.default.createElement(j,{paddingLeft:1,paddingTop:0},hAA.default.createElement($,{dimColor:!0,italic:!0},QD(A,G))))}';

let patchApplied = false;

// Apply Patch
console.log('Applying custom styled N32 patch...');
if (content.includes(N32CustomPattern)) {
  console.log('ℹ️  Custom patch already applied');
  patchApplied = true;
} else if (content.includes(N32OriginalPattern)) {
  content = content.replace(N32OriginalPattern, N32CustomPattern);
  patchApplied = true;
  console.log('✅ Custom patch applied successfully!');
  console.log('   • Visibility: Always shown (if(false))');
  console.log('   • Border: Single-line orange border');
  console.log('   • Header: 🍑 Thinking Process (bold orange)');
  console.log('   • Layout: Enhanced spacing and visual separation');
} else {
  console.log('⚠️  Patch pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.45)');
  console.log('   2. N32 function was modified by another patch');
  console.log('   3. The minified code structure changed');

  // Diagnostic checks
  if (!content.includes('function N32({param:{thinking:')) {
    console.error('\n❌ N32 component not found - wrong version?');
  }
  if (!content.includes('hAA.default.createElement')) {
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
  console.log('- N32 visibility: PATCHED (always visible)');
  console.log('- Custom styling: APPLIED');
  console.log('  ├─ Border: Orange single-line box');
  console.log('  ├─ Header: 🍑 Thinking Process');
  console.log('  └─ Colors: Bold orange header, dim italic content');
  console.log('\n🎉 Custom patch complete! Please restart Claude Code for changes to take effect.');
  console.log('\n💡 Tip: Thinking blocks now have enhanced visual styling for better readability');
  process.exit(0);
} else {
  console.error('\n❌ Patch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.45');
  process.exit(1);
}
