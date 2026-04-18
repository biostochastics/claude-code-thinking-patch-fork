# Claude Code Thinking Patch — Technical Changelog

> **v2.1.113 format change:** npm now ships a native Bun SEA binary
> (`bin/claude.exe`) instead of a `cli.js`. Patching is done via same-length
> byte substitution in the binary + ad-hoc `codesign` on macOS.
> Older versions retain the `cli.js` text-replace approach.

This document tracks minified identifier changes between Claude Code versions.

---

## Identifier Reference

### v2.1.x Identifiers

| Version | Component | React | Box | Text | ThinkingContent | Gate | Install |
|---------|-----------|-------|-----|------|-----------------|------|---------|
| **v2.1.113** | `Yl_` | `g1H` | `m` | `L` | `SA` | `ni1` | npm (binary) |
| v2.1.112 | `cg8` | `R96` | `u` | `T` | `xw` | `wKY` | npm |
| v2.1.109 | `oF8` | `i36` | `u` | `T` | `kw` | `m7Y` | npm |
| v2.1.107 | `qU8` | `V96` | `u` | `v` | `Ew` | `d9Y` | npm |
| v2.1.104 | `Ng8` | `O96` | `u` | `V` | `S2` | `eOY` | npm |
| v2.1.90 | `AI8` | `bK6` | `u` | `T` | `DA` | `Udz` | npm |
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

v2.1.30+ has a gate function (IMY/EPY/iGY/fyY/jiY/ZgY/TcY/TGY/oTY/ty_/Tpz/EQz/Udz/eOY/d9Y/m7Y/wKY/ni1) that controls whether thinking blocks render at all.
v2.1.76+ has server-side thinking redaction via the `"redact-thinking-2026-02-12"` beta header — all patches must disable this.
The custom-peach patch includes gate fixes; standard/custom patches only modify the display component.
v2.1.113+ ships as a native Bun SEA binary instead of a `cli.js` — the patchers now use same-length byte substitutions and ad-hoc `codesign`. Visual customizations (orange border, peach theme) from older custom/custom-peach variants cannot be reproduced without relinking.

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

## v2.1.113 (npm, binary)

**BREAKING: npm now ships a native Bun SEA binary instead of a `cli.js`.**

The package installs a ~200 MB Mach-O binary (`bin/claude.exe`) containing a
bundled JS source inside a `__BUN` segment. The JS bundle is duplicated inside
the segment (two byte-identical copies offset 113,478,872 apart), so every
patch must be applied to all occurrences. Patches use **same-length byte
substitutions only** — any length change shifts Mach-O offsets and corrupts
the binary. On macOS the binary must be re-signed with an ad-hoc signature
(`codesign --force --sign -`) after patching or the loader rejects it.

**Redact-thinking beta header:**
```javascript
// In beta header builder function:
if(O&&Tmq(H)&&!I8()&&k8().showThinkingSummaries!==!0)_.push(v0_);
// v0_ = "redact-thinking-2026-02-12"
// ← Patch changes O to 0 (same length) so condition is always false
```

**Function signature:**
```javascript
function Yl_(H){let _=R_7.c(9),{param:q,addMargin:K,isTranscriptMode:O,verbose:T,hideInTranscript:$}=H,{thinking:A}=q,z=K===void 0?!1:K,w=$===void 0?!1:$;
  if(!A)return null;
  if(w)return null;      // ← Patch changes w -> 0 (same length) so always false
  if(!(O||T)){...}       // ← Patch changes (O||T) -> (1||1) so condition is always false
}
```

**Gate function (ni1):**
```javascript
case"redacted_thinking":{if(!D&&!$)return null;  // ← Custom-peach patch: !D&&!$ -> !1&&!1
case"thinking":{if(!D&&!$)return null;           // ← Custom-peach patch: same
```

**Key identifiers:**
- Component: `Yl_` | React: `g1H` | Box: `m` | Text: `L` | ThinkingContent: `SA`
- Gate: `ni1` | Spinner sub-component: `iz` | Cache hook: `R_7(9)` (9 slots)
- Gate's React: `S1` | Gate's cache: `Cl_(48)` | Redacted component: `gH7`
- Redact header var: `v0_` = `"redact-thinking-2026-02-12"`

