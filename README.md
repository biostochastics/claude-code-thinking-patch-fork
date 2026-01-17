# Claude Code Thinking Display Patch

[![DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/biostochastics/claude-code-thinking-patch-fork)

Make Claude Code's thinking blocks visible by default without pressing `ctrl+o`.

**New in v2.1.x:** Hook highlighting patches - display hooks in cyan when they run!

## ⚡ Quick Start

**Step 1: Check your Claude Code version**
```bash
claude --version
```

**Step 2: Run the patch for your version**

**Latest versions (v2.1.x):**

Standard thinking patch:
```bash
cd ~/claude-code-thinking-patch-fork
node patch-thinking-v2.1.12.js       # for v2.1.12 (newest)
node patch-thinking-v2.1.11.js       # for v2.1.11
node patch-thinking-v2.1.9.js        # for v2.1.9
node patch-thinking-v2.1.7.js        # for v2.1.7
node patch-thinking-v2.1.5.js        # for v2.1.5
node patch-thinking-v2.1.4.js        # for v2.1.4
```

Hook highlighting patch (cyan color for hook messages):
```bash
node patch-hooks-v2.1.12.js          # for v2.1.12 (newest)
node patch-hooks-v2.1.11.js          # for v2.1.11
```

Combined thinking + hooks patch:
```bash
node patch-thinking-hooks-v2.1.12.js # for v2.1.12 (both patches)
node patch-thinking-hooks-v2.1.11.js # for v2.1.11 (both patches)
```

Custom styled thinking patch (peach emoji, orange border):
```bash
node patch-thinking-v2.1.12-custom.js  # for v2.1.12 (newest)
node patch-thinking-v2.1.11-custom.js  # for v2.1.11
node patch-thinking-v2.1.9-custom.js   # for v2.1.9
node patch-thinking-v2.1.7-custom.js   # for v2.1.7
node patch-thinking-v2.1.5-custom.js   # for v2.1.5
node patch-thinking-v2.1.4-custom.js   # for v2.1.4
```

**Previous versions (v2.0.17+):**

Standard patch:
```bash
cd ~/claude-code-thinking-patch-fork
node patch-thinking-v2.0.75.js       # for v2.0.75
node patch-thinking-v2.0.74.js       # for v2.0.74
node patch-thinking-v2.0.73.js       # for v2.0.73
node patch-thinking-v2.0.72.js       # for v2.0.72
node patch-thinking-v2.0.71.js       # for v2.0.71
node patch-thinking-v2.0.70.js       # for v2.0.70
node patch-thinking-v2.0.69.js       # for v2.0.69
node patch-thinking-v2.0.61.js       # for v2.0.61
node patch-thinking-v2.0.60.js       # for v2.0.60
node patch-thinking-v2.0.59.js       # for v2.0.59
node patch-thinking-v2.0.58.js       # for v2.0.58
node patch-thinking-v2.0.57.js       # for v2.0.57
node patch-thinking-v2.0.56.js       # for v2.0.56
node patch-thinking-v2.0.55.js       # for v2.0.55
node patch-thinking-v2.0.54.js       # for v2.0.54
node patch-thinking-v2.0.53.js       # for v2.0.53
node patch-thinking-v2.0.52.js       # for v2.0.52
node patch-thinking-v2.0.50.js       # for v2.0.50
node patch-thinking-v2.0.49.js       # for v2.0.49
node patch-thinking-v2.0.47.js       # for v2.0.47
node patch-thinking-v2.0.46.js       # for v2.0.46
node patch-thinking-v2.0.45.js       # for v2.0.45
node patch-thinking-v2.0.44.js       # for v2.0.44
node patch-thinking-v2.0.43.js       # for v2.0.43
node patch-thinking-v2.0.42.js       # for v2.0.42
node patch-thinking-v2.0.37.js       # for v2.0.37
node patch-thinking-v2.0.36.js       # for v2.0.36
node patch-thinking-v2.0.35.js       # for v2.0.35
node patch-thinking-v2.0.34.js       # for v2.0.34
node patch-thinking-v2.0.33.js       # for v2.0.33
node patch-thinking-v2.0.32.js       # for v2.0.32
node patches/patch-thinking-v2.0.31.js       # for v2.0.31
node patches/patch-thinking-v2.0.30.js       # for v2.0.30
node patches/patch-thinking-v2.0.29.js       # for v2.0.29
node patch-thinking-v2.0.28.js       # for v2.0.28
node patch-thinking-v2.0.27.js       # for v2.0.27
node patch-thinking-v2.0.26.js       # for v2.0.26
node patch-thinking-v2.0.24.js       # for v2.0.24
node patch-thinking-v2.0.23.js       # for v2.0.23
node patch-thinking-v2.0.22.js       # for v2.0.22
node patch-thinking-v2.0.21.js       # for v2.0.21
node patch-thinking-v2.0.19.js       # for v2.0.19
node patch-thinking-v2.0.17.js       # for v2.0.17
```

Custom styled patch (orange border, 🍑 peach emoji):
```bash
node patch-thinking-v2.0.75-custom.js                # for v2.0.75 (newest)
node patch-thinking-v2.0.74-custom.js                # for v2.0.74
node patch-thinking-v2.0.73-custom.js                # for v2.0.73
node patch-thinking-v2.0.72-custom.js                # for v2.0.72
node patch-thinking-v2.0.71-custom.js                # for v2.0.71
node patch-thinking-v2.0.70-custom.js                # for v2.0.70
node patch-thinking-v2.0.69-custom.js                # for v2.0.69
node patch-thinking-v2.0.61-custom.js                # for v2.0.61
node patch-thinking-v2.0.60-custom.js                # for v2.0.60
node patch-thinking-v2.0.59-custom.js                # for v2.0.59
node patch-thinking-v2.0.58-custom.js                # for v2.0.58
node patch-thinking-v2.0.57-custom.js                # for v2.0.57
node patch-thinking-v2.0.56-custom.js                # for v2.0.56
node patch-thinking-v2.0.55-custom.js                # for v2.0.55
node patch-thinking-v2.0.54-custom.js                # for v2.0.54
node patch-thinking-v2.0.53-custom.js                # for v2.0.53
node patch-thinking-v2.0.52-custom.js                # for v2.0.52
node patch-thinking-v2.0.50-custom.js                # for v2.0.50
node patch-thinking-v2.0.49-custom.js                # for v2.0.49
node patch-thinking-v2.0.47-custom.js                # for v2.0.47
node patch-thinking-v2.0.46-custom.js                # for v2.0.46
node patch-thinking-v2.0.45-custom.js                # for v2.0.45
node patch-thinking-v2.0.44-custom.js                # for v2.0.44
node patch-thinking-v2.0.43-custom.js                # for v2.0.43
node patch-thinking-v2.0.42-custom.js                # for v2.0.42
node patch-thinking-v2.0.37-custom.js                # for v2.0.37
node patch-thinking-v2.0.36-custom-peach.js          # for v2.0.36
node patch-thinking-v2.0.35-custom-peach.js          # for v2.0.35
node patch-thinking-v2.0.34-custom.js                # for v2.0.34
node patch-thinking-v2.0.33-custom-peach.js          # for v2.0.33
node patch-thinking-v2.0.32-custom.js                # for v2.0.32
node patches/patch-thinking-v2.0.31-custom-peach.js  # for v2.0.31
node patches/patch-thinking-v2.0.30-custom-peach.js  # for v2.0.30
node patches/patch-thinking-v2.0.29-custom.js        # for v2.0.29
node patch-thinking-v2.0.28-custom.js        # for v2.0.28
node patch-thinking-v2.0.27-custom.js    # for v2.0.27
node patch-thinking-v2.0.26-custom.js    # for v2.0.26
node patch-thinking-v2.0.24-custom.js    # for v2.0.24
node patch-thinking-v2.0.23-custom.js    # for v2.0.23
node patch-thinking-v2.0.22-custom.js    # for v2.0.22
node patch-thinking-v2.0.21-custom.js    # for v2.0.21
node patch-thinking-v2.0.19-custom.js    # for v2.0.19
node patch-thinking-v2.0.17-custom.js    # for v2.0.17
```

**Older versions:** See the [Version Support](#version-support) table below for complete list. Patches available for v2.0.11, v2.0.13, v2.0.14, and v2.0.15.

**Step 3: Restart Claude Code**

That's it! Thinking blocks now display inline without `ctrl+o`.

---

## The Problem

Claude Code collapses thinking blocks by default, showing only:
```
∴ Thought for 3s (ctrl+o to show thinking)
```

You have to press `ctrl+o` every time to see the actual thinking content. This patch makes thinking blocks visible inline automatically.

## Version Support

| Version | Thinking Patch | Hooks Patch | Combined | Status |
|---------|----------------|-------------|----------|--------|
| v2.1.12 | `patch-thinking-v2.1.12.js` | `patch-hooks-v2.1.12.js` | `patch-thinking-hooks-v2.1.12.js` | ✅ Working |
| v2.1.11 | `patch-thinking-v2.1.11.js` | `patch-hooks-v2.1.11.js` | `patch-thinking-hooks-v2.1.11.js` | ✅ Working |
| v2.1.9 | `patch-thinking-v2.1.9.js` | - | - | ✅ Working |
| v2.1.7 | `patch-thinking-v2.1.7.js` | - | - | ✅ Working |
| v2.1.5 | `patch-thinking-v2.1.5.js` | - | - | ✅ Working |
| v2.1.4 | `patch-thinking-v2.1.4.js` | - | - | ✅ Working |

| Version | Script | Status |
|---------|--------|--------|
| v2.0.75 | `patch-thinking-v2.0.75.js` | ✅ Working |
| v2.0.74 | `patch-thinking-v2.0.74.js` | ✅ Working |
| v2.0.73 | `patch-thinking-v2.0.73.js` | ✅ Working |
| v2.0.72 | `patch-thinking-v2.0.72.js` | ✅ Working |
| v2.0.71 | `patch-thinking-v2.0.71.js` | ✅ Working |
| v2.0.70 | `patch-thinking-v2.0.70.js` | ✅ Working |
| v2.0.69 | `patch-thinking-v2.0.69.js` | ✅ Working |
| v2.0.61 | `patch-thinking-v2.0.61.js` | ✅ Working |
| v2.0.60 | `patch-thinking-v2.0.60.js` | ✅ Working |
| v2.0.59 | `patch-thinking-v2.0.59.js` | ✅ Working |
| v2.0.58 | `patch-thinking-v2.0.58.js` | ✅ Working |
| v2.0.57 | `patch-thinking-v2.0.57.js` | ✅ Working |
| v2.0.56 | `patch-thinking-v2.0.56.js` | ✅ Working |
| v2.0.55 | `patch-thinking-v2.0.55.js` | ✅ Working |
| v2.0.54 | `patch-thinking-v2.0.54.js` | ✅ Working |
| v2.0.53 | `patch-thinking-v2.0.53.js` | ✅ Working |
| v2.0.52 | `patch-thinking-v2.0.52.js` | ✅ Working |
| v2.0.50 | `patch-thinking-v2.0.50.js` | ✅ Working |
| v2.0.49 | `patch-thinking-v2.0.49.js` | ✅ Working |
| v2.0.47 | `patch-thinking-v2.0.47.js` | ✅ Working |
| v2.0.46 | `patch-thinking-v2.0.46.js` | ✅ Working |
| v2.0.45 | `patch-thinking-v2.0.45.js` | ✅ Working |
| v2.0.44 | `patch-thinking-v2.0.44.js` | ✅ Working |
| v2.0.43 | `patch-thinking-v2.0.43.js` | ✅ Working |
| v2.0.42 | `patch-thinking-v2.0.42.js` | ✅ Working |
| v2.0.37 | `patch-thinking-v2.0.37.js` | ✅ Working |
| v2.0.36 | `patch-thinking-v2.0.36.js` | ✅ Working |
| v2.0.35 | `patch-thinking-v2.0.35.js` | ✅ Working |
| v2.0.34 | `patch-thinking-v2.0.34.js` | ✅ Working |
| v2.0.33 | `patch-thinking-v2.0.33.js` | ✅ Working |
| v2.0.32 | `patch-thinking-v2.0.32.js` | ✅ Working |
| v2.0.31 | `patches/patch-thinking-v2.0.31.js` | ✅ Working |
| v2.0.30 | `patch-thinking-v2.0.30.js` | ✅ Working |
| v2.0.29 | `patch-thinking-v2.0.29.js` | ✅ Working |
| v2.0.28 | `patch-thinking-v2.0.28.js` | ✅ Working |
| v2.0.27 | `patch-thinking-v2.0.27.js` | ✅ Working |
| v2.0.26 | `patch-thinking-v2.0.26.js` | ✅ Working |
| v2.0.24 | `patch-thinking-v2.0.24.js` | ✅ Working |
| v2.0.23 | `patch-thinking-v2.0.23.js` | ✅ Working |
| v2.0.22 | `patch-thinking-v2.0.22.js` | ✅ Working |
| v2.0.21 | `patch-thinking-v2.0.21.js` | ✅ Working |
| v2.0.19 | `patch-thinking-v2.0.19.js` | ✅ Working |
| v2.0.17 | `patch-thinking-v2.0.17.js` | ✅ Working |
| v2.0.15 | `patch-thinking-v2.0.15.js` | ✅ Working |
| v2.0.14 | `patch-thinking-v2.0.14.js` | ✅ Working |
| v2.0.13 | `patch-thinking-v2.0.13.js` | ✅ Working |
| v2.0.11 | `patch-thinking.js` | ✅ Working |

All scripts now support **dynamic username detection** - they work on any system without hardcoded paths!

## What This Patch Does

**Before:**
```
∴ Thought for 3s (ctrl+o to show thinking)
[thinking content hidden]
```

**After (Standard):**
```
∴ Thinking…

  [thinking content displayed inline]
  The actual thinking process is now visible
  without any keyboard shortcuts needed
```

**After (Custom Styled):**
```
┌─────────────────────────────────┐
│ 💭 Thinking Process             │
│                                 │
│  [thinking content displayed    │
│   with custom styling and       │
│   bordered box]                 │
└─────────────────────────────────┘
```

## 🔵 Hook Highlighting (New in v2.1.x)

Claude Code hooks (configured in `.claude/settings.json`) now display in **cyan** when they run, making it easy to distinguish hook activity from regular output.

### What Hooks Look Like

**Before (default):**
```
SessionStart hook succeeded
PreToolUse:Bash hook says: Running pre-check...
```

**After (with patch):**
```
SessionStart hook succeeded           # displayed in CYAN
PreToolUse:Bash hook says: ...        # displayed in CYAN
```

### Hook Color Scheme

| Hook Event Type | Color | Notes |
|-----------------|-------|-------|
| `hook_success` | Cyan | Hook completed successfully |
| `hook_system_message` | Cyan | Hook output message |
| `hook_permission_decision` | Cyan | Hook allowed/denied action |
| `hook_error_during_execution` | Cyan | Non-critical warning |
| `hook_blocking_error` | Red | Critical error (unchanged) |
| `hook_non_blocking_error` | Red | Error output (unchanged) |
| `hook_stopped_continuation` | Yellow | Hook stopped execution (unchanged) |

### How to Apply

**Hook highlighting only:**
```bash
node patch-hooks-v2.1.11.js
```

**Both thinking visibility + hook highlighting:**
```bash
node patch-thinking-hooks-v2.1.11.js
```

## 🎨 Customization

### Custom Styling (v2.0.15+)

The custom patch (`patch-thinking-v2.0.15-custom.js`) adds visual enhancements to thinking blocks. You can easily modify the styling by editing the patch file:

**Available Customizations:**

1. **Border Styles**
   - `borderStyle:"single"` → `"double"`, `"round"`, `"bold"`
   - `borderColor:"suggestion"` → `"error"` (red), `"warning"` (yellow), `"text"` (default)

2. **Colors**
   - `color:"suggestion"` (green) → `"error"` (red), `"warning"` (yellow), `"text"` (default)
   - Add `backgroundColor:"memoryBackgroundColor"` for highlights

3. **Header Text**
   - Change `"💭 Thinking Process"` to any text you prefer
   - Remove emoji or customize the wording

4. **Layout & Spacing**
   - `paddingX:1` → adjust horizontal padding
   - `marginTop:1` → adjust vertical spacing
   - `gap:1` → spacing between header and content

**Example Modifications:**

```javascript
// Minimal style (no border)
return Jn.default.createElement(j,{flexDirection:"column",marginTop:B?1:0,width:"100%"},
  Jn.default.createElement($,{color:"text",bold:!0},"Thinking:"),
  Jn.default.createElement($,{dimColor:!0},ZV(A,Z))
);

// High-contrast style (double border, red)
return Jn.default.createElement(j,{flexDirection:"column",borderStyle:"double",borderColor:"error",paddingX:2,marginTop:B?1:0,width:"100%"},
  Jn.default.createElement($,{color:"error",bold:!0},"🧠 Deep Thinking"),
  Jn.default.createElement($,null,ZV(A,Z))
);
```

### Universal Identifier Detector

For **new Claude Code versions** or to create custom patches, use the universal identifier detector:

```bash
node detect-identifiers.js
```

This tool:
- ✅ Works on **any Claude Code version** (universal, no version-specific logic)
- 🔍 Automatically detects minified function names and identifiers
- 📊 Shows current patch status
- 🛠️ Provides patterns for creating new patches

**Output includes:**
- Banner function name (e.g., `KYB`, `pGB`, `hGB`)
- Thinking component name (`FpB`)
- Variable identifiers for `isTranscriptMode`
- Whether patches are already applied
- Custom styling detection

Use this when:
- You have a Claude Code version not listed here
- You want to create custom modifications
- You need to verify patch compatibility
- Debugging why a patch isn't working

## How It Works

This patch modifies two locations in Claude Code's compiled JavaScript:

### Patch 1: Remove the Banner

Replaces the thinking banner function with `return null` to hide the "Thinking..." / "Thought for Xs" message.

### Patch 2: Force Thinking Visibility

Changes `isTranscriptMode` to always be `true`, making thinking content always visible inline.

See [CHANGELOG.md](CHANGELOG.md) for technical details on version differences.

## Files Structure

```
claude-code-thinking-patch-fork/
├── patch-thinking-v2.1.12.js         # v2.1.12 standard thinking patch (newest)
├── patch-thinking-v2.1.12-custom.js  # v2.1.12 custom styled patch
├── patch-hooks-v2.1.12.js            # v2.1.12 hook highlighting (cyan)
├── patch-thinking-hooks-v2.1.12.js   # v2.1.12 combined (thinking + hooks)
├── patch-thinking-v2.1.11.js         # v2.1.11 standard thinking patch
├── patch-thinking-v2.1.11-custom.js  # v2.1.11 custom styled patch
├── patch-hooks-v2.1.11.js            # v2.1.11 hook highlighting (cyan)
├── patch-thinking-hooks-v2.1.11.js   # v2.1.11 combined (thinking + hooks)
├── patch-thinking-v2.1.9.js          # v2.1.9 standard patch
├── patch-thinking-v2.1.9-custom.js   # v2.1.9 custom styled patch
├── patch-thinking-v2.1.7.js          # v2.1.7 standard patch
├── patch-thinking-v2.1.7-custom.js   # v2.1.7 custom styled patch
├── patch-thinking-v2.1.5.js          # v2.1.5 standard patch
├── patch-thinking-v2.1.5-custom.js   # v2.1.5 custom styled patch
├── patch-thinking-v2.1.4.js          # v2.1.4 standard patch
├── patch-thinking-v2.1.4-custom.js   # v2.1.4 custom styled patch
├── patch-thinking.js                 # v2.0.11 standard patch
├── patch-thinking-v2.0.*.js          # v2.0.x standard patches
├── patch-thinking-v2.0.*-custom.js   # v2.0.x custom styled patches
├── detect-identifiers.js             # Universal identifier detector (works on any version)
├── CHANGELOG.md                      # Technical version differences
└── README.md                         # This file
```

**Target file (auto-detected):**
```
~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js
```

The scripts automatically detect your username using `os.homedir()`, so they work on any system!

## Important: After Claude Code Updates

When you run `claude update`, the patches will be **overwritten**. You must re-apply them:

```bash
# Check new version
claude --version

# Run appropriate patch (see Quick Start above)
cd ~/claude-code-thinking-patch-fork
node patch-thinking-v2.0.21.js      # example for v2.0.21

# Restart Claude Code
```

The patch scripts:
- Auto-detect your username and home directory
- Check if the file exists before patching
- Apply both patches atomically
- Report success or failure
- Safe to run multiple times

## Troubleshooting

### How do I know which version I have?

```bash
claude --version
```

Or use the universal identifier detector:
```bash
node detect-identifiers.js
```

### Patch Script Says "Pattern not found"

This means:
1. You're running the wrong version script
2. Claude Code has been updated to a newer version
3. The patches are already applied

**Solution:**
- Check your Claude Code version with `claude --version`
- Run the correct patch script
- If both fail, check [CHANGELOG.md](CHANGELOG.md) for pattern detection commands

### Thinking Still Collapsed After Patching

**Solution:** You must restart Claude Code for changes to take effect. Exit Claude Code completely and restart.

### File Not Found Error

**Solution:** Make sure Claude Code is installed. The patch looks for:
```
~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js
```

## Verification

Verify patches are applied:

```bash
# Use the universal detector to check patch status
node detect-identifiers.js
```

The detector will show whether patches have been applied and if custom styling is detected.

## Technical Details

### Why Two Patches?

1. **Banner Function:** Controls the UI banner shown after thinking completes
2. **Thinking Renderer:** Controls whether the actual thinking text is displayed

Both must be patched because they're separate systems:
- Patching only the banner → Blank line appears where thinking should be
- Patching only the renderer → Banner still shows "ctrl+o to show"

### Pattern Discovery

The patches target specific patterns in the minified code. See [CHANGELOG.md](CHANGELOG.md) for:
- Exact patterns for each version
- How to find patterns in future versions
- Technical breakdown of changes

## Limitations

1. **Breaks on updates:** Must re-run after `claude update`
2. **Minified code:** Fragile, may break with version changes
3. **No official config:** This is a workaround until Anthropic adds a setting

## Future Versions

If your Claude Code version isn't supported:

1. **Run the universal identifier detector** to find patterns:
   ```bash
   node detect-identifiers.js
   ```
   This automatically detects all required identifiers for any version.

2. Use the detected patterns to create a new patch script (copy an existing one and update the patterns)

3. Create a PR with the new patch!

**Manual pattern detection (if detector fails):**
```bash
# Find banner function
grep -o 'function \w\+({streamMode:\w\+}){[^}]*"∴ Thinking…"[^}]*}' \
  ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js

# Find thinking visibility
grep -o 'case"thinking":if[^;]*isTranscriptMode:[^;]*;' \
  ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js
```

## Feature Request

Consider requesting this as an official feature from Anthropic:
- Configuration option to always show thinking
- User preference in settings
- Toggle command like `/thinking show` or `/thinking hide`

## Credits & Attribution

This fork builds upon the original work by [@aleks-apostle](https://github.com/aleks-apostle). Key improvements in this fork:
- Dynamic username detection (no hardcoded paths)
- Multi-version support (v2.0.11, v2.0.13, v2.0.14, v2.0.15)
- **Universal identifier detector** (works on any version)
- **Custom styling patches** (borders, colors, custom headers)
- Comprehensive changelog documenting version differences
- Enhanced documentation and troubleshooting guides

**Original repository:** The original concept and v2.0.11 implementation

**This fork maintained by:** [@biostochastics](https://github.com/biostochastics)

## License

This patch is provided as-is for educational purposes. Use at your own risk.

---

**Last Updated:** 2026-01-17
**Supported Versions:** v2.1.12, v2.1.11, v2.1.9, v2.1.7, v2.1.5, v2.1.4, v2.0.75, v2.0.74, v2.0.73, v2.0.72, v2.0.71, v2.0.70, v2.0.69, v2.0.61, v2.0.60, v2.0.59, v2.0.58, v2.0.57, v2.0.56, v2.0.55, v2.0.54, v2.0.53, v2.0.52, v2.0.50, v2.0.49, v2.0.47, v2.0.46, v2.0.45, v2.0.44, v2.0.43, v2.0.42, v2.0.37, v2.0.36, v2.0.35, v2.0.34, v2.0.33, v2.0.32, v2.0.31, v2.0.30, v2.0.29, v2.0.28, v2.0.27, v2.0.26, v2.0.24, v2.0.23, v2.0.22, v2.0.21, v2.0.19, v2.0.17, v2.0.15, v2.0.14, v2.0.13, v2.0.11
**Status:** ✅ Working
**New Features:** 🔵 Hook highlighting (cyan) · 🎨 Custom styling patches · 🔍 Universal identifier detector

### Contributing

Found patterns for a new version? PRs welcome!

1. Fork this repo
2. Add new patch script (e.g., `patch-thinking-v2.0.14.js`)
3. Update [CHANGELOG.md](CHANGELOG.md) with pattern changes
4. Update this README with version support
5. Submit PR
