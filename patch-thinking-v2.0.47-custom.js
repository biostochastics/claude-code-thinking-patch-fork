#!/usr/bin/env node

/**
 * Claude Code Thinking Patcher - v2.0.47 Custom (Peach Styled)
 *
 * This patch makes thinking blocks always visible AND adds custom styling:
 * - Peach emoji (🍑) header
 * - Orange border around thinking blocks
 * - Enhanced visual presentation
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
 *   node patch-thinking-v2.0.47-custom.js
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

console.log('Claude Code Thinking Patcher v2.0.47 - Custom Peach Style');
console.log('==========================================================\n');
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

// Patch: D22 Component (v2.0.47) - Custom styled version
const D22OriginalPattern = 'function D22({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G}){let[Z]=qB();if(!A)return null;if(!(B||G))return ZAA.default.createElement(j,{marginTop:Q?1:0},ZAA.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return ZAA.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},ZAA.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),ZAA.default.createElement(j,{paddingLeft:2},ZAA.default.createElement(w,{dimColor:!0,italic:!0},tK(A,Z))))}';

const D22CustomPattern = 'function D22({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G}){let[Z]=qB();if(!A)return null;if(false)return ZAA.default.createElement(j,{marginTop:Q?1:0},ZAA.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return ZAA.default.createElement(j,{flexDirection:"column",borderStyle:"single",borderColor:"yellow",paddingX:1,marginTop:Q?1:0,width:"100%"},ZAA.default.createElement(w,{bold:!0,color:"yellow"},"🍑 Thinking Process"),ZAA.default.createElement(j,{paddingLeft:1,paddingTop:0},ZAA.default.createElement(w,{dimColor:!0,italic:!0},tK(A,Z))))}';

let patchApplied = false;

// Apply Patch
console.log('Applying custom styled D22 patch...');
if (content.includes(D22CustomPattern)) {
  console.log('ℹ️  Custom patch already applied');
  patchApplied = true;
} else if (content.includes(D22OriginalPattern)) {
  content = content.replace(D22OriginalPattern, D22CustomPattern);
  patchApplied = true;
  console.log('✅ Custom patch applied successfully!');
  console.log('   • Visibility: Always shown (if(false))');
  console.log('   • Border: Single-line orange border');
  console.log('   • Header: 🍑 Thinking Process (bold orange)');
  console.log('   • Layout: Enhanced spacing and visual separation');
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
  console.log('- D22 visibility: PATCHED (always visible)');
  console.log('- Custom styling: APPLIED');
  console.log('  ├─ Border: Orange single-line box');
  console.log('  ├─ Header: 🍑 Thinking Process');
  console.log('  └─ Colors: Bold orange header, dim italic content');
  console.log('\n🎉 Custom patch complete! Please restart Claude Code for changes to take effect.');
  console.log('\n💡 Tip: Thinking blocks now have enhanced visual styling for better readability');
  process.exit(0);
} else {
  console.error('\n❌ Patch not applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.47');
  process.exit(1);
}
