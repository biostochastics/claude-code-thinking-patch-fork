# Claude Code Thinking Patch — Technical Changelog

> ⚠️ **DEPRECATION NOTICE:** This project is deprecated for Claude Code v2.1.13 and later.
> Anthropic switched to a native Bun-compiled binary format, making JavaScript-based patches incompatible.
> **Last supported version: v2.1.12**

This document tracks the minified identifier changes between Claude Code versions that require patch updates.

## Table of Contents

- [Quick Reference: Identifier Table](#quick-reference-identifier-table)
- [Why Patches Break Between Versions](#why-patches-break-between-versions)
- [v2.1.x Changes](#v21x-changes)
- [v2.0.x Changes](#v20x-changes)
- [Pattern Detection Guide](#pattern-detection-guide)

---

## Quick Reference: Identifier Table

### v2.1.x Identifiers

| Version | Component | React | Box | Text | Wrapper | hideInTranscript |
|---------|-----------|-------|-----|------|---------|------------------|
| v2.1.12 | `WkA` | `z9A` | `j` | `$` | `$D` | `Z` |
| v2.1.11 | `WkA` | `z9A` | `j` | `$` | `$D` | `Z` |
| v2.1.9  | `WkA` | `z9A` | `j` | `$` | `$D` | `Z` |
| v2.1.7  | `WkA` | `z9A` | `j` | `$` | `$D` | `Z` |
| v2.1.5  | `WkA` | `z9A` | `j` | `$` | `$D` | `Z` |
| v2.1.4  | `WkA` | `z9A` | `j` | `$` | `$D` | `Z` |

**Note:** v2.1.x introduced `hideInTranscript` parameter and `verbose` mode. The function signature changed from earlier versions.

### v2.0.x Identifiers (Recent)

| Version | Component | React | Box | Text | Wrapper |
|---------|-----------|-------|-----|------|---------|
| v2.0.75 | `co2` | `Vs` | `T` | `C` | `T$` |
| v2.0.74 | `co2` | `Vs` | `T` | `C` | `T$` |
| v2.0.73 | `Gt2` | `Rs` | `T` | `C` | `tE` |
| v2.0.72 | `ws2` | `zs` | `T` | `C` | `pF` |
| v2.0.71 | `mn2` | `nr` | `T` | `z` | `fE` |
| v2.0.70 | `Rq2` | `Ba` | `T` | `z` | `C$` |
| v2.0.69 | `Rq2` | `Ba` | `T` | `z` | `C$` |

### v2.0.x Identifiers (Older)

<details>
<summary>Click to expand v2.0.61 and earlier</summary>

| Version | Component | React | Box | Text | Wrapper |
|---------|-----------|-------|-----|------|---------|
| v2.0.61 | `Aw2` | `Da` | `T` | `z` | `L$` |
| v2.0.60 | `Cw2` | `xa` | `T` | `z` | `M$` |
| v2.0.59 | `Sw2` | `xa` | `T` | `z` | `O$` |
| v2.0.58 | `Sw2` | `xa` | `T` | `z` | `O$` |
| v2.0.57 | `Zv2` | `xa` | `T` | `z` | `y$` |
| v2.0.56 | `Av2` | `_a` | `T` | `z` | `w$` |
| v2.0.55 | `Wu2` | `Ta` | `T` | `z` | `d$` |
| v2.0.54 | `Ku2` | `Ta` | `T` | `z` | `d$` |
| v2.0.53 | `Ku2` | `Ta` | `T` | `z` | `d$` |
| v2.0.52 | `du2` | `Oa` | `T` | `z` | `$$` |
| v2.0.50 | `at2` | `Ma` | `T` | `z` | `Z$` |
| v2.0.49 | `es2` | `xa` | `T` | `z` | `Y$` |
| v2.0.47 | `Yr2` | `Ca` | `T` | `z` | `Q$` |
| v2.0.46 | `Zr2` | `Ca` | `T` | `z` | `B$` |
| v2.0.45 | `lr2` | `Ea` | `T` | `z` | `_I` |
| v2.0.44 | `rr2` | `Da` | `T` | `z` | `TI` |
| v2.0.43 | `Fq2` | `xa` | `T` | `z` | `yI` |
| v2.0.42 | `Eq2` | `Ca` | `T` | `z` | `hI` |
| v2.0.37 | `Jn2` | `pa` | `T` | `z` | `qH` |

</details>

<details>
<summary>Click to expand v2.0.36 and earlier (legacy format)</summary>

| Version | Banner Fn | React Import | Creator | Component | Thinking Component |
|---------|-----------|--------------|---------|-----------|-------------------|
| v2.0.36 | `el2` | `fa` | `Aa` | `T`/`z` | `NH` |
| v2.0.35 | `Zk2` | `fa` | `Aa` | `T`/`z` | `CH` |
| v2.0.34 | `Zk2` | `fa` | `Aa` | `T`/`z` | `CH` |
| v2.0.33 | `Uk2` | `aa` | `ya` | `T`/`z` | `uH` |
| v2.0.32 | `Tk2` | `aa` | `ya` | `T`/`z` | `uH` |
| v2.0.31 | `Ck2` | `aa` | `ya` | `T`/`z` | `lH` |
| v2.0.30 | `Ck2` | `$a` | `ga` | `T`/`z` | `lH` |
| v2.0.29 | `kk2` | `$a` | `ga` | `T`/`z` | `oH` |
| v2.0.28 | `Fj2` | `Xa` | `da` | `T`/`z` | `eH` |
| v2.0.27 | `vj2` | `Wa` | `aa` | `T`/`z` | `YG` |
| v2.0.26 | `hj2` | `Va` | `$a` | `T`/`z` | `HG` |
| v2.0.24 | `Wi2` | `Ka` | `Ya` | `T`/`z` | `pG` |
| v2.0.23 | `Si2` | `Ja` | `Xa` | `T`/`z` | `lG` |
| v2.0.22 | `Ci2` | `Ha` | `Va` | `T`/`z` | `bG` |
| v2.0.21 | `wVB` | `DV1` | `XM` | `j`/`$` | `H8Q` |
| v2.0.19 | `aFB` | `BV1` | `ZM` | `j`/`$` | `NoB` |
| v2.0.17 | `dXB` | `kF1` | `sL` | `j`/`$` | `WaB` |
| v2.0.15 | `KYB` | `mX1` | `xL` | `j`/`$` | `FpB` |
| v2.0.14 | `pGB` | `TX1` | `TL` | `j`/`$` | `dlB` |
| v2.0.13 | `hGB` | `RX1` | `TL` | `j`/`$` | `xlB` |
| v2.0.11 | `er2` | `BY1` | `_E` | `S`/`E` | `SOB` |

</details>

---

## Why Patches Break Between Versions

When Claude Code is built, the JavaScript bundler minifies code by shortening variable and function names. Each build can assign **different short names** to the same functions:

```javascript
// v2.0.73
function Gt2({param:{thinking:A}...}) { ... Rs.default.createElement(...) }

// v2.0.74 (same logic, different names)
function co2({param:{thinking:A}...}) { ... Vs.default.createElement(...) }
```

This means patches using exact string matching must be updated for each version.

---

## v2.1.x Changes

### v2.1.4 → v2.1.12

The v2.1.x series introduced significant changes to the thinking component:

**New parameters:**
- `hideInTranscript: Z` — Controls visibility in transcript mode
- `verbose: G` — Controls verbose output mode

**Function signature (v2.1.x):**
```javascript
function WkA({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G,hideInTranscript:Z=!1}){
  let Y=S4("app:toggleTranscript","Global","ctrl+o");
  if(!A)return null;
  if(Z)return null;  // ← Patch changes to if(!1)
  if(!(B||G))return z9A.default.createElement(j,{marginTop:Q?1:0},
    z9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking (",Y," to expand)"));
  return z9A.default.createElement(j,{flexDirection:"column",gap:1,marginTop:Q?1:0,width:"100%"},
    z9A.default.createElement($,{dimColor:!0,italic:!0},"∴ Thinking…"),
    z9A.default.createElement(j,{paddingLeft:2},z9A.default.createElement($D,null,A)))
}
```

**Patch modifications:**
1. `if(Z)return null` → `if(!1)return null` (disable hideInTranscript)
2. `if(!(B||G))return...` → `if(!1)return...` (always show full content)

**Identifiers stable across v2.1.4–v2.1.12:**
- Component: `WkA`
- React: `z9A`
- Box: `j`
- Text: `$`
- Wrapper: `$D`

---

## v2.0.x Changes

### v2.0.74 → v2.0.75

**No changes** — Identical identifiers.

### v2.0.73 → v2.0.74

| Identifier | v2.0.73 | v2.0.74 |
|------------|---------|---------|
| Component | `Gt2` | `co2` |
| React | `Rs` | `Vs` |
| Wrapper | `tE` | `T$` |

### v2.0.72 → v2.0.73

| Identifier | v2.0.72 | v2.0.73 |
|------------|---------|---------|
| Component | `ws2` | `Gt2` |
| React | `zs` | `Rs` |
| Wrapper | `pF` | `tE` |

### v2.0.71 → v2.0.72

| Identifier | v2.0.71 | v2.0.72 |
|------------|---------|---------|
| Component | `mn2` | `ws2` |
| React | `nr` | `zs` |
| Text | `z` | `C` |
| Wrapper | `fE` | `pF` |

### v2.0.70 → v2.0.71

| Identifier | v2.0.70 | v2.0.71 |
|------------|---------|---------|
| Component | `Rq2` | `mn2` |
| React | `Ba` | `nr` |
| Wrapper | `C$` | `fE` |

### v2.0.69 → v2.0.70

**No changes** — Identical identifiers.

<details>
<summary>Click to expand older v2.0.x changes</summary>

### v2.0.61 → v2.0.69

| Identifier | v2.0.61 | v2.0.69 |
|------------|---------|---------|
| Component | `Aw2` | `Rq2` |
| React | `Da` | `Ba` |
| Wrapper | `L$` | `C$` |

### v2.0.60 → v2.0.61

| Identifier | v2.0.60 | v2.0.61 |
|------------|---------|---------|
| Component | `Cw2` | `Aw2` |
| React | `xa` | `Da` |
| Wrapper | `M$` | `L$` |

### v2.0.59 → v2.0.60

| Identifier | v2.0.59 | v2.0.60 |
|------------|---------|---------|
| Component | `Sw2` | `Cw2` |
| Wrapper | `O$` | `M$` |

### v2.0.58 → v2.0.59

**No changes** — Identical identifiers.

### v2.0.57 → v2.0.58

| Identifier | v2.0.57 | v2.0.58 |
|------------|---------|---------|
| Component | `Zv2` | `Sw2` |
| Wrapper | `y$` | `O$` |

### v2.0.56 → v2.0.57

| Identifier | v2.0.56 | v2.0.57 |
|------------|---------|---------|
| Component | `Av2` | `Zv2` |
| React | `_a` | `xa` |
| Wrapper | `w$` | `y$` |

### v2.0.55 → v2.0.56

| Identifier | v2.0.55 | v2.0.56 |
|------------|---------|---------|
| Component | `Wu2` | `Av2` |
| React | `Ta` | `_a` |
| Wrapper | `d$` | `w$` |

### v2.0.54 → v2.0.55

| Identifier | v2.0.54 | v2.0.55 |
|------------|---------|---------|
| Component | `Ku2` | `Wu2` |

### v2.0.53 → v2.0.54

**No changes** — Identical identifiers.

### v2.0.52 → v2.0.53

| Identifier | v2.0.52 | v2.0.53 |
|------------|---------|---------|
| Component | `du2` | `Ku2` |
| React | `Oa` | `Ta` |
| Wrapper | `$$` | `d$` |

### v2.0.50 → v2.0.52

| Identifier | v2.0.50 | v2.0.52 |
|------------|---------|---------|
| Component | `at2` | `du2` |
| React | `Ma` | `Oa` |
| Wrapper | `Z$` | `$$` |

### v2.0.49 → v2.0.50

| Identifier | v2.0.49 | v2.0.50 |
|------------|---------|---------|
| Component | `es2` | `at2` |
| React | `xa` | `Ma` |
| Wrapper | `Y$` | `Z$` |

### v2.0.47 → v2.0.49

| Identifier | v2.0.47 | v2.0.49 |
|------------|---------|---------|
| Component | `Yr2` | `es2` |
| React | `Ca` | `xa` |
| Wrapper | `Q$` | `Y$` |

### v2.0.46 → v2.0.47

| Identifier | v2.0.46 | v2.0.47 |
|------------|---------|---------|
| Component | `Zr2` | `Yr2` |
| Wrapper | `B$` | `Q$` |

### v2.0.45 → v2.0.46

| Identifier | v2.0.45 | v2.0.46 |
|------------|---------|---------|
| Component | `lr2` | `Zr2` |
| React | `Ea` | `Ca` |
| Wrapper | `_I` | `B$` |

### v2.0.44 → v2.0.45

| Identifier | v2.0.44 | v2.0.45 |
|------------|---------|---------|
| Component | `rr2` | `lr2` |
| React | `Da` | `Ea` |
| Wrapper | `TI` | `_I` |

### v2.0.43 → v2.0.44

| Identifier | v2.0.43 | v2.0.44 |
|------------|---------|---------|
| Component | `Fq2` | `rr2` |
| React | `xa` | `Da` |
| Wrapper | `yI` | `TI` |

### v2.0.42 → v2.0.43

| Identifier | v2.0.42 | v2.0.43 |
|------------|---------|---------|
| Component | `Eq2` | `Fq2` |
| React | `Ca` | `xa` |
| Wrapper | `hI` | `yI` |

### v2.0.37 → v2.0.42

| Identifier | v2.0.37 | v2.0.42 |
|------------|---------|---------|
| Component | `Jn2` | `Eq2` |
| React | `pa` | `Ca` |
| Wrapper | `qH` | `hI` |

### v2.0.36 → v2.0.37

Major refactor — component structure changed.

| Identifier | v2.0.36 | v2.0.37 |
|------------|---------|---------|
| Component | `el2` | `Jn2` |
| React | `fa` | `pa` |
| Wrapper | `NH` | `qH` |

### v2.0.35 → v2.0.36

| Identifier | v2.0.35 | v2.0.36 |
|------------|---------|---------|
| Component | `Zk2` | `el2` |
| Wrapper | `CH` | `NH` |

### v2.0.34 → v2.0.35

**No changes** — Identical identifiers.

### v2.0.33 → v2.0.34

| Identifier | v2.0.33 | v2.0.34 |
|------------|---------|---------|
| Component | `Uk2` | `Zk2` |
| React | `aa` | `fa` |
| Creator | `ya` | `Aa` |
| Wrapper | `uH` | `CH` |

### v2.0.32 → v2.0.33

| Identifier | v2.0.32 | v2.0.33 |
|------------|---------|---------|
| Component | `Tk2` | `Uk2` |

### v2.0.31 → v2.0.32

| Identifier | v2.0.31 | v2.0.32 |
|------------|---------|---------|
| Component | `Ck2` | `Tk2` |
| Wrapper | `lH` | `uH` |

### v2.0.30 → v2.0.31

| Identifier | v2.0.30 | v2.0.31 |
|------------|---------|---------|
| React | `$a` | `aa` |
| Creator | `ga` | `ya` |

### v2.0.29 → v2.0.30

| Identifier | v2.0.29 | v2.0.30 |
|------------|---------|---------|
| Component | `kk2` | `Ck2` |
| Wrapper | `oH` | `lH` |

### v2.0.28 → v2.0.29

| Identifier | v2.0.28 | v2.0.29 |
|------------|---------|---------|
| Component | `Fj2` | `kk2` |
| React | `Xa` | `$a` |
| Creator | `da` | `ga` |
| Wrapper | `eH` | `oH` |

### v2.0.27 → v2.0.28

| Identifier | v2.0.27 | v2.0.28 |
|------------|---------|---------|
| Component | `vj2` | `Fj2` |
| React | `Wa` | `Xa` |
| Creator | `aa` | `da` |
| Wrapper | `YG` | `eH` |

### v2.0.26 → v2.0.27

| Identifier | v2.0.26 | v2.0.27 |
|------------|---------|---------|
| Component | `hj2` | `vj2` |
| React | `Va` | `Wa` |
| Creator | `$a` | `aa` |
| Wrapper | `HG` | `YG` |

### v2.0.24 → v2.0.26

| Identifier | v2.0.24 | v2.0.26 |
|------------|---------|---------|
| Component | `Wi2` | `hj2` |
| React | `Ka` | `Va` |
| Creator | `Ya` | `$a` |
| Wrapper | `pG` | `HG` |

### v2.0.23 → v2.0.24

| Identifier | v2.0.23 | v2.0.24 |
|------------|---------|---------|
| Component | `Si2` | `Wi2` |
| React | `Ja` | `Ka` |
| Creator | `Xa` | `Ya` |
| Wrapper | `lG` | `pG` |

### v2.0.22 → v2.0.23

| Identifier | v2.0.22 | v2.0.23 |
|------------|---------|---------|
| Component | `Ci2` | `Si2` |
| React | `Ha` | `Ja` |
| Creator | `Va` | `Xa` |
| Wrapper | `bG` | `lG` |

### v2.0.21 → v2.0.22

Major refactor — identifier naming scheme changed.

| Identifier | v2.0.21 | v2.0.22 |
|------------|---------|---------|
| Component | `wVB` → `Ci2` |
| React | `DV1` → `Ha` |
| Box/Text | `j`/`$` → `T`/`z` |

### v2.0.19 → v2.0.21

| Identifier | v2.0.19 | v2.0.21 |
|------------|---------|---------|
| Banner | `aFB` | `wVB` |
| React | `BV1` | `DV1` |
| Component | `NoB` | `H8Q` |

### v2.0.17 → v2.0.19

| Identifier | v2.0.17 | v2.0.19 |
|------------|---------|---------|
| Banner | `dXB` | `aFB` |
| React | `kF1` | `BV1` |
| Component | `WaB` | `NoB` |

### v2.0.15 → v2.0.17

| Identifier | v2.0.15 | v2.0.17 |
|------------|---------|---------|
| Banner | `KYB` | `dXB` |
| React | `mX1` | `kF1` |
| Component | `FpB` | `WaB` |

### v2.0.14 → v2.0.15

| Identifier | v2.0.14 | v2.0.15 |
|------------|---------|---------|
| Banner | `pGB` | `KYB` |
| React | `TX1` | `mX1` |
| Component | `dlB` | `FpB` |

### v2.0.13 → v2.0.14

| Identifier | v2.0.13 | v2.0.14 |
|------------|---------|---------|
| Banner | `hGB` | `pGB` |
| Component | `xlB` | `dlB` |

### v2.0.11 → v2.0.13

| Identifier | v2.0.11 | v2.0.13 |
|------------|---------|---------|
| Banner | `er2` | `hGB` |
| React | `BY1` | `RX1` |
| Creator | `_E` | `TL` |
| Box/Text | `S`/`E` | `j`/`$` |
| Component | `SOB` | `xlB` |

</details>

---

## Pattern Detection Guide

### Using the Universal Detector

The easiest way to find identifiers for any version:

```bash
node detect-identifiers.js
```

This automatically detects all required identifiers.

### Manual Pattern Detection

If the detector fails, search for these distinctive strings:

**Find the thinking component (v2.1.x):**
```bash
grep -o 'function [A-Za-z0-9_]*({param:{thinking:A},addMargin:[^}]*hideInTranscript[^}]*}' \
  ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js
```

**Find the thinking component (v2.0.x):**
```bash
grep -o 'function [A-Za-z0-9]*({param:{thinking:A},addMargin:[^}]*isTranscriptMode[^}]*}' \
  ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js
```

**Find by distinctive strings:**
- `"∴ Thinking…"` — Thinking indicator
- `"∴ Thinking ("` — Collapsed state with hotkey
- `"ctrl+o"` — Keyboard shortcut reference
- `hideInTranscript` — v2.1.x visibility control
- `isTranscriptMode` — v2.0.x visibility control

---

## Binary Format Analysis (v2.1.13+)

Starting with v2.1.13, Claude Code switched from Node.js to a native Bun-compiled binary.

### v2.1.19 Binary Analysis

The binary at `~/.local/bin/claude` is a 180MB Mach-O arm64 executable containing embedded JavaScript.

**Detected identifiers (via `strings` extraction):**

| Component | Identifier |
|-----------|------------|
| Thinking function | `oZR` |
| React import (thinking) | `B7T` |
| Keybind lookup | `r0` |
| Box component | `z` |
| Text component | `Z` |
| ThinkingContent | `QW` |
| React import (hooks) | `UB` |
| Text component (hooks) | `kG` |

**Thinking function signature:**
```javascript
function oZR({param:{thinking:T},addMargin:R=!1,isTranscriptMode:A,verbose:_,hideInTranscript:B=!1}){
  let D=r0("app:toggleTranscript","Global","ctrl+o"),H=!1;
  if(!T)return null;
  if(B)return null;
  let $=A||_,C="\u2234 Thinking";
  // ... rest of function
}
```

**Why patching fails:**
1. Binary requires same-length string replacements
2. Adding cyan hooks (`{color:"cyan"}`) adds 10 bytes per replacement — no room in binary
3. Custom styling (peach emoji, orange border) requires even more bytes
4. macOS code signing may reject modified binaries

---

## Version History

| Date | Version | Notes |
|------|---------|-------|
| 2026-01-26 | v2.1.13+ | **DEPRECATED** — Native binary format, patches incompatible |
| 2026-01-17 | v2.1.12 | Multi-installation support, caveats documentation |
| 2026-01-16 | v2.1.11 | Hook highlighting patches added |
| 2026-01-15 | v2.1.9 | Stable v2.1.x identifiers confirmed |
| 2025-12-xx | v2.0.75 | Last v2.0.x release |
| 2025-10-17 | v2.0.21 | Major identifier refactor |
| 2025-01-14 | v2.0.15 | Custom styling patches introduced |
| 2024-12-15 | v2.0.13 | Dynamic username detection |
| 2024-12-14 | v2.0.11 | Initial release |

---

**Maintained by:** [@biostochastics](https://github.com/biostochastics)