**Notable changes from v2.1.112:**
- **Format**: `cli.js` (plaintext JS) → Mach-O binary (Bun SEA with embedded JS bundle)
- Install path: `~/.claude/local/.../cli.js` → `<npm-root>/@anthropic-ai/claude-code/bin/claude.exe`
- Component renamed: `cg8` → `Yl_`
- React import: `R96` → `g1H`
- Box: `u` → `m` | Text: `T` → `L` | ThinkingContent: `xw` → `SA`
- Gate: `wKY` → `ni1`, conditional variables renamed (`!M&&!O` → `!D&&!$`)
- Cache hook: `s(17)` → `R_7.c(9)` — inner component slots back down to 9
- Spinner sub-component: `U2` → `iz`
- Redact header variable: `pZ8` → `v0_`
- Redact conditional helpers: `ggq` → `Tmq`, `I7` → `I8`, `v7` → `k8`
- Patching technique: string replace in `.js` → same-length byte substitution in binary + `codesign`

---

## v2.1.112 (npm)

**Pure identifier rotation — no structural changes from v2.1.109.**

v2.1.112 preserves the v2.1.109 architecture exactly: 17-slot memo cache, same gate
conditional pattern (`if(!M&&!O)`), same redact-thinking header logic. Only the
minified short names changed.

**Function signature:**
```javascript
function cg8(q){let K=s(17),{param:_,addMargin:z,isTranscriptMode:Y,verbose:A,hideInTranscript:O}=q,{thinking:w}=_,...
  if(!w)return null;
  if(j)return null;      // ← Patch changes to if(!1)
  if(!(Y||A)){...}       // ← Patch changes to if(!1)
}
```

**Gate function (wKY):**
```javascript
case"thinking":{if(!M&&!O)return null;  // ← Custom-peach patch changes to if(!1)
case"redacted_thinking":{if(!M&&!O)return null;  // ← Same
```

**Key identifiers:**
- Component: `cg8` | React: `R96` | Box: `u` | Text: `T` | ThinkingContent: `xw`
- Gate: `wKY` | Spinner sub-component: `U2` | Cache hook: `s(17)`
- Redact header: `pZ8` = `"redact-thinking-2026-02-12"`

**Notable changes from v2.1.109:**
- Component renamed: `oF8` → `cg8`
- React import: `i36` → `R96`
- ThinkingContent: `kw` → `xw`
- Gate function: `m7Y` → `wKY`
- Spinner sub-component: `C2` → `U2`
- Redact header constant: `OZ8` → `pZ8`
- Redact conditional helpers: `rpq` → `ggq`, `m7` → `I7`, `D7` → `v7`
- Box (`u`), Text (`T`), cache hook (`s(17)`) unchanged
- Gate conditional pattern unchanged: `if(!M&&!O)return null`

---

## v2.1.109 (npm)

**Standard identifier rotation with cache slot expansion.**

v2.1.109 keeps the same architecture as v2.1.107 but grows the memo cache from 9 to 17 slots,
shifting the thinking component's slot indices from `K[0..8]` to `K[8..16]`. Gate conditional,
redact header, and overall function shape are unchanged.

**Function signature:**
```javascript
function oF8(q){let K=s(17),{param:_,addMargin:z,isTranscriptMode:Y,verbose:A,hideInTranscript:O}=q,{thinking:w}=_,...
  if(!w)return null;
  if(j)return null;      // ← Patch changes to if(!1)
  if(!(Y||A)){...}       // ← Patch changes to if(!1)
}
```

