#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('Claude Code Thinking Patch v2.0.31 (Custom Peach Style)');
console.log('=======================================================\n');

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

// ==================== PATCH 3: Custom Peach Styling ====================
console.log('\n🎨 Patch 3: Applying custom peach styling...');

// Find MSQ function - look for the visible return statement
const funcStart = content.indexOf('function MSQ(');
if (funcStart !== -1) {
  // Find function end using bracket counting
  let braceCount = 0;
  let funcEnd = funcStart;
  let inFunction = false;

  for (let i = funcStart; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
      inFunction = true;
    }
    if (content[i] === '}') {
      braceCount--;
      if (braceCount === 0 && inFunction) {
        funcEnd = i;
        break;
      }
    }
  }

  let oldFunction = content.substring(funcStart, funcEnd + 1);
  let newFunction = oldFunction;
  let styleChanges = 0;

  // Change 1: Add border styling to the visible return
  const borderChange = newFunction.replace(
    /createElement\(S,\{flexDirection:"column",gap:1,marginTop:B\?1:0,width:"100%"\}/,
    'createElement(S,{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:B?1:0,width:"100%"}'
  );
  if (borderChange !== newFunction) {
    newFunction = borderChange;
    styleChanges++;
  }

  // Change 2: Replace header text and styling
  const headerChange = newFunction.replace(
    /createElement\(z,\{dimColor:!0,italic:!0\},"∴ Thinking…"\)/,
    'createElement(z,{color:"warning",bold:!0},"🍑 Thinking Process")'
  );
  if (headerChange !== newFunction) {
    newFunction = headerChange;
    styleChanges++;
  }

  // Change 3: Adjust padding
  const paddingChange = newFunction.replace(
    /createElement\(S,\{paddingLeft:2\}/,
    'createElement(S,{paddingLeft:1,marginTop:1}'
  );
  if (paddingChange !== newFunction) {
    newFunction = paddingChange;
    styleChanges++;
  }

  if (styleChanges > 0) {
    content = content.replace(oldFunction, newFunction);
    changesMade++;
    console.log(`   ✅ Custom peach styling applied (${styleChanges} style changes)`);
    console.log('   🍑 Features: Single-line orange border, peach emoji header');
  } else {
    console.log('   ⚠️  No style changes applied');
  }
} else {
  console.log('   ⚠️  MSQ function not found');
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
  console.log('\n🍑 Custom peach style applied!');
  console.log('   • Orange border around thinking blocks');
  console.log('   • "🍑 Thinking Process" header');
  console.log('   • Enhanced visual styling');
  console.log('\n   Restart your Claude Code session to see the changes.\n');
} else {
  console.log('\n⚠️  No changes made. File may already be patched or patterns not found.');
  console.log('   This might mean:');
  console.log('   - The patch is already applied');
  console.log('   - You have a different version of Claude Code');
  console.log('   - The minified identifiers have changed\n');
}
