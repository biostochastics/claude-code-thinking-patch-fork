# Claude Code Thinking Patch — Technical Changelog

> **Note:** npm installation (`npm install -g @anthropic-ai/claude-code`) provides a patchable Node.js version.
> See: [NPM Installation](https://code.claude.com/docs/en/setup#npm-installation-deprecated)

This document tracks minified identifier changes between Claude Code versions.

---

## Identifier Reference

### v2.1.x Identifiers

| Version | Component | React | Box | Text | ThinkingContent | Gate | Install |
|---------|-----------|-------|-----|------|-----------------|------|---------|
| **v2.1.90** | `AI8` | `bK6` | `u` | `T` | `DA` | `Udz` | npm |
| v2.1.89 | `Wx8` | `DK6` | `m` | `T` | `HA` | `EQz` | npm |
| v2.1.85 | `Xb8` | `Zq6` | `B` | `T` | `Q$` | `Tpz` | npm |
| v2.1.81 | `rE8` | `A16` | `B` | `T` | `zw` | `ty_` | npm |
| v2.1.76 | `_N1` | `lY6` | `m` | `T` | `U_` | `oTY` | npm |
| v2.1.74 | `kv1` | `NY6` | `m` | `T` | `d_` | `TGY` | npm |
| v2.1.69 | `LN1` | `Ww6` | `B` | `T` | `zO` | `TcY` | npm |
| v2.1.63 | `qN1` | `$z6` | `m` | `T` | `GH` | `ZgY` | npm |
| v2.1.50 | `rT1` | `LY6` | `b` | `f` | `WO` | `jiY` | npm |
| v2.1.44 | `dW6` | `O91` | `I` | `f` | `SJ` | `fyY` | npm |
| v2.1.37 | `Mj6` | `y31` | `I` | `f` | `MJ` | `iGY` | npm |
| v2.1.32 | `Cj6` | `L31` | `I` | `f` | `$J` | `EPY` | npm |
| v2.1.30 | `FD6` | `A31` | `h` | `f` | `DJ` | `IMY` | npm |
| v2.1.19 | `oG1` | `VqA` | `I` | `f` | `qO` | — | npm |
| v2.1.4–v2.1.12 | `WkA` | `z9A` | `j` | `$` | `$D` | — | legacy |

v2.1.30+ has a gate function (IMY/EPY/iGY/fyY/jiY/ZgY/TcY/TGY/oTY/ty_/Tpz/EQz/Udz) that controls whether thinking blocks render at all.
v2.1.76+ has server-side thinking redaction via the `"redact-thinking-2026-02-12"` beta header — all patches must disable this.
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

## v2.1.90 (npm)

**Standard identifier rotation — no structural changes from v2.1.89.**

v2.1.90 continues the same architecture: keybind display in a separate sub-component,
9 cache slots, and server-side thinking redaction that must be disabled.
Gate function variables unchanged from v2.1.89 (`if(!X&&!O)`).

**Redact-thinking beta header:**
```javascript
// In beta header builder function:
if(Y&&Qbq(q)&&!F7()&&T7().showThinkingSummaries!==!0)K.push(sM8);
// sM8 = "redact-thinking-2026-02-12"
// ← Patch changes condition to if(!1) to prevent redaction
```

**Function signature:**
```javascript
function AI8(q){let K=Y6(9),{param:_,addMargin:z,isTranscriptMode:Y,verbose:$,hideInTranscript:O}=q,{thinking:A}=_,...
  if(!A)return null;
  if(j)return null;      // ← Patch changes to if(!1)
  if(!(Y||$)){...}       // ← Patch changes to if(!1)
}
```

**Gate function (Udz):**
```javascript
case"thinking":{if(!X&&!O)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `AI8` | React: `bK6` | Box: `u` | Text: `T` | ThinkingContent: `DA`
- Gate: `Udz` | Keybind: `X2` (sub-component) | Hook: `Y6`
- Redact header: `sM8` = `"redact-thinking-2026-02-12"`

**Notable changes from v2.1.89:**
- Component renamed: `Wx8` → `AI8`
- React import: `DK6` → `bK6`
- Box changed: `m` → `u`
- ThinkingContent: `HA` → `DA`
- Gate function: `EQz` → `Udz`, conditional unchanged `if(!X&&!O)`
- Cache hook: `$6(9)` → `Y6(9)` — same 9 slots
- Keybind sub-component: `z2` → `X2`
- Redact header constant: `WM8` → `sM8`
- Redact conditional changed: `iCq` → `Qbq`, `g7` → `F7`, `Z7` → `T7`
- Text (`T`) unchanged

---

## v2.1.89 (npm)

**Standard identifier rotation — no structural changes from v2.1.85.**

v2.1.89 continues the same architecture: keybind display in a separate sub-component,
9 cache slots, and server-side thinking redaction that must be disabled.
Notable: the redact-thinking conditional dropped the `tengu_quiet_hollow` feature flag check.
Gate function no longer ends in `Y`.

**Redact-thinking beta header:**
```javascript
// In beta header builder function:
if(Y&&iCq(q)&&!g7()&&Z7().showThinkingSummaries!==!0)K.push(WM8);
// WM8 = "redact-thinking-2026-02-12"
// ← Patch changes condition to if(!1) to prevent redaction
```

**Function signature:**
```javascript
function Wx8(q){let K=$6(9),{param:_,addMargin:z,isTranscriptMode:Y,verbose:$,hideInTranscript:O}=q,{thinking:A}=_,...
  if(!A)return null;
  if(j)return null;      // ← Patch changes to if(!1)
  if(!(Y||$)){...}       // ← Patch changes to if(!1)
}
```

**Gate function (EQz):**
```javascript
case"thinking":{if(!X&&!O)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `Wx8` | React: `DK6` | Box: `m` | Text: `T` | ThinkingContent: `HA`
- Gate: `EQz` | Keybind: `z2` (sub-component) | Hook: `$6`
- Redact header: `WM8` = `"redact-thinking-2026-02-12"`

**Notable changes from v2.1.85:**
- Component renamed: `Xb8` → `Wx8`
- React import: `Zq6` → `DK6`
- ThinkingContent: `Q$` → `HA`
- Gate function: `Tpz` → `EQz` (no longer ends in `Y`), conditional uses `if(!X&&!O)`
- Cache hook: `A6(9)` → `$6(9)` — same 9 slots
- Keybind sub-component: `vj` → `z2`
- Box changed: `B` → `m` | Text (`T`) unchanged
- Redact-thinking: dropped `&&g8("tengu_quiet_hollow",!1)` check

---

## v2.1.85 (npm)

**Standard identifier rotation — no structural changes from v2.1.81.**

v2.1.85 continues the same architecture as v2.1.81: keybind display in a separate sub-component,
9 cache slots, and server-side thinking redaction that must be disabled.

**Redact-thinking beta header:**
```javascript
// In beta header builder function:
if(Y&&eF4(q)&&!p7()&&W7().showThinkingSummaries!==!0&&g8("tengu_quiet_hollow",!1))K.push(kU7);
// kU7 = "redact-thinking-2026-02-12"
// ← Patch changes condition to if(!1) to prevent redaction
```

**Function signature:**
```javascript
function Xb8(q){let K=A6(9),{param:_,addMargin:z,isTranscriptMode:Y,verbose:$,hideInTranscript:A}=q,{thinking:O}=_,...
  if(!O)return null;
  if(j)return null;      // ← Patch changes to if(!1)
  if(!(Y||$)){...}       // ← Patch changes to if(!1)
}
```

**Gate function (Tpz):**
```javascript
case"thinking":{if(!M&&!A)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `Xb8` | React: `Zq6` | Box: `B` | Text: `T` | ThinkingContent: `Q$`
- Gate: `Tpz` | Keybind: `vj` (sub-component) | Hook: `A6`
- Redact header: `kU7` = `"redact-thinking-2026-02-12"`

**Notable changes from v2.1.81:**
- Component renamed: `rE8` → `Xb8`
- React import: `A16` → `Zq6`
- ThinkingContent: `zw` → `Q$`
- Gate function: `ty_` → `Tpz`, conditional uses `if(!M&&!A)` (different var names)
- Cache hook: `z6(9)` → `A6(9)` — same 9 slots
- Keybind sub-component: `E$` → `vj`
- Box (`B`) and Text (`T`) unchanged

---

## v2.1.81 (npm)

**Structural change: keybind display extracted to sub-component.**

v2.1.81 refactored the thinking component — the keybind helper (`SK` / `"app:toggleTranscript"`)
has been moved to a separate `E$` sub-component, reducing cache slots from 11 to 9.
Server-side thinking redaction (introduced in v2.1.76) is still present and must be disabled.

**Redact-thinking beta header:**
```javascript
// In beta header builder function:
if(Y&&RC7(A)&&!K7()&&kA().showThinkingSummaries!==!0&&l8("tengu_quiet_hollow",!1))q.push(nIA);
// nIA = "redact-thinking-2026-02-12"
// ← Patch changes condition to if(!1) to prevent redaction
```

**Function signature:**
```javascript
function rE8(A){let q=z6(9),{param:K,addMargin:_,isTranscriptMode:Y,verbose:z,hideInTranscript:w}=A,{thinking:O}=K,...
  if(!O)return null;
  if(H)return null;      // ← Patch changes to if(!1)
  if(!(Y||z)){...}       // ← Patch changes to if(!1)
}
```

**Gate function (ty_):**
```javascript
case"thinking":{if(!X&&!w)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `rE8` | React: `A16` | Box: `B` | Text: `T` | ThinkingContent: `zw`
- Gate: `ty_` | Keybind: `SK` (in `E$`) | Hook: `z6`
- Redact header: `nIA` = `"redact-thinking-2026-02-12"`

**Notable changes from v2.1.76:**
- Component renamed: `_N1` → `rE8`
- React import: `lY6` → `A16`
- Box: `m` → `B`
- ThinkingContent: `U_` → `zw`
- Gate function: `oTY` → `ty_`, conditional uses `if(!X&&!w)` (different var names)
- Cache hook: `A6(11)` → `z6(9)` — reduced from 11 to 9 slots
- Keybind helper: `Rq` → `SK`, moved to separate `E$` sub-component
- Text (`T`) unchanged

---

## v2.1.76 (npm)

**BREAKING: Server-side thinking redaction introduced.**

v2.1.76 added a new `"redact-thinking-2026-02-12"` API beta header that tells the server
to return `redacted_thinking` blocks (empty) instead of `thinking` blocks (with content).
This header is sent by default unless `showThinkingSummaries` is `true` in settings.
**All patches must now disable this header** in addition to the rendering fixes, or thinking
content will never be received from the API.

**Redact-thinking beta header:**
```javascript
// In beta header builder function (memoized via e1):
if(z&&Bvq(A)&&!q7()&&mA().showThinkingSummaries!==!0&&w8("tengu_quiet_hollow",!1))q.push(wLA);
// wLA = "redact-thinking-2026-02-12"
// ← Patch changes condition to if(!1) to prevent redaction
```

**Function signature:**
```javascript
function _N1(A){let q=A6(11),{param:K,addMargin:Y,isTranscriptMode:z,verbose:_,hideInTranscript:w}=A,{thinking:O}=K,...
  if(!O)return null;
  if(H)return null;      // ← Patch changes to if(!1)
  if(!(z||_)){...}       // ← Patch changes to if(!1)
}
```

**Gate function (oTY):**
```javascript
case"thinking":{if(!D&&!w)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `_N1` | React: `lY6` | Box: `m` | Text: `T` | ThinkingContent: `U_`
- Gate: `oTY` | Keybind: `Rq` | Hook: `A6`
- Redact header: `wLA` = `"redact-thinking-2026-02-12"`

**Notable changes from v2.1.74:**
- **NEW**: Server-side thinking redaction via `"redact-thinking-2026-02-12"` beta header
- Component renamed: `kv1` → `_N1`
- React import: `NY6` → `lY6`
- ThinkingContent: `d_` → `U_`
- Gate function: `TGY` → `oTY`, conditional uses `if(!D&&!w)` (same 2-var pattern)
- Keybind helper: `yq` → `Rq`
- Local vars inside collapsed block shuffled: `f,Z,G` → `Z,G,f`
- Box (`m`), Text (`T`), Cache (`A6`) unchanged

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
| 2026-04-02 | **v2.1.90** | New identifiers (AI8/bK6/Udz), gate fix |
| 2026-03-14 | v2.1.76 | New identifiers (_N1/lY6/oTY), gate fix |
| 2026-03-12 | v2.1.74 | New identifiers (kv1/NY6/TGY), gate fix |
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
