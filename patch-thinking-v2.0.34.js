#!/usr/bin/env node

/**
 * Claude Code Thinking Visibility Patch - v2.0.34
 *
 * This patch modifies the Claude Code CLI to make AI thinking visible by default.
 *
 * What it does:
 * - Modifies the isTranscriptMode check in the thinking display logic
 * - Makes thinking visible without requiring verbose mode or transcript mode
 *
 * Version-specific patterns for v2.0.34:
 * - Component name: LSQ
 * - Case statement: case"thinking":
 *
 * Usage:
 *   node patch-thinking-v2.0.34.js
 *
 * To revert:
 *   npm install --force @anthropic-ai/claude-code
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

// Get the username dynamically
const username = os.userInfo().username;

// Target file path
const CLI_PATH = `/Users/${username}/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js`;

console.log('Claude Code Thinking Visibility Patch - v2.0.34');
console.log('='.repeat(50));
console.log(`Target: ${CLI_PATH}\n`);

// Check if file exists
if (!fs.existsSync(CLI_PATH)) {
  console.error(`❌ Error: cli.js not found at ${CLI_PATH}`);
  console.error(`   Make sure Claude Code v2.0.34 is installed.`);
  process.exit(1);
}

// Read the file
let content = fs.readFileSync(CLI_PATH, 'utf8');

// Pattern to find and replace
// This targets the isTranscriptMode check in the LSQ function
const searchPattern = /if\(\!\(Q\|\|I\)\)return _s\.default\.createElement\(S,\{marginTop:B\?1:0\},_s\.default\.createElement\(w,\{dimColor:\!0,italic:\!0\},"∴ Thinking \(ctrl\+o to expand\)"\)\);/;

const replacement = `if(false)return _s.default.createElement(S,{marginTop:B?1:0},_s.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));`;

// Apply the patch
if (content.match(searchPattern)) {
  content = content.replace(searchPattern, replacement);

  // Write the modified content back
  fs.writeFileSync(CLI_PATH, content, 'utf8');

  console.log('✅ Patch applied successfully!');
  console.log('\nChanges made:');
  console.log('  • Modified isTranscriptMode check to always show thinking');
  console.log('\n💭 Thinking blocks will now be visible by default.');
  console.log('   Use ctrl+o to toggle transcript mode for full details.\n');
} else {
  console.error('❌ Error: Could not find the expected pattern.');
  console.error('   This patch is designed for Claude Code v2.0.34.');
  console.error('   Your version might be different.\n');

  // Check for the component name to verify version
  if (!content.includes('function LSQ({param:{thinking:')) {
    console.error('   Component signature mismatch - this may not be v2.0.34.');
  }

  process.exit(1);
}
