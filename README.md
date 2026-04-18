# Claude Code Thinking Display Patch

[![DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/biostochastics/claude-code-thinking-patch-fork)

Make Claude Code's thinking blocks visible by default without pressing `ctrl+o`.

> **v2.1.113 is now patchable** — npm switched to shipping a native Bun SEA
> binary (`bin/claude.exe`) instead of `cli.js`. The v2.1.113 patchers use
> same-length byte substitutions in the binary and ad-hoc `codesign` on macOS.
> Historical visual customizations (orange border, peach theme) aren't
> reproducible in the binary format; functional patches (visibility + gate fix)
> are preserved.

## Quick Start

```bash
# Check your version
claude --version

# v2.1.113+ (binary format, recommended patch: custom-peach for default-mode visibility)
node patch-thinking-v2.1.113-custom-peach.js

# Older versions with cli.js format
# node patch-thinking-v2.1.112-custom-peach.js

# Restart Claude Code
```

---

## Installation

```bash
npm install -g @anthropic-ai/claude-code
```

See Anthropic's docs: [NPM Installation](https://code.claude.com/docs/en/setup#npm-installation-deprecated)

**Two formats are supported:**
- **v2.1.113+** — Native Bun SEA binary (`bin/claude.exe`). Patched via same-length byte substitution + `codesign --force --sign -` on macOS.
- **v2.1.112 and earlier** — Plain `cli.js`. Patched via string replace.

The patcher auto-detects format and installation path.

**Check your version:**
```bash
claude --version
```

---

## Patch Types

| Type | File | Description |
|------|------|-------------|
| **Standard** | `patch-thinking-v*.js` | Thinking inline; visibility + redact-thinking fixes only |
| **Custom** | `patch-thinking-v*-custom.js` | v2.1.112 and earlier: orange border / bold header. v2.1.113+: same as Standard (styling not reproducible in the binary) |
| **Custom Peach** | `patch-thinking-v*-custom-peach.js` | All of the above + the gate fix so thinking renders in default mode (no ctrl+o, no --verbose). v2.1.113+ keeps the gate fix; peach theme isn't available in the binary |
| **Hooks** | `patch-hooks-v*.js` | Hook messages in cyan (older versions only) |

---

## Version Compatibility

| Version | Patches | Install Method |
|---------|---------|----------------|
| **v2.1.113** | Standard, Custom, Custom Peach (binary; no visual styling) | `npm install -g` |
| v2.1.112 | Standard, Custom, Custom Peach | `npm install -g` |
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

## Binary Patching (v2.1.113+)

As of v2.1.113, `npm install -g @anthropic-ai/claude-code` ships a native
Bun SEA binary (`bin/claude.exe`, ~200 MB) with the JS bundle embedded in a
`__BUN` Mach-O segment. The bundle is stored as plain UTF-8 text that can be
located and edited, but with two constraints:

| Constraint | Why |
|------------|-----|
| Replacements must be **same-length** | Mach-O offsets and segment sizes are fixed — any length change corrupts the binary |
| The bundle is **duplicated** inside the segment | Every patch must be applied to all occurrences (the patchers use `replaceAll`) |
| macOS requires **re-signing** | Editing bytes invalidates the existing signature; the patcher runs `codesign --force --sign -` (ad-hoc) automatically |

What this means for custom/peach variants: the historical orange border and
peach-themed header changed *component props* (code insertion), which requires
length changes. Those visual customizations are not reproducible in the
binary. The *functional* parts of each variant — visibility fix in Standard,
gate fix in Custom Peach — use same-length substitutions and do apply.

---

## After Updates

Updates overwrite patches. Re-apply after updating:

```bash
claude --version
node patch-thinking-v2.1.113-custom-peach.js
```

---

## Customization

For v2.1.112 and earlier (`cli.js` format), edit `-custom.js` patches to change styling:

- **Border styles:** `"single"`, `"double"`, `"round"`, `"bold"`
- **Colors:** `"#FFA500"` (orange), `"error"`, `"warning"`, `"suggestion"`

v2.1.113+ (binary format) does not support inline visual customization — only
same-length substitutions that don't change byte offsets are safe.

---

## Troubleshooting

**"Pattern not found" (v2.1.113+)**
- Verify `claude --version` matches the patch
- Run `file $(which claude)` — expect `Mach-O 64-bit executable arm64` for v2.1.113+
- If npm pulled a newer version than the patcher supports, check for an updated triplet

**Patched binary won't launch on macOS (`killed` / silent exit)**
- The patchers run `codesign --force --sign -` automatically. If it fails, re-run manually:
  `codesign --force --sign - $(which claude)`

**Thinking still collapsed after patching**
- Fully exit and restart Claude Code (not just close the terminal)
- For default-mode visibility you need the **custom-peach** variant (gate fix)

**Legacy cli.js still detected**
- If you have an older `~/.claude/local/` install, the patcher flags it — use the older matching patch file or remove the legacy install

---

## How It Works

The patch modifies three areas in Claude Code's minified JavaScript bundle
(whether loose `cli.js` or embedded inside the Bun SEA binary):

1. **API layer (v2.1.76+):** Disables the `"redact-thinking-2026-02-12"` beta header so the server sends full thinking content instead of empty redacted blocks
2. **Gate function (v2.1.30+):** e.g. `if(!D&&!$)return null` → `if(!1&&!1)return null` — allows thinking blocks through the rendering gate
3. **Display component:** `if(hideInTranscript)return null` → `if(0)return null` and `if(!(isTranscript||verbose))` → `if(!(1||1))` — always shows expanded thinking

Without the API layer patch (step 1), the server never sends thinking content regardless of rendering fixes.

For v2.1.113+ every substitution uses the same number of bytes as the original
so binary offsets and Mach-O section sizes stay intact; the patcher then
re-signs with an ad-hoc `codesign` on macOS.

See [CHANGELOG.md](CHANGELOG.md) for version-specific technical details.

---

## Files

```
patch-thinking-v2.1.113.js              # Latest standard (npm, binary)
patch-thinking-v2.1.113-custom.js       # Latest custom (npm, binary — no visual styling)
patch-thinking-v2.1.113-custom-peach.js # Latest custom-peach (npm, binary, recommended)
patch-thinking-v2.1.112.js              # Previous standard (npm, cli.js)
patch-thinking-v2.1.112-custom.js       # Previous custom (npm, cli.js)
patch-thinking-v2.1.112-custom-peach.js # Previous custom-peach (npm, cli.js)
patch-thinking-v2.1.90*.js              # v2.1.90 patches
patch-thinking-v2.1.81*.js              # v2.1.81 patches
patch-thinking-v2.1.76*.js              # v2.1.76 patches
patch-thinking-v*.js                    # Older versions
detect-identifiers.js                   # Find identifiers for new versions (cli.js inputs)
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

**Last updated:** 2026-04-17 · **Latest:** v2.1.113 (npm, binary)
