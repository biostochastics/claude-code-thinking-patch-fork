#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Universal Identifier Detector v2');
console.log('============================================\n');
console.log(`Target file: ${claudePath}\n`);

// Check if file exists
if (!fs.existsSync(claudePath)) {
  console.error(`❌ Error: File not found at ${claudePath}`);
  console.error('Please make sure Claude Code is installed.');
  process.exit(1);
}

// Read file
console.log('Reading cli.js...');
const content = fs.readFileSync(claudePath, 'utf8');

console.log(`File size: ${(content.length / 1024 / 1024).toFixed(2)} MB\n`);

// Strategy: Use distinctive strings to locate code, then extract identifiers

// ==================== BANNER FUNCTION ====================
console.log('🔍 Searching for Banner Function...');

// Find the index of the distinctive thinking string
const thinkingMarker = '"∴ Thinking…"';
const thinkingIndex = content.indexOf(thinkingMarker);

if (thinkingIndex === -1) {
  console.log('❌ Thinking marker not found!');
} else {
  console.log(`✅ Found thinking marker at position ${thinkingIndex}`);

  // Extract a large context window around this marker
  const contextStart = Math.max(0, thinkingIndex - 500);
  const contextEnd = Math.min(content.length, thinkingIndex + 500);
  const context = content.substring(contextStart, contextEnd);

  // Find function declaration before the marker
  const functionMatches = context.match(/function (\w+)\(\{streamMode:(\w+)\}\)/g);

  if (functionMatches) {
    console.log(`   Found ${functionMatches.length} function(s) in context`);

    // Get the last function before our marker (most likely the banner function)
    const lastFuncMatch = functionMatches[functionMatches.length - 1];
    const funcNameMatch = lastFuncMatch.match(/function (\w+)/);

    if (funcNameMatch) {
      const bannerFuncName = funcNameMatch[1];
      console.log(`   Banner function name: ${bannerFuncName}`);

      // Now find the complete function
      const funcStart = content.lastIndexOf(`function ${bannerFuncName}(`, thinkingIndex);
      if (funcStart !== -1) {
        // Find the end of the function (naive approach: find "return null}")
        let bracketCount = 0;
        let funcEnd = funcStart;
        let inFunction = false;

        for (let i = funcStart; i < content.length; i++) {
          const char = content[i];

          if (char === '{') {
            bracketCount++;
            inFunction = true;
          } else if (char === '}') {
            bracketCount--;
            if (bracketCount === 0 && inFunction) {
              funcEnd = i + 1;
              break;
            }
          }
        }

        const fullFunction = content.substring(funcStart, funcEnd);
        console.log(`\n📋 Complete Banner Function:`);
        console.log(fullFunction.substring(0, 200) + '...');
        console.log(`   (${fullFunction.length} characters total)`);

        // Extract React identifiers
        const useStateMatch = fullFunction.match(/(\w+)\.useState/);
        const createElementMatch = fullFunction.match(/(\w+)\.createElement/);

        if (useStateMatch) {
          console.log(`   React hooks: ${useStateMatch[1]}`);
        }
        if (createElementMatch) {
          console.log(`   createElement: ${createElementMatch[1]}`);
        }

        console.log(`\n📝 Banner Patch:`);
        console.log(`   Search: function ${bannerFuncName}({streamMode:A}){...}`);
        console.log(`   Replace: function ${bannerFuncName}({streamMode:A}){return null}`);
      }
    }
  }
}

// ==================== VISIBILITY CASE ====================
console.log('\n🔍 Searching for Thinking Visibility Case...');

// Look for: case"thinking":
const caseIndex = content.indexOf('case"thinking":');

if (caseIndex === -1) {
  console.log('❌ Thinking case not found!');
} else {
  console.log(`✅ Found thinking case at position ${caseIndex}`);

  // Extract context
  const caseStart = caseIndex;
  let caseEnd = caseIndex;

  // Find the end of this case (next case or default)
  const nextCaseIndex = content.indexOf('case"', caseIndex + 15);
  const defaultIndex = content.indexOf('default:', caseIndex);

  if (nextCaseIndex !== -1 && (defaultIndex === -1 || nextCaseIndex < defaultIndex)) {
    caseEnd = nextCaseIndex;
  } else if (defaultIndex !== -1) {
    caseEnd = defaultIndex;
  } else {
    caseEnd = caseIndex + 300; // fallback
  }

  const caseStatement = content.substring(caseStart, caseEnd);
  console.log(`\n📋 Case Statement:`);
  console.log(caseStatement.substring(0, 200));

  // Extract identifiers
  const transcriptModeMatch = caseStatement.match(/isTranscriptMode:(\w+)/);
  const componentMatch = caseStatement.match(/createElement\((\w+),/);

  if (transcriptModeMatch) {
    const transcriptVar = transcriptModeMatch[1];
    console.log(`   isTranscriptMode variable: ${transcriptVar}`);

    if (transcriptVar !== '!0' && transcriptVar !== 'true') {
      console.log(`\n📝 Visibility Patch:`);
      console.log(`   Replace: isTranscriptMode:${transcriptVar}`);
      console.log(`   With: isTranscriptMode:!0`);
    } else {
      console.log(`   ✅ Already patched (isTranscriptMode is forced true)`);
    }
  }

  if (componentMatch) {
    console.log(`   Thinking component: ${componentMatch[1]}`);
  }
}

// ==================== FpB COMPONENT ====================
console.log('\n🔍 Searching for Thinking Component (FpB)...');

// Look for: {param:{thinking:
const fpbMarker = '{param:{thinking:';
const fpbIndex = content.indexOf(fpbMarker);

if (fpbIndex === -1) {
  console.log('❌ FpB marker not found!');
} else {
  console.log(`✅ Found FpB marker at position ${fpbIndex}`);

  // Find function before this marker
  const funcStart = content.lastIndexOf('function', fpbIndex);
  const funcNameMatch = content.substring(funcStart, fpbIndex).match(/function (\w+)\(/);

  if (funcNameMatch) {
    const fpbName = funcNameMatch[1];
    console.log(`   Component name: ${fpbName}`);

    // Find the full function
    let bracketCount = 0;
    let funcEnd = funcStart;
    let inFunction = false;

    for (let i = funcStart; i < content.length; i++) {
      const char = content[i];

      if (char === '{') {
        bracketCount++;
        inFunction = true;
      } else if (char === '}') {
        bracketCount--;
        if (bracketCount === 0 && inFunction) {
          funcEnd = i + 1;
          break;
        }
      }
    }

    const fullFpb = content.substring(funcStart, funcEnd);
    console.log(`   Function length: ${fullFpb.length} characters`);

    // Check if it has custom styling
    if (fullFpb.includes('borderStyle')) {
      console.log(`   ✅ Has custom border styling`);
    } else {
      console.log(`   ℹ️  No custom styling detected`);
    }

    if (fullFpb.includes('"∴ Thinking…"')) {
      console.log(`   ℹ️  Contains standard thinking header`);
    } else if (fullFpb.includes('"💭 Thinking Process"')) {
      console.log(`   ✅ Has custom thinking header`);
    }
  }
}

console.log('\n================================================\n');
console.log('✅ Detection complete!');
console.log('\nTo generate a patch:');
console.log('1. Use the function names and identifiers found above');
console.log('2. Create search/replace patterns');
console.log('3. Test on your specific version');
console.log('\n================================================\n');
