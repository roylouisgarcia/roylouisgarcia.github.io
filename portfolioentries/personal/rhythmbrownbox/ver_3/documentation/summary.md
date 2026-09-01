# RhythmBrownBox — Version 3

**Planned. In design. Not yet built.**
Scope is set; the build methodology was chosen by planning the same spec four ways first.

## The spec

v3 adds, on top of v2:

- **A sixth track you load your own sample into** — drag-and-drop or file-picker a
  short `.wav` / `.mp3` / `.ogg`, with an editable label (tom, cymbal, synth…).
- **Per-track volume and mute**, with the master Volume kept as the final stage.
- **A centred grid** when the pattern is under eight columns.
- **A real mobile layout** — controls in one column, the grid scrolling inside its
  own box, 44 px touch targets, verified at 360 px.
- **A roving-tabindex grid** — one tab stop, arrow keys to move (v2 makes every
  cell its own tab stop).
- **Swing** — 0–75 %, delaying the off-beat sixteenths.
- **Per-track pattern lengths** — polymeter; a 12-step row against a 16-step row.

Non-goals: song mode, effects, a bigger built-in kit. Still MPL-2.0, still zero
runtime dependencies, still shipped as both a multi-file and a single-file build.

## The plan — a four-part series

The same spec, planned four ways, then one picked to build:

1. [The spec, and a four-branch experiment](plan-1-spec.html)
2. [The TDD and BDD branches](plan-2-tdd-bdd.html)
3. [The FDD and DDD branches](plan-3-fdd-ddd.html)
4. [The verdict, and the FDD build plan](plan-4-verdict.html)

**Outcome:** v3 is built **Feature-Driven**. v3 is a discrete feature set with
shallow domain depth, so FDD's feature list is the backlog with no translation
loss, and each feature is a vertical slice. TDD — which drove the v2 rebuild —
lives on inside each feature for its pure logic.

This folder's demo is a placeholder until the build begins.
