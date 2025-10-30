#!/usr/bin/env node

/**
 * Claude Code Thinking Patch - v2.0.30 Custom Peach Theme
 *
 * This patch modifies Claude Code v2.0.30 with beautiful peach-themed styling:
 * - Peach colored thinking header
 * - Double-line box border in peach
 * - Enhanced visual presentation
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

console.log('Claude Code Thinking Patch - v2.0.30 (Custom Peach Theme)');
console.log('=========================================================\n');

// Check if file exists
if (!fs.existsSync(cliPath)) {
  console.error(`❌ Error: cli.js not found at ${cliPath}`);
  console.error('   Please ensure Claude Code v2.0.30 is installed.');
  process.exit(1);
}

// Read the file
let content = fs.readFileSync(cliPath, 'utf8');

// Pattern to find and replace (v2.0.30 identifiers with custom peach styling)
const oldPattern = 'function sjQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=kQ();if(!A)return null;if(!(Q||I))return Js.default.createElement(S,{marginTop:B?1:0},Js.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return Js.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},Js.default.createElement(z,{dimColor:!0,italic:!0},"∴ Thinking…"),Js.default.createElement(S,{paddingLeft:2},Js.default.createElement(z,{dimColor:!0,italic:!0},yF(A,G))))}';

const newPattern = 'function sjQ({param:{thinking:A},addMargin:B=!1,isTranscriptMode:Q,verbose:I}){let[G]=kQ();if(!A)return null;return Js.default.createElement(S,{flexDirection:"column",marginTop:B?1:0,width:"100%",borderStyle:"double",borderColor:"#FF9E64",paddingX:1},Js.default.createElement(z,{bold:!0,color:"#FF9E64"},"🧠 Thinking Process"),Js.default.createElement(S,{paddingLeft:1,paddingTop:1},Js.default.createElement(z,{color:"text"},yF(A,G))))}';

// Check if already patched
if (!content.includes(oldPattern)) {
  if (content.includes(newPattern)) {
    console.log('✅ Custom peach patch already applied!');
    console.log('   Thinking blocks are styled with peach theme.\n');
    process.exit(0);
  } else {
    console.error('❌ Error: Could not find expected pattern.');
    console.error('   This might be a different version of Claude Code.');
    console.error('   Expected version: v2.0.30');
    console.error('   \n   Note: Make sure the standard patch has not been applied.');
    console.error('   If you want to switch to custom styling, restore the original');
    console.error('   cli.js first, then apply this custom patch.\n');
    process.exit(1);
  }
}

// Apply the patch
content = content.replace(oldPattern, newPattern);

// Write back
fs.writeFileSync(cliPath, content, 'utf8');

console.log('✅ Custom peach patch applied successfully!');
console.log('   🎨 Features:');
console.log('   • Peach colored header: "🧠 Thinking Process"');
console.log('   • Double-line box border in peach (#FF9E64)');
console.log('   • Enhanced readability and visual appeal');
console.log('   \n   Restart any active Claude Code sessions to see the changes.\n');
