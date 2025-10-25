#!/usr/bin/env node

/**
 * Claude Code Thinking Patch - v2.0.27 Custom Styled Version
 *
 * This patch makes thinking blocks visible AND adds custom styling:
 * - Orange bordered box around thinking content
 * - Custom "🍑 Thinking Process" header in bold orange
 * - Enhanced visual separation for better readability
 *
 * Architecture Change in v2.0.27:
 * - Previous versions used a banner function with streamMode parameter
 * - v2.0.27 simplified to direct case handling in the yyI message renderer
 * - Visibility is controlled by: if(!V)return null where V is isTranscriptMode
 *
 * Identified Patterns for v2.0.27:
 * - Message renderer function: yyI
 * - Thinking component: UTQ
 * - isTranscriptMode variable in yyI: V
 * - React import in UTQ: ja
 * - React import in yyI: C3
 *
 * Usage:
 *   node patch-thinking-v2.0.27-custom.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Patch - v2.0.27 (Custom Styled)');
console.log('====================================================\n');

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.27 is installed.');
  process.exit(1);
}

// Read file
console.log(`Reading: ${claudePath}`);
let content = fs.readFileSync(claudePath, 'utf8');

// Verify version
const versionMatch = content.match(/\/\/ Version: (\d+\.\d+\.\d+)/);
if (versionMatch) {
  const version = versionMatch[1];
  console.log(`Detected version: ${version}`);

  if (version !== '2.0.27') {
    console.error(`\n⚠️  Warning: This patch is for v2.0.27, but found v${version}`);
    console.error('The patch may not work correctly. Please use the correct version-specific patch.');
    process.exit(1);
  }
} else {
  console.warn('⚠️  Could not detect version number');
}

console.log('\n🔍 Applying patches...\n');

// Patch 1: Make thinking visible in the message renderer
const searchPattern1 = 'case"thinking":if(!V)return null;return C3.createElement(UTQ,{addMargin:B,param:A,isTranscriptMode:V});';
const replacePattern1 = 'case"thinking":return C3.createElement(UTQ,{addMargin:B,param:A,isTranscriptMode:!0});';

if (content.includes(searchPattern1)) {
  content = content.replace(searchPattern1, replacePattern1);
  console.log('✅ Patch 1: Removed visibility check and forced isTranscriptMode to true');
} else if (content.includes(replacePattern1)) {
  console.log('ℹ️  Patch 1: Already applied (thinking is already visible)');
} else {
  console.error('❌ Error: Could not find the expected code pattern for Patch 1.');
  console.error('Please run detect-identifiers.js to find the new patterns.');
  process.exit(1);
}

// Patch 2: Add custom styling to the UTQ component
const searchPattern2 = 'function UTQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q}){let[I]=qQ();if(!A)return null;if(!Q)return ja.default.createElement(S,{marginTop:B?1:0},ja.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return ja.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},ja.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking…"),ja.default.createElement(S,{paddingLeft:2},ja.default.createElement(z,{dimColor:!0,italic:!0},MF(A,I))))}';

const replacePattern2 = 'function UTQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q}){let[I]=qQ();if(!A)return null;if(!Q)return ja.default.createElement(S,{marginTop:B?1:0},ja.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return ja.default.createElement(S,{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:B?1:0,width:"100%"},ja.default.createElement(z,{color:"warning",bold:!0},"🍑 Thinking Process"),ja.default.createElement(S,{paddingLeft:1,marginTop:1},ja.default.createElement(z,{dimColor:!0},MF(A,I))))}';

if (content.includes(searchPattern2)) {
  content = content.replace(searchPattern2, replacePattern2);
  console.log('✅ Patch 2: Added custom styling with orange bordered box and peach header');
} else if (content.includes(replacePattern2)) {
  console.log('ℹ️  Patch 2: Already applied (custom styling is present)');
} else if (content.includes('🍑 Thinking Process')) {
  console.log('ℹ️  Patch 2: Custom styling already present (possibly different version)');
} else {
  console.error('❌ Error: Could not find the expected UTQ component pattern.');
  console.error('This likely means:');
  console.error('  - The UTQ component structure has changed');
  console.error('  - The minified identifiers are different');
  console.error('\nPlease run detect-identifiers.js to find the new patterns.');
  process.exit(1);
}

// Write the patched file
fs.writeFileSync(claudePath, content, 'utf8');

console.log('\n✅ All patches applied successfully!');
console.log('\n📝 Changes made:');
console.log('  - Removed: if(!V)return null; (visibility check)');
console.log('  - Changed: isTranscriptMode:V → isTranscriptMode:!0 (forced to true)');
console.log('  - Added: Orange border around thinking content (borderStyle:"single", borderColor:"warning")');
console.log('  - Added: Custom header "🍑 Thinking Process" (bold, orange)');
console.log('  - Enhanced: Better padding and visual separation');
console.log('\n🎨 Custom Styling Features:');
console.log('  • Single-line orange border');
console.log('  • Bold orange "🍑 Thinking Process" header');
console.log('  • Improved padding and spacing');
console.log('  • Clear visual separation from other content');
console.log('\n🎉 Thinking blocks are now visible with custom styling!');
console.log('\nRestart Claude Code to see the changes.');
