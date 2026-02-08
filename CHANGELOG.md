# Claude Code Thinking Patch — Technical Changelog

> **Note:** npm installation (`npm install -g @anthropic-ai/claude-code`) provides a patchable Node.js version.
> See: [NPM Installation](https://code.claude.com/docs/en/setup#npm-installation-deprecated)

This document tracks minified identifier changes between Claude Code versions.

---

## Identifier Reference

### v2.1.x Identifiers

| Version | Component | React | Box | Text | ThinkingContent | Gate | Install |
|---------|-----------|-------|-----|------|-----------------|------|---------|
| **v2.1.37** | `Mj6` | `y31` | `I` | `f` | `MJ` | `iGY` | npm |
| v2.1.32 | `Cj6` | `L31` | `I` | `f` | `$J` | `EPY` | npm |
| v2.1.30 | `FD6` | `A31` | `h` | `f` | `DJ` | `IMY` | npm |
| v2.1.19 | `oG1` | `VqA` | `I` | `f` | `qO` | — | npm |
| v2.1.4–v2.1.12 | `WkA` | `z9A` | `j` | `$` | `$D` | — | legacy |

v2.1.30+ has a gate function (IMY/EPY/iGY) that controls whether thinking blocks render at all.
The custom-peach patch includes gate fixes; standard/custom patches only modify the display component.

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

## v2.1.37 (npm)

**Function signature:**
```javascript
function Mj6(A){let q=A1(17),{param:K,addMargin:Y,isTranscriptMode:z,hideInTranscript:w}=A,{thinking:H}=K,...
  if(!H&&!J)return null;
  if(O)return null;  // ← Patch changes to if(!1)
  let D=z;
  if(!D){...}        // ← Patch changes to if(!1)
}
```

**Gate function (iGY):**
```javascript
case"thinking":{if(!j&&!Z)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `Mj6` | React: `y31` | Box: `I` | Text: `f` | ThinkingContent: `MJ`
- Gate: `iGY` | Keybind: `LK` | Hook: `A1`

---

## v2.1.32 (npm)

**Function signature:**
```javascript
function Cj6(A){let q=A1(17),{param:K,addMargin:Y,isTranscriptMode:z,hideInTranscript:w}=A,{thinking:H}=K,...
  if(!H&&!J)return null;
  if($)return null;  // ← Patch changes to if(!1)
  let D=z;
  if(!D){...}        // ← Patch changes to if(!1)
}
```

**Gate function (EPY):**
```javascript
case"thinking":{if(!j&&!Z)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `Cj6` | React: `L31` | Box: `I` | Text: `f` | ThinkingContent: `$J`
- Gate: `EPY` | Keybind: `kK` | Hook: `A1`

---

## v2.1.30 (npm)

**Function signature:**
```javascript
function FD6(A){let q=t(17),{param:K,addMargin:Y,isTranscriptMode:z,hideInTranscript:w}=A,{thinking:H}=K,...
  if($)return null;  // ← Patch changes to if(!1)
  if(!D){...}        // ← Patch changes to if(!1)
}
```

**Gate function (IMY):**
```javascript
case"thinking":{if(!j&&!V)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `FD6` | React: `A31` | Box: `h` | Text: `f` | ThinkingContent: `DJ`
- Gate: `IMY` | Keybind: `pq`

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
| 2026-02-07 | **v2.1.37** | New identifiers (Mj6/y31/iGY), gate fix |
| 2026-02-05 | v2.1.32 | New identifiers (Cj6/L31/EPY), gate fix |
| 2026-02-03 | v2.1.30 | IMY gate fix, theme colors |
| 2026-01-26 | v2.1.19 | npm install support |
| 2026-01-17 | v2.1.12 | Multi-installation support |
| 2025-12-xx | v2.0.75 | Last v2.0.x release |
| 2024-12-14 | v2.0.11 | Initial release |

---

**Maintained by:** [@biostochastics](https://github.com/biostochastics)
