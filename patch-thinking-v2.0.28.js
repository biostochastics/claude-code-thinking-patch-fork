#!/usr/bin/env node

/**
 * Claude Code Thinking Patch - v2.0.28
 *
 * This patch makes thinking blocks visible in Claude Code v2.0.28
 * by modifying the visibility control in the message renderer.
 *
 * Architecture Change in v2.0.28:
 * - Continues the simplified direct case handling in the message renderer
 * - Visibility is controlled by: if(!V)return null where V is isTranscriptMode
 *
 * Identified Patterns for v2.0.28:
 * - Thinking component: LTQ (changed from UTQ in v2.0.27)
 * - isTranscriptMode variable: V
 * - React import: C3
 *
 * Usage:
 *   node patch-thinking-v2.0.28.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Thinking Patch - v2.0.28');
console.log('=====================================\n');

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code v2.0.28 is installed.');
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

  if (version !== '2.0.28') {
    console.error(`\n⚠️  Warning: This patch is for v2.0.28, but found v${version}`);
    console.error('The patch may not work correctly. Please use the correct version-specific patch.');
    process.exit(1);
  }
} else {
  console.warn('⚠️  Could not detect version number');
}

console.log('\n🔍 Applying patch...\n');

// Patch: Make thinking visible by removing the visibility check
// and forcing isTranscriptMode to true
const searchPattern = 'case"thinking":if(!V)return null;return C3.createElement(LTQ,{addMargin:B,param:A,isTranscriptMode:V});';
const replacePattern = 'case"thinking":return C3.createElement(LTQ,{addMargin:B,param:A,isTranscriptMode:!0});';

if (content.includes(searchPattern)) {
  content = content.replace(searchPattern, replacePattern);
  console.log('✅ Patch 1: Removed visibility check and forced isTranscriptMode to true');
} else if (content.includes(replacePattern)) {
  console.log('ℹ️  Patch 1: Already applied (thinking is already visible)');
} else {
  console.error('❌ Error: Could not find the expected code pattern.');
  console.error('This likely means:');
  console.error('  - The minified identifiers have changed in a newer version');
  console.error('  - The code structure has been modified');
  console.error('\nPlease run detect-identifiers.js to find the new patterns.');
  process.exit(1);
}

// Write the patched file
fs.writeFileSync(claudePath, content, 'utf8');

console.log('\n✅ Patch applied successfully!');
console.log('\n📝 Changes made:');
console.log('  - Removed: if(!V)return null; (visibility check)');
console.log('  - Changed: isTranscriptMode:V → isTranscriptMode:!0 (forced to true)');
console.log('\n🎉 Thinking blocks are now visible!');
console.log('\nRestart Claude Code to see the changes.');
