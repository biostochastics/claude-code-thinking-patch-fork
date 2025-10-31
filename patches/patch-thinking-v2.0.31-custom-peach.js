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

// ==================== PATCH 3: Custom Peach Styling ====================
console.log('\n🎨 Patch 3: Applying custom peach styling...');

// Find the MSQ function (thinking component)
const componentSearch = /function MSQ\(\{param:\{thinking:([A-Za-z0-9_]+)\},addMargin:([A-Za-z0-9_]+)=!1,isTranscriptMode:([A-Za-z0-9_]+),verbose:([A-Za-z0-9_]+)\}\)\{let\[([A-Za-z0-9_]+)\]=([A-Za-z0-9_]+)\(\);if\(!([A-Za-z0-9_]+)\)return null;if\(!\(([A-Za-z0-9_]+)\|\|([A-Za-z0-9_]+)\)\)return ([A-Za-z0-9_]+)\.default\.createElement\(([A-Za-z0-9_]+),\{marginTop:([A-Za-z0-9_]+)\?1:0\},([A-Za-z0-9_]+)\.default\.createElement\(([A-Za-z0-9_]+),\{dimColor:!0,italic:!0\},"∴ Thinking \(ctrl\+o to expand\)"\)\);return ([A-Za-z0-9_]+)\.default\.createElement\(([A-Za-z0-9_]+),\{flexDirection:"column",gap:1,marginTop:([A-Za-z0-9_]+)\?1:0,width:"100%"\},([A-Za-z0-9_]+)\.default\.createElement\(([A-Za-z0-9_]+),\{dimColor:!0,italic:!0\},"∴ Thinking…"\),([A-Za-z0-9_]+)\.default\.createElement\(([A-Za-z0-9_]+),\{paddingLeft:2\},([A-Za-z0-9_]+)\.default\.createElement\(([A-Za-z0-9_]+),\{dimColor:!0,italic:!0\},([A-Za-z0-9_]+)\(([A-Za-z0-9_]+),([A-Za-z0-9_]+)\)\)\)\)\}/;

const componentMatch = content.match(componentSearch);

if (componentMatch) {
  const A = componentMatch[1];  // thinking
  const B = componentMatch[2];  // addMargin
  const Q = componentMatch[3];  // isTranscriptMode
  const I = componentMatch[4];  // verbose
  const G = componentMatch[5];  // state variable
  const MQ = componentMatch[6]; // hook
  const Vs = componentMatch[10]; // React default
  const S = componentMatch[11]; // Box component
  const z = componentMatch[14]; // Text component
  const _F = componentMatch[25]; // formatter function

  const fullMatch = componentMatch[0];

  // Create custom styled component with peach border and emoji
  const replacement = `function MSQ({param:{thinking:${A}},addMargin:${B}=!1,isTranscriptMode:${Q},verbose:${I}}){let[${G}]=${MQ}();if(!${A})return null;if(!(${Q}||${I}))return ${Vs}.default.createElement(${S},{marginTop:${B}?1:0},${Vs}.default.createElement(${z},{dimColor:!0,italic:!0},"∴ Thinking (ctrl+o to expand)"));return ${Vs}.default.createElement(${S},{flexDirection:"column",borderStyle:"single",borderColor:"warning",paddingX:1,marginTop:${B}?1:0,width:"100%"},${Vs}.default.createElement(${z},{color:"warning",bold:!0},"🍑 Thinking Process"),${Vs}.default.createElement(${S},{paddingLeft:1,marginTop:1},${Vs}.default.createElement(${z},{dimColor:!0},${_F}(${A},${G}))))}`;

  content = content.replace(fullMatch, replacement);
  changesMade++;
  console.log('   ✅ Custom peach styling applied (MSQ component)');
  console.log('   🍑 Features: Single-line orange border, peach emoji header');
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
