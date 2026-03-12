# Claude Code Thinking Patch — Technical Changelog

> **Note:** npm installation (`npm install -g @anthropic-ai/claude-code`) provides a patchable Node.js version.
> See: [NPM Installation](https://code.claude.com/docs/en/setup#npm-installation-deprecated)

This document tracks minified identifier changes between Claude Code versions.

---

## Identifier Reference

### v2.1.x Identifiers

| Version | Component | React | Box | Text | ThinkingContent | Gate | Install |
|---------|-----------|-------|-----|------|-----------------|------|---------|
| **v2.1.74** | `kv1` | `NY6` | `m` | `T` | `d_` | `TGY` | npm |
| v2.1.69 | `LN1` | `Ww6` | `B` | `T` | `zO` | `TcY` | npm |
| v2.1.63 | `qN1` | `$z6` | `m` | `T` | `GH` | `ZgY` | npm |
| v2.1.50 | `rT1` | `LY6` | `b` | `f` | `WO` | `jiY` | npm |
| v2.1.44 | `dW6` | `O91` | `I` | `f` | `SJ` | `fyY` | npm |
| v2.1.37 | `Mj6` | `y31` | `I` | `f` | `MJ` | `iGY` | npm |
| v2.1.32 | `Cj6` | `L31` | `I` | `f` | `$J` | `EPY` | npm |
| v2.1.30 | `FD6` | `A31` | `h` | `f` | `DJ` | `IMY` | npm |
| v2.1.19 | `oG1` | `VqA` | `I` | `f` | `qO` | — | npm |
| v2.1.4–v2.1.12 | `WkA` | `z9A` | `j` | `$` | `$D` | — | legacy |

v2.1.30+ has a gate function (IMY/EPY/iGY/fyY/jiY/ZgY/TcY/TGY) that controls whether thinking blocks render at all.
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

## v2.1.74 (npm)

**Function signature:**
```javascript
function kv1(A){let q=A6(11),{param:K,addMargin:Y,isTranscriptMode:z,verbose:_,hideInTranscript:w}=A,{thinking:O}=K,...
  if(!O)return null;
  if(H)return null;      // ← Patch changes to if(!1)
  if(!(z||_)){...}       // ← Patch changes to if(!1)
}
```

**Gate function (TGY):**
```javascript
case"thinking":{if(!D&&!w)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `kv1` | React: `NY6` | Box: `m` | Text: `T` | ThinkingContent: `d_`
- Gate: `TGY` | Keybind: `yq` | Hook: `A6`

**Notable changes from v2.1.69:**
- Component renamed: `LN1` → `kv1`
- React import: `Ww6` → `NY6`
- Box component: `B` → `m`
- ThinkingContent: `zO` → `d_`
- Gate function: `TcY` → `TGY`, conditional uses `if(!D&&!w)` (same 2-var pattern)
- Internal variables shuffled: verbose/hideInTranscript swapped `w`/`_`

---

## v2.1.69 (npm)

**Function signature:**
```javascript
function LN1(A){let q=K6(11),{param:K,addMargin:Y,isTranscriptMode:z,verbose:w,hideInTranscript:_}=A,{thinking:$}=K,...
  if(!$)return null;
  if(H)return null;      // ← Patch changes to if(!1)
  if(!(z||w)){...}       // ← Patch changes to if(!1)
}
```

**Gate function (TcY):**
```javascript
case"thinking":{if(!D&&!_)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `LN1` | React: `Ww6` | Box: `B` | Text: `T` | ThinkingContent: `zO`
- Gate: `TcY` | Keybind: `YK` | Hook: `K6`

**Notable changes from v2.1.63:**
- Component renamed: `qN1` → `LN1`
- React import: `$z6` → `Ww6`
- Box component: `m` → `B`
- ThinkingContent: `GH` → `zO`
- Gate function: `ZgY` → `TcY`, conditional uses `if(!D&&!_)` (same 2-var pattern)

---

## v2.1.63 (npm)

**Function signature:**
```javascript
function qN1(A){let q=w6(11),{param:K,addMargin:Y,isTranscriptMode:z,verbose:w,hideInTranscript:_}=A,{thinking:$}=K,...
  if(!$)return null;
  if(H)return null;      // ← Patch changes to if(!1)
  if(!(z||w)){...}       // ← Patch changes to if(!1)
}
```

**Gate function (ZgY):**
```javascript
case"thinking":{if(!X&&!_)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `qN1` | React: `$z6` | Box: `m` | Text: `T` | ThinkingContent: `GH`
- Gate: `ZgY` | Keybind: `MK` | Hook: `w6`

**Notable changes from v2.1.50:**
- Component function restructured: cache size reduced from 16 to 11
- Visibility check inlined: `if(!(z||w))` instead of `let X=z||w; if(!X)`
- Gate condition simplified: `if(!X&&!_)` (2 vars) instead of `if(!X&&!T&&!_)` (3 vars)

---

## v2.1.44 (npm)

**Function signature:**
```javascript
function dW6(A){let q=e(17),{param:K,addMargin:Y,isTranscriptMode:z,hideInTranscript:w}=A,{thinking:H}=K,...
  if(!H&&!J)return null;
  if(O)return null;  // ← Patch changes to if(!1)
  let j=z;
  if(!j){...}        // ← Patch changes to if(!1)
}
```

**Gate function (fyY):**
```javascript
case"thinking":{if(!D&&!Z)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `dW6` | React: `O91` | Box: `I` | Text: `f` | ThinkingContent: `SJ`
- Gate: `fyY` | Keybind: `fK` | Hook: `e`

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
| 2026-03-12 | **v2.1.74** | New identifiers (kv1/NY6/TGY), gate fix |
| 2026-03-04 | v2.1.69 | New identifiers (LN1/Ww6/TcY), gate fix |
| 2026-02-27 | v2.1.63 | New identifiers (qN1/$z6/ZgY), restructured component, gate fix |
| 2026-02-16 | v2.1.44 | New identifiers (dW6/O91/fyY), gate fix |
| 2026-02-07 | v2.1.37 | New identifiers (Mj6/y31/iGY), gate fix |
| 2026-02-05 | v2.1.32 | New identifiers (Cj6/L31/EPY), gate fix |
| 2026-02-03 | v2.1.30 | IMY gate fix, theme colors |
| 2026-01-26 | v2.1.19 | npm install support |
| 2026-01-17 | v2.1.12 | Multi-installation support |
| 2025-12-xx | v2.0.75 | Last v2.0.x release |
| 2024-12-14 | v2.0.11 | Initial release |

---

**Maintained by:** [@biostochastics](https://github.com/biostochastics)
