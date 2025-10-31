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

if (content.includes('isTranscriptMode:K,') || content.includes('isTranscriptMode:K}')) {
  content = content.replace(/isTranscriptMode:K([,}])/g, 'isTranscriptMode:!0$1');
  changesMade++;
  console.log('   ✅ Thinking visibility forced (K → !0)');
} else {
  console.log('   ⚠️  Visibility control not found or already patched');
}

// ==================== PATCH 3: Custom Peach Styling ====================
console.log('\n🎨 Patch 3: Applying custom peach styling...');

// Find the MSQ component more safely - just look for the key parts
const msdPattern = /function MSQ\([^)]+\)\{[^}]+if\(!A\)return null;if\(!\(Q\|\|I\)\)return [^;]+;return ([A-Za-z0-9_]+)\.default\.createElement\(S,\{flexDirection:"column",gap:1,marginTop:B\?1:0,width:"100%"\}/;
const msqMatch = content.match(msdPattern);

if (msqMatch) {
  const reactVar = msqMatch[1]; // e.g., "Vs"

  // Find the start of function MSQ
  const funcStart = content.indexOf('function MSQ(');
  if (funcStart !== -1) {
    // Find the end of the function
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

    const oldFunction = content.substring(funcStart, funcEnd + 1);

    // Create new function with custom peach styling
    // This is a simplified replacement - we replace the visible return with styled version
    const newFunction = oldFunction.replace(
      /return ([A-Za-z0-9_]+)\.default\.createElement\(S,\{flexDirection:"column",gap:1,marginTop:B\?1:0,width:"100%"\}/,
      `return ${reactVar}.default.createElement(S,{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:B?1:0,width:"100%"`
    ).replace(
      /"∴ Thinking…"/,
      '"🍑 Thinking Process"'
    ).replace(
      /createElement\(z,\{dimColor:!0,italic:!0\},"∴ Thinking…"\)/,
      `createElement(z,{color:"warning",bold:!0},"🍑 Thinking Process")`
    ).replace(
      /\{paddingLeft:2\}/,
      '{paddingLeft:1,marginTop:1}'
    );

    if (newFunction !== oldFunction) {
      content = content.replace(oldFunction, newFunction);
      changesMade++;
      console.log('   ✅ Custom peach styling applied (MSQ component)');
      console.log('   🍑 Features: Single-line orange border, peach emoji header');
    } else {
      console.log('   ⚠️  Styling replacement failed');
    }
  }
} else {
  console.log('   ⚠️  Component not found or already styled');
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
