# Claude Code Thinking Patch — Technical Changelog

> **Note:** npm installation (`npm install -g @anthropic-ai/claude-code`) provides a patchable Node.js version.
> See: [NPM Installation](https://code.claude.com/docs/en/setup#npm-installation-deprecated)

This document tracks minified identifier changes between Claude Code versions.

---

## Identifier Reference

### v2.1.x Identifiers

| Version | Component | React | Box | Text | Wrapper | hideInTranscript | Install |
|---------|-----------|-------|-----|------|---------|------------------|---------|
| **v2.1.19** | `oG1` | `VqA` | `I` | `f` | `qO` | `O` | npm |
| v2.1.4–v2.1.12 | `WkA` | `z9A` | `j` | `$` | `$D` | `Z` | legacy |

v2.1.19 (npm) uses different identifiers due to different build process.

### v2.0.x Identifiers

<details>
<summary>Click to expand v2.0.x identifiers</summary>

| Version | Component | React | Box | Text | Wrapper |
|---------|-----------|-------|-----|------|---------|
| v2.0.74–75 | `co2` | `Vs` | `T` | `C` | `T$` |
| v2.0.73 | `Gt2` | `Rs` | `T` | `C` | `tE` |
| v2.0.72 | `ws2` | `zs` | `T` | `C` | `pF` |
| v2.0.71 | `mn2` | `nr` | `T` | `z` | `fE` |
| v2.0.69–70 | `Rq2` | `Ba` | `T` | `z` | `C$` |
| v2.0.61 | `Aw2` | `Da` | `T` | `z` | `L$` |

Earlier versions available in repository history.

</details>

---

## Why Patches Break

Each build minifies code with different short names:

```javascript
// v2.0.73
function Gt2({param:{thinking:A}...}) { ... Rs.default.createElement(...) }

// v2.0.74 (same logic, different names)
function co2({param:{thinking:A}...}) { ... Vs.default.createElement(...) }
```

Patches using exact string matching must be updated for each version.

---

## v2.1.19 (npm)

**Function signature:**
```javascript
function oG1(A){let K=a(17),{param:q,addMargin:Y,isTranscriptMode:z,verbose:w,hideInTranscript:H}=A,{thinking:J}=q,...
  if(!J&&!_)return null;
  if(O)return null;  // ← Patch changes to if(!1)
  let G=z||w;
  if(!G){...}        // ← Patch changes to if(!1)
}
```

**Key identifiers:**
- Component: `oG1` | React: `VqA` | Box: `I` | Text: `f` | ThinkingContent: `qO`

---

## v2.1.4–v2.1.12 (legacy)

**Function signature:**
```javascript
function WkA({param:{thinking:A},addMargin:Q=!1,isTranscriptMode:B,verbose:G,hideInTranscript:Z=!1}){
  if(!A)return null;
  if(Z)return null;     // ← Patch changes to if(!1)
  if(!(B||G))return...; // ← Patch changes to if(!1)
}
```

**Key identifiers:**
- Component: `WkA` | React: `z9A` | Box: `j` | Text: `$` | Wrapper: `$D`

---

## Pattern Detection

Run the detector script:

```bash
node detect-identifiers.js
```

Or search manually:

```bash
# v2.1.x pattern
grep -o 'function [A-Za-z0-9_]*({param:{thinking:A},addMargin:[^}]*hideInTranscript' cli.js

# Find by distinctive strings
grep '"∴ Thinking"' cli.js
grep 'hideInTranscript' cli.js
```

---

## Version History

| Date | Version | Notes |
|------|---------|-------|
| 2026-01-26 | **v2.1.19** | npm install support |
| 2026-01-17 | v2.1.12 | Multi-installation support |
| 2025-12-xx | v2.0.75 | Last v2.0.x release |
| 2024-12-14 | v2.0.11 | Initial release |

---

**Maintained by:** [@biostochastics](https://github.com/biostochastics)
