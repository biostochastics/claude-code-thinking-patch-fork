# Claude Code Thinking Display Patch

[![DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/biostochastics/claude-code-thinking-patch-fork)

Make Claude Code's thinking blocks visible by default without pressing `ctrl+o`.

> **Note:** The default Claude Code installation (v2.1.13+) uses a binary format that can't be patched.
> You can still patch versions installed via npm — see [Installation](#installation).

## Quick Start

```bash
# Check your version and format
claude --version
file $(which claude)  # Should show "node script" not "Mach-O executable"

# Run the matching patch
node patch-thinking-v2.1.112-custom-peach.js  # For npm-installed v2.1.112

# Restart Claude Code
```

---

## Installation

Anthropic's default installation now uses a compiled binary, but **npm installation still provides a patchable Node.js version**.

```bash
npm install -g @anthropic-ai/claude-code
```

See Anthropic's docs: [NPM Installation](https://code.claude.com/docs/en/setup#npm-installation-deprecated)

**Verify you have the patchable version:**
```bash
file $(which claude)
# Patchable:     "a /usr/bin/env node script text executable"
# Not patchable: "Mach-O 64-bit executable arm64"
```

---

## Patch Types

| Type | File | Description |
|------|------|-------------|
| **Standard** | `patch-thinking-v*.js` | Shows thinking inline, minimal styling |
| **Custom** | `patch-thinking-v*-custom.js` | Orange border, bold header |
| **Custom Peach** | `patch-thinking-v*-custom-peach.js` | Theme-colored border, "🍑 Thinking Process" header + gate fix |
| **Hooks** | `patch-hooks-v*.js` | Hook messages in cyan (older versions) |

---

## Version Compatibility

| Version | Patches | Install Method |
|---------|---------|----------------|
| **v2.1.112** | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.109 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.107 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.104 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.90 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.89 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.85 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.81 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.76 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.74 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.69 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.63 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.50 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.44 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.37 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.32 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.30 | Standard, Custom, Custom Peach | `npm install -g` |
| v2.1.19 | Standard, Custom | `npm install -g` |
| v2.1.12 | Standard, Custom, Hooks | `claude update` (legacy) |
| v2.1.4–v2.1.11 | Standard, Custom | `claude update` (legacy) |
| v2.0.x | Standard, Custom | Legacy |

Patches for older versions are in the repository. Run `claude --version` and use the matching patch file.

---

## Why Binary Versions Can't Be Patched

Starting with v2.1.13, the default installation (`claude update`) uses a compiled Bun binary instead of Node.js.

| Format | Patchable | How to get |
|--------|-----------|------------|
| Node.js (`cli.js`) | ✅ Yes | `npm install -g @anthropic-ai/claude-code` |
| Binary (Mach-O/ELF) | ❌ No | `claude update` (default) |

Binary patching fails because:
- Replacements must be exactly the same byte length
- Adding styling would change the file size
- macOS may reject modified binaries due to code signing

---

## After Updates

Updates overwrite patches. Re-apply after updating:

```bash
claude --version
node patch-thinking-v2.1.112-custom-peach.js
```

---

## Customization

Edit the `-custom.js` patches to change styling:

- **Border styles:** `"single"`, `"double"`, `"round"`, `"bold"`
- **Colors:** `"#FFA500"` (orange), `"error"`, `"warning"`, `"suggestion"`

---

## Troubleshooting

**"Pattern not found"**
- Check `claude --version` and use matching patch
- May already be patched — restart Claude Code

**Thinking still collapsed**
- Restart Claude Code after patching

**Wrong file format**
- Run `file $(which claude)` — should show "node script", not "Mach-O"
- If binary, reinstall via npm

---

## How It Works

The patch modifies three areas in Claude Code's minified JavaScript:

1. **API layer (v2.1.76+):** Disables the `"redact-thinking-2026-02-12"` beta header so the server sends full thinking content instead of empty redacted blocks
2. **Gate function (v2.1.30+):** e.g. `if(!M&&!A)return null` → `if(!1)return null` — allows thinking blocks through the rendering gate
3. **Display component:** `if(hideInTranscript)return null` → `if(!1)return null` and `if(!verbose)return collapsed` → `if(!1)return collapsed` — always shows expanded thinking

Without the API layer patch (step 1), the server never sends thinking content regardless of rendering fixes.

See [CHANGELOG.md](CHANGELOG.md) for version-specific technical details.

---

## Files

```
patch-thinking-v2.1.112.js              # Latest standard (npm)
patch-thinking-v2.1.112-custom.js       # Latest custom (npm)
patch-thinking-v2.1.112-custom-peach.js # Latest custom peach (npm, recommended)
patch-thinking-v2.1.90*.js              # v2.1.90 patches
patch-thinking-v2.1.81*.js              # v2.1.81 patches
patch-thinking-v2.1.76*.js             # v2.1.76 patches
patch-thinking-v2.1.74*.js             # v2.1.74 patches
patch-thinking-v2.1.63*.js             # v2.1.63 patches
patch-thinking-v2.1.50*.js             # v2.1.50 patches
patch-thinking-v*.js                   # Older versions
detect-identifiers.js                  # Find identifiers for new versions
```

---

## Contributing

1. Run `node detect-identifiers.js` to find identifiers for your version
2. Copy the closest existing patch and update patterns
3. Test and submit PR

---

## Credits

**Original:** [@aleks-apostle](https://github.com/aleks-apostle)

**This fork:** [@biostochastics](https://github.com/biostochastics)

---

## License

Provided as-is for educational purposes. Use at your own risk.

---

**Last updated:** 2026-04-16 · **Latest:** v2.1.112 (npm)
