# Claude Code Thinking Display Patch

Make Claude Code's thinking blocks visible by default without pressing `ctrl+o`.

## ⚡ Quick Start

**Step 1: Check your Claude Code version**
```bash
claude --version
```

**Step 2: Run the appropriate patch**

For **v2.0.11**:
```bash
cd ~/claude-code-thinking-patch-fork
node patch-thinking.js
```

For **v2.0.13**:
```bash
cd ~/claude-code-thinking-patch-fork
node patch-thinking-v2.0.13.js
```

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

| Version | Script | Status |
|---------|--------|--------|
| v2.0.11 | `patch-thinking.js` | ✅ Working |
| v2.0.13 | `patch-thinking-v2.0.13.js` | ✅ Working |

Both scripts now support **dynamic username detection** - they work on any system without hardcoded paths!

## What This Patch Does

**Before:**
```
∴ Thought for 3s (ctrl+o to show thinking)
[thinking content hidden]
```

**After:**
```
∴ Thinking…

  [thinking content displayed inline]
  The actual thinking process is now visible
  without any keyboard shortcuts needed
```

## How It Works

This patch modifies two locations in Claude Code's compiled JavaScript:

### Patch 1: Remove the Banner

Replaces the thinking banner function with a simple `return null`:

**v2.0.11**: Patches `er2` function
**v2.0.13**: Patches `hGB` function

**Effect:** Removes the collapsed thinking banner entirely.

### Patch 2: Force Thinking Visibility

Changes the transcript mode check to always return `true`:

**v2.0.11**: Changes `isTranscriptMode:K` → `isTranscriptMode:!0`
**v2.0.13**: Changes `isTranscriptMode:D` → `isTranscriptMode:!0`

**Effect:** Forces thinking content to render as if in transcript mode (visible).

See [CHANGELOG.md](CHANGELOG.md) for technical details on version differences.

## Files Structure

```
claude-code-thinking-patch-fork/
├── patch-thinking.js           # v2.0.11 patch
├── patch-thinking-v2.0.13.js   # v2.0.13 patch
├── CHANGELOG.md                # Technical version differences
└── README.md                   # This file
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

# Run appropriate patch
cd ~/claude-code-thinking-patch-fork
node patch-thinking.js              # for v2.0.11
# or
node patch-thinking-v2.0.13.js      # for v2.0.13

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

Or check for function names in cli.js:
```bash
# Check for v2.0.11 (er2 function)
grep -o "function er2" ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js

# Check for v2.0.13 (hGB function)
grep -o "function hGB" ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js
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

Check if patches are applied:

**For v2.0.11:**
```bash
# Check er2 patch
grep -o "function er2({streamMode:A}){return null}" ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js

# Should return: function er2({streamMode:A}){return null}
```

**For v2.0.13:**
```bash
# Check hGB patch
grep -o "function hGB({streamMode:A}){return null}" ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js

# Should return: function hGB({streamMode:A}){return null}
```

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

1. Check [CHANGELOG.md](CHANGELOG.md) for pattern detection commands
2. Create an issue with your version number
3. Or create a PR with the new patterns!

Pattern detection example:
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

This fork builds upon the original work by [@aleks](https://github.com/aleks). Key improvements in this fork:
- Dynamic username detection (no hardcoded paths)
- Multi-version support (v2.0.11 and v2.0.13)
- Comprehensive changelog documenting version differences
- Enhanced documentation and troubleshooting guides

**Original repository:** The original concept and v2.0.11 implementation

**This fork maintained by:** [@biostochastics](https://github.com/biostochastics)

## License

This patch is provided as-is for educational purposes. Use at your own risk.

---

**Last Updated:** 2025-10-09
**Supported Versions:** v2.0.11, v2.0.13
**Status:** ✅ Working

### Contributing

Found patterns for a new version? PRs welcome!

1. Fork this repo
2. Add new patch script (e.g., `patch-thinking-v2.0.14.js`)
3. Update [CHANGELOG.md](CHANGELOG.md) with pattern changes
4. Update this README with version support
5. Submit PR
