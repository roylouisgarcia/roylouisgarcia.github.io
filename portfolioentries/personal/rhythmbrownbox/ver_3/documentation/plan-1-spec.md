# RhythmBrownBox v3 — the spec, and a four-branch experiment

**Planning, August 2026. Part 1 of 4.**
One spec, planned four ways — TDD, BDD, FDD, DDD — then one of them picked to build.

## Why do this

v2 was a ground-up rebuild driven by a code audit and an informal "agile / BDD /
TDD" backlog: test-first on the pure logic, Gherkin `.feature` files for the DOM
and audio behaviour. It worked, but the methodology was whatever got that
increment done — never a deliberate choice.

v3 has a small, bounded scope (below). That makes it a good place to run a
deliberate experiment: take the **same** acceptance criteria and plan four
branches, each driven by one methodology —

- **TDD** — Test-Driven Development (unit-first; red, green, refactor)
- **BDD** — Behaviour-Driven Development (scenario-first, outside-in)
- **FDD** — Feature-Driven Development (feature-list-first; design- and build-by-feature)
- **DDD** — Domain-Driven Design (model-first; ubiquitous language, layered)

Parts 2 and 3 walk each branch hypothetically — where it puts the first commit,
what its artefacts are, what it catches early and what it leaves late. Part 4
scores them and picks one to actually build. It won't be TDD; v2 already tells
that story.

## The v3 spec

The same target for all four branches. v3 ships when every item here is true, on
desktop and on a phone, with the v2 test suite still green.

### S1 — Uploadable custom-sample track

A sixth track, below v2's five, whose sample the user supplies:

- Load a short audio file by file-picker **or** drag-and-drop onto the track.
- `.wav`, `.mp3`, `.ogg` accepted; decoded once via `decodeAudioData`, held as an
  `AudioBuffer` for the session.
- The track label is editable free text — "tom", "cymbal", "synth stab".
- Until a sample is loaded the row is present but silent, and says so.
- A loaded sample is offered for persistence (see S2). If it is too large for the
  share URL, Share still works and warns that the custom sample will not travel.

### S2 — Per-track volume and mute

- Every track gets its own gain (0–100 %) and its own mute, independent of the
  others.
- The existing master Volume stays as the final stage:
  `source → track gain → master gain → destination`.
- The saved-pattern format bumps v2 → v3: it now carries six rows, per-track gain
  and mute, per-track length (S7) and swing (S6). A v2 save loads with defaults
  filled in; a v3 save opened by v2 falls back to an empty grid — the same way v2
  already handles a save that is a row short.

### S3 — Centred / responsive grid

- The grid is laid out from its column count. At the full 16 / 32 it fills the
  width; below 8 columns (short patterns, or the shortest track under S7) it
  **centres** instead of pinning left.
- Cells keep a minimum size; the grid never shrinks cells to fit.

### S4 — Mobile UX

- Below one breakpoint the controls reflow to a single column; the step grid
  scrolls sideways **inside its own container** — the page body never scrolls
  horizontally.
- Every control is a touch target of at least 44 px. Nothing is hover-only.
- Transport (Start / Stop / Share) stays reachable without scrolling the grid
  back into view.
- Verified at 360 px wide.

### S5 — Roving-tabindex grid

- The grid is one tab stop. Arrow keys move a roving focus from cell to cell;
  Space or Enter toggles; Home / End jump within a row.
- Replaces v2, where each of up to 192 cells is its own tab stop.
- Screen-reader output names the focused cell as track + step + on/off.

### S6 — Swing

- A swing control, 0–75 %, delays every off-beat sixteenth (steps 2, 4, 6 …) by
  that fraction of a step.
- Applied as a pure function inside the scheduler; 0 % is bit-for-bit the v2
  timing.

### S7 — Per-track pattern length (polymeter)

- Each track has its own length (2–32). Rows loop independently, so a 12-step hat
  plays against a 16-step kick and the pattern realigns every LCM steps.
- The global "pattern length" becomes the default applied to new or reset tracks.

### Non-goals for v3

Song mode (chained patterns), effects, a larger built-in kit (S1 covers extra
voices). Still MPL-2.0, still zero runtime dependencies, still shipped as **both**
a multi-file `dist/` and a single self-contained `index.html`.

## How the branches will be judged

Part 4 scores the four on the same axes:

| Axis | Question |
|---|---|
| First commit | How long until something runs, or something is green? |
| Covers S1 / S4 / S5 | Does the method naturally reach upload, mobile and focus — the interaction-heavy items — or leave them to the end? |
| Regression safety | What stops S6 / S7 from breaking the v2 scheduler? |
| Artefact cost | Feature lists, scenarios, step definitions, model docs — how much non-shipping material? |
| Portfolio value | Does the write-up show something v1 and v2 didn't already? |
| Fit to a solo, small codebase | Ceremony vs payoff at ~6 KB of app code |

Next: **[Part 2 — the TDD and BDD branches](plan-2-tdd-bdd.html).**
