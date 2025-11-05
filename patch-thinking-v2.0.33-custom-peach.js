#!/usr/bin/env node

/**
 * Custom Thinking Visibility Patch for Claude Code v2.0.33
 *
 * This script patches the Claude Code CLI to:
 * 1. Restore visibility of <thinking> blocks (like standard patch)
 * 2. Add custom styling with 🍑 peach emoji and yellow border
 *
 * Custom styling features:
 * - Peach emoji (🍑) in the header instead of ∴ symbol
 * - Yellow border (Ink.js "yellow" color) around thinking blocks
 * - Maintains all original functionality
 *
 * Pattern changed in v2.0.33:
 * - Component: sh6 (thinking display component)
 * - Visibility: Remove if(!V&&!I)return null conditional
 * - Styling: Custom header and border
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

// Detect username dynamically
const username = os.userInfo().username;
const CLI_PATH = `/Users/${username}/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js`;

console.log('Claude Code v2.0.33 Custom Thinking Patch (Peach 🍑 + Yellow Border)');
console.log('='.repeat(70));
console.log(`Target: ${CLI_PATH}`);
console.log('');

// Check if file exists
if (!fs.existsSync(CLI_PATH)) {
  console.error(`❌ Error: cli.js not found at ${CLI_PATH}`);
  console.error('Please ensure Claude Code v2.0.33 is installed.');
  process.exit(1);
}

// Read the file
let content = fs.readFileSync(CLI_PATH, 'utf8');

// Pattern 1: Remove the conditional that hides thinking
const searchPattern1 = 'case"thinking":if(!V&&!I)return null;';
const replacePattern1 = 'case"thinking":';

// Pattern 2: Modify q$Q component for custom styling (collapsed view)
// Original: return oa.default.createElement(S,{marginTop:B?1:0},oa.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));
const searchPattern2 = 'return oa.default.createElement(S,{marginTop:B?1:0},oa.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));';
const replacePattern2 = 'return oa.default.createElement(S,{marginTop:B?1:0,borderStyle:"single",borderColor:"yellow",paddingLeft:1,paddingRight:1},oa.default.createElement(w,{color:"yellow",bold:!0},"🍑 Thinking (ctrl+o to expand)"));';

// Pattern 3: Modify q$Q component for custom styling (expanded view)
// Original: return oa.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},oa.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),
const searchPattern3 = 'return oa.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%"},oa.default.createElement(w,{dimColor:!0,italic:!0},"∴ Thinking…"),';
const replacePattern3 = 'return oa.default.createElement(S,{flexDirection:"column",gap:1,marginTop:B?1:0,width:"100%",borderStyle:"single",borderColor:"yellow",paddingLeft:1,paddingRight:1},oa.default.createElement(w,{color:"yellow",bold:!0},"🍑 Thinking…"),';

// Check if already patched
const isPattern1Patched = !content.includes(searchPattern1);
const isPattern2Patched = !content.includes(searchPattern2);
const isPattern3Patched = !content.includes(searchPattern3);

if (isPattern1Patched && isPattern2Patched && isPattern3Patched) {
  console.log('✅ Already patched! Custom peach thinking style is enabled.');
  console.log('');
  console.log('Features active:');
  console.log('  🍑 Peach emoji header');
  console.log('  🟡 Yellow border styling');
  console.log('  ✨ Thinking always visible');
  process.exit(0);
}

console.log('Applying custom patches...');
console.log('');

// Apply patch 1: Remove visibility conditional
if (!isPattern1Patched) {
  if (content.includes(searchPattern1)) {
    console.log('[1/3] Removing visibility conditional...');
    content = content.replace(searchPattern1, replacePattern1);
    console.log('  ✓ Thinking visibility enabled');
  } else {
    console.log('[1/3] Visibility conditional already removed or not found');
  }
} else {
  console.log('[1/3] ✓ Visibility conditional already patched');
}

// Apply patch 2: Custom styling for collapsed view
if (!isPattern2Patched) {
  if (content.includes(searchPattern2)) {
    console.log('[2/3] Adding custom styling to collapsed view...');
    content = content.replace(searchPattern2, replacePattern2);
    console.log('  ✓ Peach emoji + yellow border (collapsed)');
  } else {
    console.error('[2/3] ⚠ Warning: Collapsed view pattern not found');
    console.error('  Pattern might have changed in this version');
  }
} else {
  console.log('[2/3] ✓ Collapsed view already customized');
}

// Apply patch 3: Custom styling for expanded view
if (!isPattern3Patched) {
  if (content.includes(searchPattern3)) {
    console.log('[3/3] Adding custom styling to expanded view...');
    content = content.replace(searchPattern3, replacePattern3);
    console.log('  ✓ Peach emoji + yellow border (expanded)');
  } else {
    console.error('[3/3] ⚠ Warning: Expanded view pattern not found');
    console.error('  Pattern might have changed in this version');
  }
} else {
  console.log('[3/3] ✓ Expanded view already customized');
}

// Write the patched content back
fs.writeFileSync(CLI_PATH, content, 'utf8');

console.log('');
console.log('✅ Custom patch applied successfully!');
console.log('');
console.log('Changes made:');
console.log('  🍑 Peach emoji instead of ∴ symbol');
console.log('  🟡 Yellow border around thinking blocks');
console.log('  ✨ Thinking blocks always visible');
console.log('');
console.log('Restart your Claude Code session to see the custom styling.');
