# Claude Code Thinking Display Patch

[![DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/biostochastics/claude-code-thinking-patch-fork)

> ⚠️ **DEPRECATION NOTICE (v2.1.13+)**
> Starting with Claude Code v2.1.13, Anthropic switched from a Node.js-based CLI (`cli.js`) to a native Bun-compiled binary. This fundamentally changes the architecture and **makes JavaScript-based patching incompatible**.
>
> **Last supported version: v2.1.12**
>
> See [Binary Format Change](#-binary-format-change-v2113) for details.

Make Claude Code's thinking blocks visible by default without pressing `ctrl+o`.

## Quick Start

```bash
# 1. Check your version
claude --version

# 2. Run the matching patch
cd ~/claude-code-thinking-patch-fork
node patch-thinking-v2.1.12.js        # Standard patch
# OR
node patch-thinking-v2.1.12-custom.js # Custom styled (orange border, peach emoji)

# 3. Restart Claude Code
```

**That's it!** Thinking blocks now display inline automatically.

---

## Table of Contents

- [The Problem](#the-problem)
- [Patch Types](#patch-types)
- [Version Compatibility](#version-compatibility)
- [Important Caveats](#%EF%B8%8F-important-caveats)
- [Customization](#-customization)
- [Troubleshooting](#troubleshooting)
- [How It Works](#how-it-works)
- [Contributing](#contributing)

---

## The Problem

Claude Code collapses thinking blocks by default:

```
∴ Thought for 3s (ctrl+o to show thinking)
```

You have to press `ctrl+o` every time to see thinking content. This patch makes it visible automatically.

**Before → After:**

| Default | Standard Patch | Custom Patch |
|---------|----------------|--------------|
| `∴ Thought for 3s (ctrl+o...)` | `∴ Thinking…` + content | 🍑 Orange bordered box |

---

## Patch Types

| Type | File Pattern | Description |
|------|--------------|-------------|
| **Standard** | `patch-thinking-v*.js` | Shows thinking inline with minimal styling |
| **Custom** | `patch-thinking-v*-custom.js` | Orange border, "🍑 Thinking Process" header |
| **Hooks** | `patch-hooks-v*.js` | Displays hook messages in cyan (v2.1.x only) |
| **Combined** | `patch-thinking-hooks-v*.js` | Both thinking + hooks patches |

### Hook Highlighting (v2.1.x)

```bash
node patch-hooks-v2.1.12.js            # Hooks only
node patch-thinking-hooks-v2.1.12.js   # Thinking + Hooks combined
```

Hook messages display in **cyan** to distinguish from regular output:
- `SessionStart hook succeeded` → cyan
- `PreToolUse:Bash hook says: ...` → cyan

---

## Version Compatibility

### Current Versions (v2.1.x)

| Version | Standard | Custom | Hooks | Combined |
|---------|----------|--------|-------|----------|
| v2.1.12 | ✅ | ✅ | ✅ | ✅ |
| v2.1.11 | ✅ | ✅ | ✅ | ✅ |
| v2.1.9  | ✅ | ✅ | — | — |
| v2.1.7  | ✅ | ✅ | — | — |
| v2.1.5  | ✅ | ✅ | — | — |
| v2.1.4  | ✅ | ✅ | — | — |

### Previous Versions (v2.0.x)

<details>
<summary>Click to expand v2.0.x version list</summary>

| Version | Standard | Custom |
|---------|----------|--------|
| v2.0.75 | ✅ | ✅ |
| v2.0.74 | ✅ | ✅ |
| v2.0.73 | ✅ | ✅ |
| v2.0.72 | ✅ | ✅ |
| v2.0.71 | ✅ | ✅ |
| v2.0.70 | ✅ | ✅ |
| v2.0.69 | ✅ | ✅ |
| v2.0.61 | ✅ | ✅ |
| v2.0.60 | ✅ | ✅ |
| v2.0.59 | ✅ | ✅ |
| v2.0.58 | ✅ | ✅ |
| v2.0.57 | ✅ | ✅ |
| v2.0.56 | ✅ | ✅ |
| v2.0.55 | ✅ | ✅ |
| v2.0.54 | ✅ | ✅ |
| v2.0.53 | ✅ | ✅ |
| v2.0.52 | ✅ | ✅ |
| v2.0.50 | ✅ | ✅ |
| v2.0.49 | ✅ | ✅ |
| v2.0.47 | ✅ | ✅ |
| v2.0.46 | ✅ | ✅ |
| v2.0.45 | ✅ | ✅ |
| v2.0.44 | ✅ | ✅ |
| v2.0.43 | ✅ | ✅ |
| v2.0.42 | ✅ | ✅ |
| v2.0.37 | ✅ | ✅ |
| v2.0.36 | ✅ | ✅ |
| v2.0.35 | ✅ | ✅ |
| v2.0.34 | ✅ | ✅ |
| v2.0.33 | ✅ | ✅ |
| v2.0.32 | ✅ | ✅ |
| v2.0.31 | ✅ | ✅ |
| v2.0.30 | ✅ | ✅ |
| v2.0.29 | ✅ | ✅ |
| v2.0.28 | ✅ | ✅ |
| v2.0.27 | ✅ | ✅ |
| v2.0.26 | ✅ | ✅ |
| v2.0.24 | ✅ | ✅ |
| v2.0.23 | ✅ | ✅ |
| v2.0.22 | ✅ | ✅ |
| v2.0.21 | ✅ | ✅ |
| v2.0.19 | ✅ | ✅ |
| v2.0.17 | ✅ | ✅ |
| v2.0.15 | ✅ | ✅ |
| v2.0.14 | ✅ | — |
| v2.0.13 | ✅ | — |
| v2.0.11 | ✅ | — |

</details>

---

## ⛔ Binary Format Change (v2.1.13+)

Starting with **v2.1.13**, Claude Code is distributed as a **native Bun-compiled binary** instead of a Node.js package with `cli.js`.

### What Changed

| Aspect | v2.1.12 and earlier | v2.1.13+ |
|--------|---------------------|----------|
| **Format** | Node.js (`cli.js`) | Native binary (Mach-O/ELF) |
| **Location** | `~/.claude/local/node_modules/` | `~/.local/bin/claude` |
| **Size** | ~5-10 MB | ~180 MB |
| **Patchable** | ✅ Yes (JavaScript text) | ❌ No (compiled binary) |

### Why Patches Don't Work

The JavaScript source is now embedded and compiled into the binary. While the code patterns still exist inside the binary (extractable via `strings`), modifying them requires:

1. **Same-length replacements** — Binary patching can't change file size without corruption
2. **Byte-exact matching** — No tolerance for whitespace or encoding differences
3. **Code signing issues** — Modified binaries may fail macOS code signing checks

### Alternatives

1. **Stay on v2.1.12** — If patching is essential, don't upgrade past v2.1.12
2. **Request official support** — Ask Anthropic for a `--show-thinking` flag or config option
3. **Use transcript mode** — Press `ctrl+o` to toggle thinking visibility (built-in)

### Checking Your Version

```bash
claude --version
file $(which claude)  # Shows "Mach-O 64-bit executable" for binary versions
```

---

## ⚠️ Important Caveats

### Installation Locations

Claude Code can exist in **two locations**. Patches only persist reliably on one:

| Location | Source | Patch Persistence |
|----------|--------|-------------------|
| `~/.claude/local/` | `claude update` | ✅ **Recommended** — persists until next update |
| npm global | `npm install -g` | ❌ **Problematic** — auto-reverts patches |

**Check which you're using:**
```bash
which claude
# ✅ Good: ~/.claude/local/claude
# ❌ Bad:  ~/.nvm/.../bin/claude (or similar npm path)
```

### Patch Keeps Reverting?

If patches disappear after working briefly, you have the npm global install. Fix it:

```bash
npm uninstall -g @anthropic-ai/claude-code
which claude  # Should now show ~/.claude/local/claude
```

### After `claude update`

Updates overwrite patches. Re-apply after updating:

```bash
claude --version  # Check new version
node patch-thinking-v2.1.12.js  # Re-apply matching patch
```

---

## 🎨 Customization

### Custom Patch Styling

The `-custom.js` patches use orange borders and a peach emoji. Modify the styling by editing the replacement string in the patch file:

**Border styles:** `"single"`, `"double"`, `"round"`, `"bold"`

**Colors:** `"#FFA500"` (orange), `"error"` (red), `"warning"` (yellow), `"suggestion"` (green)

**Example modifications:**
```javascript
// Minimal (no border)
borderStyle: undefined, color: "text"

// High contrast
borderStyle: "double", borderColor: "error", color: "error"
```

### Universal Identifier Detector

For unsupported versions or custom patches:

```bash
node detect-identifiers.js
```

This detects minified function names for any Claude Code version.

---

## Troubleshooting

### "Pattern not found"

- Wrong patch version — check `claude --version`
- Patch already applied — run `node detect-identifiers.js` to verify
- New Claude version — may need new patch (see [Contributing](#contributing))

### Thinking still collapsed

Restart Claude Code completely after patching.

### File not found

Claude Code not installed. The patch looks for:
```
~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js
```

### Patch keeps disappearing

See [Patch Keeps Reverting](#patch-keeps-reverting) above.

---

## How It Works

The patch modifies two locations in Claude Code's minified JavaScript:

1. **Visibility check** — Changes `if(Z)` to `if(!1)` to disable the "hide in transcript" behavior
2. **Transcript mode check** — Changes `if(!(B||G))` to `if(!1)` to always show full thinking content

Custom patches also modify the React component styling (border, colors, header text).

See [CHANGELOG.md](CHANGELOG.md) for technical details on version-specific identifiers.

---

## Files

```
claude-code-thinking-patch-fork/
├── patch-thinking-v2.1.12.js          # Latest standard
├── patch-thinking-v2.1.12-custom.js   # Latest custom
├── patch-hooks-v2.1.12.js             # Hook highlighting
├── patch-thinking-hooks-v2.1.12.js    # Combined
├── patch-thinking-v*.js               # Older versions
├── detect-identifiers.js              # Universal detector
├── CHANGELOG.md                       # Technical changes
└── README.md
```

---

## Contributing

### Adding Support for New Versions

1. Run `node detect-identifiers.js` to find identifiers
2. Copy the closest existing patch and update patterns
3. Test the patch
4. Update CHANGELOG.md with identifier changes
5. Submit PR

### Feature Request

Consider requesting official support from Anthropic:
- Configuration option to always show thinking
- Toggle command like `/thinking show`

---

## Credits

**Original concept:** [@aleks-apostle](https://github.com/aleks-apostle)

**This fork:** [@biostochastics](https://github.com/biostochastics)
- Multi-version support (50+ versions)
- Universal identifier detector
- Custom styling patches
- Hook highlighting patches
- Multi-installation detection

---

## License

Provided as-is for educational purposes. Use at your own risk.

---

**Last Updated:** 2026-01-26 · **Latest Supported Version:** v2.1.12 · **Status:** ⚠️ DEPRECATED (v2.1.13+ uses native binary)