**Gate function (m7Y):**
```javascript
case"thinking":{if(!M&&!O)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `oF8` | React: `i36` | Box: `u` | Text: `T` | ThinkingContent: `kw`
- Gate: `m7Y` | Keybind: `C2` (sub-component) | Hook: `s`
- Redact header: `OZ8` = `"redact-thinking-2026-02-12"`

**Notable changes from v2.1.107:**
- Component renamed: `qU8` → `oF8`
- React import: `V96` → `i36`
- Text: `v` → `T` (uppercase again)
- ThinkingContent: `Ew` → `kw`
- Gate function: `d9Y` → `m7Y`
- Cache hook: `e(9)` → `s(17)` — slots doubled; indices shifted to 8–16
- Keybind sub-component: `I2` → `C2`
- Redact header constant: `nZ8` → `OZ8`
- Redact conditional helpers: `npq` → `rpq`, `b7` → `m7`, `X7` → `D7`
- Box (`u`) unchanged
- Gate conditional pattern unchanged: `if(!M&&!O)return null`

---

## v2.1.107 (npm)

**Standard identifier rotation — no structural changes from v2.1.104.**

v2.1.107 continues the same architecture: keybind display in a separate sub-component,
9 cache slots, and server-side thinking redaction that must be disabled.
Gate function uses numeric prefix (`d9Y`). Notable: Text component is now lowercase `v`
(was uppercase `V`), and cache hook simplified from `_6` to just `e`.

**Redact-thinking beta header:**
```javascript
// In beta header builder function:
if(Y&&npq(q)&&!b7()&&X7().showThinkingSummaries!==!0)K.push(nZ8);
// nZ8 = "redact-thinking-2026-02-12"
// ← Patch changes condition to if(!1) to prevent redaction
```

**Function signature:**
```javascript
function qU8(q){let K=e(9),{param:_,addMargin:z,isTranscriptMode:Y,verbose:A,hideInTranscript:O}=q,{thinking:w}=_,...
  if(!w)return null;
  if(j)return null;      // ← Patch changes to if(!1)
  if(!(Y||A)){...}       // ← Patch changes to if(!1)
}
```

**Gate function (d9Y):**
```javascript
case"thinking":{if(!M&&!O)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `qU8` | React: `V96` | Box: `u` | Text: `v` | ThinkingContent: `Ew`
- Gate: `d9Y` | Keybind: `I2` (sub-component) | Hook: `e`
- Redact header: `nZ8` = `"redact-thinking-2026-02-12"`

**Notable changes from v2.1.104:**
- Component renamed: `Ng8` → `qU8`
- React import: `O96` → `V96`
- Text changed: `V` → `v` (now lowercase)
- ThinkingContent: `S2` → `Ew`
- Gate function: `eOY` → `d9Y` (numeric prefix style)
- Cache hook: `_6(9)` → `e(9)` — same 9 slots
- Keybind sub-component: `Uw` → `I2`
- Redact header constant: `ID8` → `nZ8`
- Redact conditional changed: `OFq` → `npq`, `c7` → `b7`
- Box (`u`) unchanged
- Gate conditional pattern unchanged: `if(!M&&!O)return null`

---

## v2.1.104 (npm)

**Standard identifier rotation — no structural changes from v2.1.90.**

v2.1.104 continues the same architecture: keybind display in a separate sub-component,
9 cache slots, and server-side thinking redaction that must be disabled.
Gate function returns to ending in `Y` (`eOY`). Notable variable name swaps inside the
component: `verbose` is now `A` (was `$`), `thinking` is now `w` (was `A`), and header/content
local vars swapped (`X`=header, `M`=content instead of `M`=header, `X`=content).

**Redact-thinking beta header:**
```javascript
// In beta header builder function:
if(Y&&OFq(q)&&!c7()&&X7().showThinkingSummaries!==!0)K.push(ID8);
// ID8 = "redact-thinking-2026-02-12"
// ← Patch changes condition to if(!1) to prevent redaction
```

**Function signature:**
```javascript
function Ng8(q){let K=_6(9),{param:_,addMargin:z,isTranscriptMode:Y,verbose:A,hideInTranscript:O}=q,{thinking:w}=_,...
  if(!w)return null;
  if(j)return null;      // ← Patch changes to if(!1)
  if(!(Y||A)){...}       // ← Patch changes to if(!1)
}
```

**Gate function (eOY):**
```javascript
case"thinking":{if(!M&&!O)return null;  // ← Custom-peach patch changes to if(!1)
```

**Key identifiers:**
- Component: `Ng8` | React: `O96` | Box: `u` | Text: `V` | ThinkingContent: `S2`
- Gate: `eOY` | Keybind: `Uw` (sub-component) | Hook: `_6`
- Redact header: `ID8` = `"redact-thinking-2026-02-12"`

**Notable changes from v2.1.90:**
- Component renamed: `AI8` → `Ng8`
- React import: `bK6` → `O96`
- Text changed: `T` → `V`
- ThinkingContent: `DA` → `S2`
- Gate function: `Udz` → `eOY` (back to ending in `Y`), conditional uses `if(!M&&!O)`
- Cache hook: `Y6(9)` → `_6(9)` — same 9 slots
- Keybind sub-component: `X2` → `Uw`
- Redact header constant: `sM8` → `ID8`
- Redact conditional changed: `Qbq` → `OFq`, `F7` → `c7`, `T7` → `X7`
- Box (`u`) unchanged
- Internal variable swaps: `verbose:$` → `verbose:A`, `thinking:A` → `thinking:w`

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
| 2026-04-17 | **v2.1.113** | **BREAKING: binary format (Bun SEA)**. New identifiers (Yl_/g1H/ni1), byte-patch + codesign |
| 2026-04-16 | v2.1.112 | New identifiers (cg8/R96/wKY), pure rotation, gate fix |
| 2026-04-14 | v2.1.109 | New identifiers (oF8/i36/m7Y), 17-slot cache, gate fix |
| 2026-04-13 | v2.1.107 | New identifiers (qU8/V96/d9Y), gate fix |
| 2026-04-12 | v2.1.104 | New identifiers (Ng8/O96/eOY), gate fix |
| 2026-04-02 | v2.1.90 | New identifiers (AI8/bK6/Udz), gate fix |
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
