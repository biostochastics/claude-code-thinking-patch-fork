#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect the correct path based on the user
const homeDir = os.homedir();
const claudePath = path.join(homeDir, '.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');

console.log('Claude Code Universal Identifier Detector v4');
console.log('============================================');
console.log('Detects: Thinking patterns (v2.1.204 rewrite + legacy) + Hook patterns');
console.log('For v2.1.113+ binary installs: extract __BUN segment and point at it.\n');
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

// ==================== v2.1.204+ REWRITE DETECTION ====================
// v2.1.204 rewrote the thinking pipeline. Anchors:
//   - `showThinkingSummaries??!` — the request-side setting gate (Smi function)
//   - `function Rer(` — the renderer component (in patched forks it may be renamed;
//     grep for `let xtd=` + `||` + a 3-char ident pair to find equivalents)
//   - `case"thinking":{if(!` — the case-level outer guard (replaces the old Le5/ni1 gate)
console.log('🔍 Detecting v2.1.204+ rewrite architecture...');
const v204Signals = {
  smi: content.indexOf('showThinkingSummaries??!'),
  rerCase: content.indexOf('case"thinking":{if(!'),
  jsxRuntime: content.indexOf('Ste.jsx('),
  glyphVar: content.indexOf('OQo="∴"'),
  redactedThinking: content.indexOf('case"redacted_thinking":{if(!'),
};
let isV204Style = 0;
for (const k of Object.keys(v204Signals)) if (v204Signals[k] !== -1) isV204Style++;
if (isV204Style >= 3) {
  console.log(`✅ v2.1.204+ architecture detected (${isV204Style}/5 signals)`);

  // Extract Smi function body to identify the setting-gate identifier
  const smiMatch = content.match(/function\s+(\w+)\(\)\{return\s+(\w+)\(\)\.showThinkingSummaries\?\?!([01])\}/);
  if (smiMatch) {
    console.log(`   Setting-gate fn:      ${smiMatch[1]}()`);
    console.log(`   Settings-accessor fn: ${smiMatch[2]}()`);
    console.log(`   Fallback default:     !${smiMatch[3]}   (${smiMatch[3] === '0' ? 'ALREADY PATCHED (returns true)' : 'unpatched (returns false)'})`);
  }

  // Extract the case guard variables (cit=isTranscriptMode, BY=verbose in v2.1.204)
  const guardMatch = content.match(/case"thinking":\{if\(!(\w{1,4})&&!(\w{1,4})\)\{return null\}/);
  if (guardMatch) {
    console.log(`   Case guard vars:      isTranscriptMode=${guardMatch[1]}, verbose=${guardMatch[2]}`);
    console.log(`   Custom-peach patch:   !${guardMatch[1]}&&!${guardMatch[2]}  ->  !(1)&&!!0`);
  } else if (content.indexOf('case"thinking":{if(!(1)&&!!0)') !== -1) {
    console.log(`   Case guard vars:      ALREADY PATCHED (!(1)&&!!0)`);
  }

  // Find the renderer function — look for the props destructure with isTranscriptMode + verbose
  const rerRegex = /function\s+(\w{1,5})\(\w+\)\{let\s+(\w+)=(\w+)\.c\((\d+)\),\{param:\w+,addMargin:\w+,isTranscriptMode:(\w+),verbose:(\w+)\}=/;
  const rerMatch = content.match(rerRegex);
  if (rerMatch) {
    console.log(`   Renderer function:    ${rerMatch[1]}(...)  (cache: ${rerMatch[3]}.c(${rerMatch[4]}), ${rerMatch[4]} slots)`);
    console.log(`   Renderer prop vars:   isTranscriptMode=${rerMatch[5]}, verbose=${rerMatch[6]}`);

    // Locate the compact-vs-multi-line ternary INSIDE the renderer body (not somewhere
    // else in the bundle that happens to match a similar shape).
    const rerStart = content.search(rerRegex);
    if (rerStart !== -1) {
      // Rer body is small (~700 chars typically). Slice a generous window.
      const rerWindow = content.substring(rerStart, rerStart + 2000);
      const ternaryMatch = rerWindow.match(/children:(\w{1,4})\?(\w+)\.jsx\((\w+)/);
      if (ternaryMatch) {
        console.log(`   Multi-line flag var:  ${ternaryMatch[1]}   (patch to !!1 for always multi-line)`);
        console.log(`   JSX runtime import:   ${ternaryMatch[2]}   (${ternaryMatch[2]}.jsx / ${ternaryMatch[2]}.jsxs)`);
        console.log(`   Multi-line Text cmp:  ${ternaryMatch[3]}`);
      }
    }
  }

  console.log(`\n📝 v2.1.204+ standard patch template:`);
  console.log(`   1. ${smiMatch ? smiMatch[1] : 'Smi'}(){return ${smiMatch ? smiMatch[2] : 'Bn'}().showThinkingSummaries??!1}  ->  ??!0}`);
  console.log(`   2. !${guardMatch ? guardMatch[1] : 'cit'}&&!${guardMatch ? guardMatch[2] : 'BY'}  ->  !(1)&&!!0    (2 sites — thinking + redacted_thinking)`);
  console.log(`   3. if(!fco){return null}  ->  if(!(1)){return null}   (defensive Rer guard)\n`);

  console.log('─'.repeat(60));
  console.log('Skipping legacy detection (v2.1.145 and earlier patterns).');
  console.log('If you need those identifiers, run against a legacy install.\n');
  process.exit(0);
}
console.log(`   v2.1.204+ signals: ${isV204Style}/5 — falling through to legacy detection.\n`);

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

// ==================== HOOK RENDERING ====================
console.log('\n🔵 Searching for Hook Rendering Patterns...');

// Look for hook_success case statement
const hookSuccessPattern = 'case"hook_success":if(A.hookEvent==="Stop"';
const hookSuccessIndex = content.indexOf(hookSuccessPattern);

if (hookSuccessIndex === -1) {
  console.log('❌ Hook success pattern not found!');
} else {
  console.log(`✅ Found hook_success case at position ${hookSuccessIndex}`);

  // Extract context to find the component name and check for patching
  const hookContext = content.substring(hookSuccessIndex, hookSuccessIndex + 400);
  console.log(`\n📋 Hook Success Case:`);
  console.log(hookContext.substring(0, 200) + '...');

  // Check if cyan color is applied
  if (hookContext.includes('{color:"cyan"}')) {
    console.log('   ✅ Hook highlighting patch applied (cyan color)');
  } else if (hookContext.includes('createElement(FI,null,')) {
    console.log('   ℹ️  No hook highlighting (default color)');
    console.log('\n📝 Hook Highlight Patch:');
    console.log('   Replace: createElement(FI,null,A.hookName," hook succeeded"');
    console.log('   With:    createElement(FI,{color:"cyan"},A.hookName," hook succeeded"');
  }

  // Extract the Text component name (FI)
  const textComponentMatch = hookContext.match(/createElement\((\w+),/);
  if (textComponentMatch) {
    console.log(`   Text component: ${textComponentMatch[1]}`);
  }
}

// Look for other hook patterns
const hookPatterns = [
  { name: 'hook_blocking_error', pattern: 'case"hook_blocking_error":{if(A.hookEvent' },
  { name: 'hook_non_blocking_error', pattern: 'case"hook_non_blocking_error":{if(A.hookEvent' },
  { name: 'hook_system_message', pattern: 'case"hook_system_message":return' },
  { name: 'hook_permission_decision', pattern: 'case"hook_permission_decision":{let' }
];

console.log('\n🔵 Hook Pattern Summary:');
for (const hp of hookPatterns) {
  const idx = content.indexOf(hp.pattern);
  if (idx !== -1) {
    const ctx = content.substring(idx, idx + 300); // Larger context to capture colors
    const hasCyan = ctx.includes('{color:"cyan"}');
    const hasError = ctx.includes('{color:"error"}');
    const hasWarning = ctx.includes('{color:"warning"}');

    let status = 'default (no color)';
    if (hasCyan) status = 'cyan (patched)';
    else if (hasError) status = 'error (red)';
    else if (hasWarning) status = 'warning (yellow)';

    console.log(`   ${hp.name}: ${status}`);
  } else {
    console.log(`   ${hp.name}: not found`);
  }
}

console.log('\n================================================\n');
console.log('✅ Detection complete!');
console.log('\nTo generate a patch:');
console.log('1. Use the function names and identifiers found above');
console.log('2. Create search/replace patterns');
console.log('3. Test on your specific version');
console.log('\nHook highlighting:');
console.log('   Run: node patch-hooks-v2.1.11.js');
console.log('   Or combined: node patch-thinking-hooks-v2.1.11.js');
console.log('\n================================================\n');
