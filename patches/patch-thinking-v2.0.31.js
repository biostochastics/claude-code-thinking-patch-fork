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

const bannerPattern = /function _kQ\(\{streamMode:(\w+)\}\)\{[^}]+return/;
const bannerMatch = content.match(bannerPattern);

if (bannerMatch) {
  const streamVar = bannerMatch[1];
  const funcStart = content.indexOf(`function _kQ({streamMode:${streamVar})`);
  if (funcStart !== -1) {
    const braceStart = content.indexOf('{', funcStart);
    let braceCount = 0;
    let funcEnd = braceStart;
    for (let i = braceStart; i < content.length; i++) {
      if (content[i] === '{') braceCount++;
      if (content[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          funcEnd = i;
          break;
        }
      }
    }

    const oldFunction = content.substring(funcStart, funcEnd + 1);
    const newFunction = `function _kQ({streamMode:${streamVar}}){return null}`;

    content = content.replace(oldFunction, newFunction);
    changesMade++;
    console.log(`   ✅ Banner function patched (_kQ)`);
  }
} else {
  console.log('   ⚠️  Banner function not found or already patched');
}

// ==================== PATCH 2: Force Thinking Visibility ====================
console.log('\n🔧 Patch 2: Forcing thinking visibility...');

// CRITICAL: Only replace in the specific case statement where MSQ is called
// DO NOT use global replace - it breaks function parameters!
const casePattern = /case"thinking":([^}]+createElement\(MSQ,\{[^}]*isTranscriptMode:)K([,}])/;
const caseMatch = content.match(casePattern);

if (caseMatch) {
  const before = caseMatch[1];
  const after = caseMatch[2];
  const oldCase = caseMatch[0];
  const newCase = `case"thinking":${before}!0${after}`;

  content = content.replace(oldCase, newCase);
  changesMade++;
  console.log('   ✅ Thinking visibility forced (K → !0 in case statement only)');
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
