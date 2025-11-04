#!/usr/bin/env node

/**
 * Thinking Visibility Patch for Claude Code v2.0.32
 *
 * This script patches the Claude Code CLI to restore visibility of <thinking> blocks.
 *
 * In v2.0.32, thinking content is hidden when not in transcript mode (!V) and not verbose (!I).
 * This patch removes that conditional hiding to always display thinking content.
 *
 * Pattern changed in v2.0.32:
 * - Search:  case"thinking":if(!V&&!I)return null;
 * - Replace: case"thinking":
 *
 * Component identifier: rSQ (the thinking display component)
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

// Detect username dynamically
const username = os.userInfo().username;
const CLI_PATH = `/Users/${username}/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js`;

console.log('Claude Code v2.0.32 Thinking Visibility Patch');
console.log('='.repeat(60));
console.log(`Target: ${CLI_PATH}`);
console.log('');

// Check if file exists
if (!fs.existsSync(CLI_PATH)) {
  console.error(`❌ Error: cli.js not found at ${CLI_PATH}`);
  console.error('Please ensure Claude Code v2.0.32 is installed.');
  process.exit(1);
}

// Read the file
let content = fs.readFileSync(CLI_PATH, 'utf8');

// Pattern to patch: Remove the conditional that hides thinking
const searchPattern = 'case"thinking":if(!V&&!I)return null;';
const replacePattern = 'case"thinking":';

// Check if already patched
if (!content.includes(searchPattern)) {
  if (content.includes(replacePattern) &&
      content.includes('function rSQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I})')) {
    console.log('✅ Already patched! Thinking visibility is enabled.');
    console.log('');
    console.log('The case"thinking" statement no longer has the conditional hiding.');
    process.exit(0);
  } else {
    console.error('❌ Error: Expected pattern not found.');
    console.error('');
    console.error('This patch is designed for Claude Code v2.0.32.');
    console.error('Your version might be different.');
    console.error('');
    console.error(`Looking for: ${searchPattern}`);
    process.exit(1);
  }
}

// Apply the patch
console.log('Applying patch...');
console.log('');
console.log(`Search:  ${searchPattern}`);
console.log(`Replace: ${replacePattern}`);
console.log('');

content = content.replace(searchPattern, replacePattern);

// Verify the patch was applied
if (content.includes(searchPattern)) {
  console.error('❌ Error: Patch failed - pattern still exists after replacement');
  process.exit(1);
}

// Write the patched content back
fs.writeFileSync(CLI_PATH, content, 'utf8');

console.log('✅ Patch applied successfully!');
console.log('');
console.log('Changes made:');
console.log('  • Removed conditional hiding: if(!V&&!I)return null');
console.log('  • Thinking blocks now visible in all modes');
console.log('');
console.log('The rSQ component (thinking display) will now render thinking content.');
console.log('');
console.log('Restart your Claude Code session to see thinking blocks.');
