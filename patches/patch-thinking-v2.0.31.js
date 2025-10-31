#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('Claude Code Thinking Patch v2.0.31');
console.log('===================================\n');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
let content = fs.readFileSync(claudePath, 'utf8');
const originalLength = content.length;

console.log(`File size: ${(content.length / 1024 / 1024).toFixed(2)} MB\n`);

// Track changes
let changesMade = 0;

// ==================== PATCH 1: Hide Thinking Banner ====================
console.log('🔧 Patch 1: Hiding thinking banner...');

const bannerSearch = /function _kQ\(\{streamMode:([A-Za-z0-9_]+)\}\)\{[^}]*var [A-Za-z0-9_,\[\]= ]*BaA[^}]*useState[^}]*\{/;
const bannerMatch = content.match(bannerSearch);

if (bannerMatch) {
  const streamVar = bannerMatch[1];
  const fullMatch = bannerMatch[0];
  const replacement = `function _kQ({streamMode:${streamVar}}){return null`;

  content = content.replace(fullMatch, replacement);
  changesMade++;
  console.log(`   ✅ Banner function patched (_kQ)`);
} else {
  console.log('   ⚠️  Banner function not found or already patched');
}

// ==================== PATCH 2: Force Thinking Visibility ====================
console.log('\n🔧 Patch 2: Forcing thinking visibility...');

const visibilitySearch = /isTranscriptMode:K([,}])/;
const visibilityMatch = content.match(visibilitySearch);

if (visibilityMatch) {
  const after = visibilityMatch[1];
  content = content.replace(visibilitySearch, `isTranscriptMode:!0${after}`);
  changesMade++;
  console.log('   ✅ Thinking visibility forced (K → !0)');
} else {
  console.log('   ⚠️  Visibility control not found or already patched');
}

// ==================== WRITE CHANGES ====================
if (changesMade > 0) {
  console.log(`\n💾 Writing changes to file...`);
  fs.writeFileSync(claudePath, content, 'utf8');

  const newLength = content.length;
  const diff = originalLength - newLength;

  console.log(`   ✅ File updated successfully`);
  console.log(`   📊 Size change: ${diff > 0 ? '-' : '+'}${Math.abs(diff)} bytes`);
  console.log(`\n✨ Patch complete! ${changesMade} change${changesMade !== 1 ? 's' : ''} applied.`);
  console.log('\n🎉 Thinking blocks are now visible!');
  console.log('   Restart your Claude Code session to see the changes.\n');
} else {
  console.log('\n⚠️  No changes made. File may already be patched or patterns not found.');
  console.log('   This might mean:');
  console.log('   - The patch is already applied');
  console.log('   - You have a different version of Claude Code');
  console.log('   - The minified identifiers have changed\n');
}
