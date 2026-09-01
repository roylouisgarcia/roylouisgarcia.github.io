# RhythmBrownBox v3 plan — FDD and DDD

**Planning, August 2026. Part 3 of 4.**
Two model-first branches for the [Part 1 spec](plan-1-spec.html): organized by feature, and organized by domain.

## Branch C — FDD

Feature-Driven Development: build a features list, sketch a lightweight object
model, then iterate design-by-feature / build-by-feature — each feature a thin
vertical slice, designed, built, tested and integrated before the next starts.

### Where the first commit lands

In two short documents, then a walking skeleton.

**1 — The features list.** FDD phrases a feature as
`<action> the <result> <by|for|of|to> a(n) <object>`:

- Add a sixth, user-supplied sample track to the kit
- Load a sound file onto the custom track by picker or drag-and-drop
- Edit the display label of a track
- Adjust the playback volume of a track
- Mute a track
- Center the grid when it has fewer than eight columns
- Reflow the controls and grid for a phone-width screen
- Move focus across the grid with the arrow keys
- Delay the off-beat steps of the pattern by a swing amount
- Set the step length of a track
- Migrate a saved pattern from the v2 format to the v3 format
- Warn when a custom sample is too large to share

**2 — The shape (object model).** One small diagram: a `Kit` has `Track`s; a
`Track` has a `Sample`, a `gain`, a `muted`, a `length` and a step array; a
`Transport` holds `bpm` and `swing`; `Persistence` maps a `Kit` + `Transport` to
and from a save string.

**3 — A walking skeleton:** the sixth row rendered, silent, wired to nothing — so
every later feature has somewhere to land.

### The artifacts

The features list (also the progress board — each feature is *not started /
designing / building / done*), the one-page model, and a short design note per
feature. Tests are expected but the method does not dictate test-first: a
feature's slice includes "unit tests for its logic," and Branch C reuses v2's
Vitest setup inside each slice.

### Walking the spec

Every S-item maps to one or two features, each thin enough to finish in a
sitting:

| Feature set | Features | Spec |
|---|---|---|
| **1 · The sixth track** | add track, load file, edit label, large-sample warning | S1 |
| **2 · The mixer** | per-track volume, per-track mute, format migration | S2 |
| **3 · Groove** | swing, per-track length | S6, S7 |
| **4 · Layout & access** | center short grid, phone reflow, roving focus | S3, S4, S5 |

### What it catches early / leaves late

**Catches:** scope. The features list is the whole of v3 on one page before any
code — the large-sample edge (S1), the format migration (S2) and the v2-save
fallback are line items, not surprises. Progress is visible feature by feature.

**Leaves late:** nothing structurally — but FDD does not force the scheduler
safety net that TDD gives for free, so feature set 3 has to say, in its design
note, "regression tests for the v2 timing path."

### Cost

Two upfront documents and a design note per feature — more than TDD, far less
than DDD. The model is deliberately thin; if it grows past one page on this app,
that is the smell that you have wandered into Branch D.

## Branch D — DDD

Domain-Driven Design: find the domain, model it in a ubiquitous language, keep
that model pure and framework-free, and push audio, DOM and storage out to an
application layer and adapters.

### Where the first commit lands

In a `domain/` module with no imports from the DOM or Web Audio:

- **Aggregate:** `Pattern` (root) — owns its `Track`s, enforces invariants
  (1–6 tracks, each length 2–32, exactly one custom track).
- **Entity:** `Track` (identity = its slot).
- **Value objects:** `Step`, `Swing` (0–75, immutable), `TrackLength`, `Gain`,
  `Sample` (id + decoded flag + byte size), `Bpm`.
- **Domain services:** `Scheduler` (given a `Pattern`, `Bpm`, `Swing` and a time
  window, yields the hits to play — pure), `PatternCodec` (model ↔ save string).
- **Application layer:** `SequencerApp` — commands (`LoadSample`, `SetTrackGain`,
  `SetSwing`, `SetTrackLength`, `ToggleStep`), each loading the aggregate,
  calling a method, persisting.
- **Adapters:** `WebAudioSink`, `DomView`, `LocalStoragePatternStore`,
  `UrlPatternShare`.

### The artifacts

A ubiquitous-language glossary, a model / context document, the layer
boundaries, plus tests (the pure domain is trivially unit-testable — this is
where DDD and TDD get along).

### Walking the spec

| Spec item | Where it lives in the model |
|---|---|
| S6 swing | `Swing` VO + `Scheduler` service — clean |
| S7 polymeter | `TrackLength` VO + `Pattern.period()` — clean |
| S2 volume / mute | `Gain` VO on `Track`; an adapter builds the graph |
| S1 upload | `Sample` VO in the model; `FileReader` / `decodeAudioData` in an adapter; "too big to share" is a rule on `Sample.size` |
| S3 / S4 layout | Entirely in the `DomView` adapter — the model has nothing to say |
| S5 roving focus | Also the `DomView` adapter |

### What it catches early / leaves late

**Catches:** separation. The persistence format, the audio graph and the layout
cannot leak into the core rules, because the core cannot see them. The migration
and the share-size rule become explicit domain policy.

**Leaves late:** nothing — but it front-loads a lot of structure before the sixth
row ever makes a sound.

### Cost

Highest ceremony of the four. Aggregates, value objects, an application layer and
adapters are the right tools for a domain with depth and several consumers;
RhythmBrownBox is one screen, one user, ~6 KB. Half the spec (S3, S4, S5) lives
entirely in an adapter and gets no benefit from the model. Real risk: the model
ends up larger than the app.

## FDD vs DDD on this spec

Both are model-first; they differ in what the model is *for*. FDD's model is a
shared sketch to hang a feature list on — it stays small on purpose. DDD's model
*is* the product, and everything else is plumbing around it. On an app this size
DDD's payoff (an isolated, deep domain) is small because the domain is shallow,
while its cost (four layers, a glossary, adapters) is fixed. FDD's feature list,
by contrast, is already the shape of v3.

Next: **[Part 4 — the verdict, and the FDD build plan](plan-4-verdict.html).**
