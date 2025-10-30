#!/usr/bin/env node

/**
 * Claude Code Thinking Patch - v2.0.30
 *
 * This patch modifies Claude Code v2.0.30 to always display thinking blocks
 * by patching the minified thinking component.
 *
 * Minified identifiers for v2.0.30:
 * - Component name: sjQ
 * - React import: Js
 * - Init function: rjQ
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect username dynamically
const username = os.userInfo().username;
const cliPath = `/Users/${username}/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js`;

console.log('Claude Code Thinking Patch - v2.0.30');
console.log('=====================================\n');

// Check if file exists
if (!fs.existsSync(cliPath)) {
  console.error(`❌ Error: cli.js not found at ${cliPath}`);
  console.error('   Please ensure Claude Code v2.0.30 is installed.');
  process.exit(1);
}

// Read the file
let content = fs.readFileSync(cliPath, 'utf8');

// Pattern to find and replace (v2.0.30 identifiers)
const oldPattern = 'function sjQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=kQ();if(!A)return null;if(!(Q||I))return Js.default.createElement(S,{marginTop:B?1:0},Js.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return Js.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},Js.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking…"),Js.default.createElement(S,{paddingLeft:2},Js.default.createElement(z,{dimColor:!0,italic:!0},yF(A,G))))}';

const newPattern = 'function sjQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=kQ();if(!A)return null;return Js.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},Js.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking…"),Js.default.createElement(S,{paddingLeft:2},Js.default.createElement(z,{dimColor:!0,italic:!0},yF(A,G))))}';

// Check if already patched
if (!content.includes(oldPattern)) {
  if (content.includes(newPattern)) {
    console.log('✅ Patch already applied!');
    console.log('   Thinking blocks are already visible.\n');
    process.exit(0);
  } else {
    console.error('❌ Error: Could not find expected pattern.');
    console.error('   This might be a different version of Claude Code.');
    console.error('   Expected version: v2.0.30\n');
    process.exit(1);
  }
}

// Apply the patch
content = content.replace(oldPattern, newPattern);

// Write back
fs.writeFileSync(cliPath, content, 'utf8');

console.log('✅ Patch applied successfully!');
console.log('   Thinking blocks will now be visible by default.');
console.log('   Restart any active Claude Code sessions to see the change.\n');
