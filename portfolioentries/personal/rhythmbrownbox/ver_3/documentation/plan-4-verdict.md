# RhythmBrownBox v3 plan — the verdict, and the FDD build

**Planning, August 2026. Part 4 of 4.**
Scoring the four branches from Parts [2](plan-2-tdd-bdd.html) and [3](plan-3-fdd-ddd.html), and the plan v3 is actually built to.

## The scorecard

Same axes as [Part 1](plan-1-spec.html). Hypothetical — no branch was fully
built — but grounded in what v2 actually cost.

| Axis | TDD | BDD | FDD | DDD |
|---|---|---|---|---|
| First runnable / green | Fast (unit green) | Slow (runner + step defs) | Fast (walking skeleton) | Slow (model + layers) |
| Covers S1 / S4 / S5 naturally | Weak | **Strong** | Strong | Adapter-only |
| Scheduler regression safety (S6 / S7) | **Strong** | Medium | Medium (if noted) | Strong |
| Non-shipping artefact cost | **Lowest** | Highest | Low | High |
| Shows something v1 / v2 didn't | No — v2 did this | Barely — v2 did this | **Yes** | Yes, but oversized |
| Fit to a solo, ~6 KB app | Good | Heavy | **Good** | Overkill |

### Reading it

- **TDD** and **BDD** both score well on merit and badly on novelty: v2's rebuild
  was already a soft TDD core with Gherkin behaviour files. Running either as
  v3's headline is a repeat.
- **DDD** is the wrong size. S3, S4 and S5 — three of seven items — live entirely
  in an adapter and get nothing from the model, while the ceremony cost is paid
  in full. A model bigger than a 6 KB app is a portfolio anti-example.
- **FDD** fits the shape of the work. v3 *is* a discrete feature set with shallow
  domain depth; FDD's feature list is the backlog with no translation loss; each
  feature is a vertical slice a reader can follow end to end; and it still lets
  each slice borrow test-first for its own logic, so the S6 / S7 safety net is a
  line in a design note rather than a missing piece.

**v3 is built FDD.** TDD lives on inside it, per feature, for the pure functions.

## The FDD build plan

### 1 · Features list

The v3 backlog, in FDD's
`<action> the <result> <of|for|by> a(n) <object>` form, grouped into four build
sets:

**Set 1 — The sixth track** (S1)

- Add a sixth, user-supplied sample track to the kit
- Load a sound file onto the custom track by picker or drag-and-drop
- Decode and hold the sample for the session
- Edit the display label of a track
- Warn when a custom sample is too large to share

**Set 2 — The mixer** (S2)

- Adjust the playback volume of a track
- Mute a track
- Route every track through its own gain into the master gain
- Migrate a saved pattern from the v2 format to the v3 format

**Set 3 — Groove** (S6, S7)

- Delay the off-beat steps of the pattern by a swing amount
- Set the step length of a track
- Realign independent-length tracks over their common period
- Keep the v2 timing exact at swing 0 and equal lengths

**Set 4 — Layout & access** (S3, S4, S5)

- Centre the grid when it has fewer than eight columns
- Reflow the controls and grid for a phone-width screen
- Move focus across the grid with the arrow keys
- Announce a focused cell as track, step and state

### 2 · The shape (object model)

One page, and it stays one page:

```
Kit
 └─ Track (×6)        slot · label · gain · muted · length · Step[]
      └─ Sample       id · AudioBuffer · byteSize · builtIn?
Transport             bpm · swing
Persistence           (Kit, Transport) ⇄ save string   (v3 format)
Audio                 Track.source → Track.gain → master gain → destination
```

The custom track is `slot 6`, `builtIn? = false`; the sample it holds is the only
one that can be missing.

### 3 · Iteration

Design-by-feature, then build-by-feature, one set per branch:

1. `v3/set-1-custom-track` → PR
2. `v3/set-2-mixer` → PR
3. `v3/set-3-groove` → PR
4. `v3/set-4-layout-access` → PR

Each feature inside a set:

1. **Design walkthrough** — a paragraph in the set's design note: which module,
   which pure function, which DOM, what can go wrong.
2. **Build** — the vertical slice: a logic module + its Vitest tests + DOM
   wiring.
3. **Integrate** — merged behind the walking skeleton; the app still runs at the
   end of every feature.

CI is unchanged from v2 (lint + test + build on push). "Done" for a set = its
features are on `main`, the suite is green, and both the multi-file and
single-file builds are produced.

### 4 · Walking skeleton (before Set 1)

Render the sixth row, silent, labelled "empty — drop a sound here"; teach the
save reader to *accept* v3 fields without writing them yet; add the per-track
gain nodes to the graph at unity. Nothing user-visible changes; every Set-1
feature now has a place to attach.

### 5 · Sequencing rationale

- **Set 1 first** — the biggest unknown (file decode, drag events, session
  storage) and the most visible win; do it while attention is highest.
- **Set 2 second** — the format migration it carries is a prerequisite for saving
  anything from Sets 3–4.
- **Set 3 third** — highest regression risk; by now the suite is broad enough to
  catch a scheduler slip.
- **Set 4 last** — pure presentation and focus; nothing depends on it, and it is
  the easiest to review against a real phone.

### 6 · Parking lot

Deferred, not forgotten: song mode, effects sends, a built-in extended kit, MIDI
export. None block v3.

## Definition of done for v3

Every feature in all four sets on `main`; the v2 suite plus the new per-feature
tests green; verified at 360 px; a v2 save opens with defaults; a v3 save
rejected safely by v2; the single-file build runs from `file://`.

Back to the **[v3 overview](index.html)**.
