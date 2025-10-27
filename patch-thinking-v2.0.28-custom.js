#!/usr/bin/env node

/**
 * Claude Code Thinking Custom Style Patcher v2.0.28
 *
 * This patch adds custom peach-themed styling to thinking blocks in Claude Code v2.0.28.
 * It applies three patches:
 * 1. Makes thinking blocks visible
 * 2. Adds custom border and colors (peach/orange theme)
 *
 * Identified Patterns for v2.0.28:
 * - Thinking component: LTQ
 * - React import: ja
 * - Box component: S
 * - Text component: z
 * - Hook: NQ
 * - Helper function: OF
 * - isTranscriptMode variable: V
 *
 * Usage:
 *   node patch-thinking-v2.0.28-custom.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Custom Style Patcher v2.0.28');
console.log('==================================================\n');
console.log(`User: ${os.userInfo().username}`);
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.28 is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');

// Verify version
const versionMatch = content.match(/\/\/ Version: (\d+\.\d+\.\d+)/);
if (versionMatch) {
  const version = versionMatch[1];
  console.log(`Detected version: ${version}`);

  if (version !== '2.0.28') {
    console.error(`\n⚠️  Warning: This patch is for v2.0.28, but found v${version}`);
    console.error('The patch may not work correctly. Please use the correct version-specific patch.');
    process.exit(1);
  }
} else {
  console.warn('⚠️  Could not detect version number');
}

// Patch 1: Thinking Visibility (v2.0.28)
const thinkingSearchPattern = 'case"thinking":if(!V)return null;return C3.createElement(LTQ,{addMargin:B,param:A,isTranscriptMode:V});';
const thinkingReplacement = 'case"thinking":return C3.createElement(LTQ,{addMargin:B,param:A,isTranscriptMode:!0});';

// Patch 2: Custom LTQ styling with border and peach color (v2.0.28)
// Original LTQ function that we want to replace
const ltqSearchPattern = 'function LTQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q}){let[I]=NQ();if(!A)return null;if(!Q)return ja.default.createElement(S,{marginTop:B?1:0},ja.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return ja.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},ja.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking…"),ja.default.createElement(S,{paddingLeft:2},ja.default.createElement(z,{dimColor:!0,italic:!0},OF(A,I))))}';

// Custom LTQ with border and peach/orange color
const ltqReplacement = 'function LTQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q}){let[I]=NQ();if(!A)return null;if(!Q)return ja.default.createElement(S,{marginTop:B?1:0},ja.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return ja.default.createElement(S,{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:B?1:0,width:"100%"},ja.default.createElement(z,{color:"warning",bold:!0},"🍑 Thinking Process"),ja.default.createElement(S,{paddingLeft:1,marginTop:1},ja.default.createElement(z,{dimColor:!0},OF(A,I))))}';

let patch1Applied = false;
let patch2Applied = false;

// Apply Patch 1
console.log('\nApplying Patch 1: thinking visibility...');
if (content.includes(thinkingSearchPattern)) {
  content = content.replace(thinkingSearchPattern, thinkingReplacement);
  patch1Applied = true;
  console.log('✅ Patch 1 applied: thinking content forced visible');
} else if (content.includes(thinkingReplacement)) {
  console.log('ℹ️  Patch 1 already applied');
  patch1Applied = true;
} else {
  console.log('⚠️  Patch 1 pattern not found (may already be patched or version changed)');
}

// Apply Patch 2
console.log('\nApplying Patch 2: custom LTQ styling...');
if (content.includes(ltqSearchPattern)) {
  content = content.replace(ltqSearchPattern, ltqReplacement);
  patch2Applied = true;
  console.log('✅ Patch 2 applied: LTQ now has custom border and colors');
  console.log('   • Added single-line border with peach/warning color');
  console.log('   • Changed header to "🍑 Thinking Process" with bold peach text');
  console.log('   • Adjusted padding and layout');
} else if (content.includes(ltqReplacement)) {
  console.log('ℹ️  Patch 2 already applied (peach version)');
  patch2Applied = true;
} else {
  console.log('⚠️  Patch 2 pattern not found');
  console.log('   This likely means:');
  console.log('   1. Wrong Claude Code version (this is for v2.0.28)');
  console.log('   2. LTQ function was modified by another patch');
  console.log('   3. The minified code structure changed');
}

// Write file if patches applied
if (patch1Applied || patch2Applied) {
  console.log('\nWriting patched file...');
  fs.writeFileSync(claudePath, content, 'utf8');
  console.log('✅ File written successfully\n');

  console.log('Summary:');
  console.log(`- Patch 1 (visibility): ${patch1Applied ? 'APPLIED' : 'SKIPPED'}`);
  console.log(`- Patch 2 (custom style): ${patch2Applied ? 'APPLIED' : 'SKIPPED'}`);
  console.log('\n🎉 Patches applied! Please restart Claude Code for changes to take effect.');
  console.log('\n📝 Custom Style Features:');
  console.log('   - Thinking blocks now have a peach/orange bordered box');
  console.log('   - Header text is "🍑 Thinking Process" in bold peach');
  console.log('   - Improved visual separation from other content');
  process.exit(0);
} else {
  console.error('\n❌ No patches applied - file may have changed or already patched');
  console.error('This script is for Claude Code v2.0.28');
  process.exit(1);
}
