# RhythmBrownBox v3 plan — TDD and BDD

**Planning, August 2026. Part 2 of 4.**
Two test-first branches for the [Part 1 spec](plan-1-spec.html): unit-first, and scenario-first.

## Branch A — TDD

Test-Driven Development: no production line without a failing unit test that
demands it; red, green, refactor; let the design stay emergent.

### Where the first commit lands

In `src/*.test.js`, against pure functions. v2's `scheduler`, `tempo`, `pattern`
and `persistence` modules are already shaped this way, so the branch opens by
extending their test lists:

- `swing.js` — `swungOffset(step, swingPct, stepDur) → seconds`. Tests: 0 % is
  identity; 50 % pushes odd-indexed steps by half a step; even steps never move;
  clamp at 75 %.
- `polymeter.js` — `trackStepAt(globalStep, trackLen) → localStep`;
  `patternPeriod(lengths) → lcm`. Tests: equal lengths behave like v2; 12 against
  16 realigns at 48; lengths 1 and 32 at the edges.
- `persistence.js` — `migrateV2toV3(save)` fills six rows, default gains, default
  mute, per-track length, swing 0. `parse(v3save)` round-trips. An over-long
  custom sample drops from the URL payload with a flag set.
- `mixer.js` — `trackGainValue(pct, muted) → 0..1`; graph wiring asserted against
  a mock `AudioContext` (v2 already mocks it).

### The artefacts

A test list per module (kept in the PR description), then the tests. Nothing
else — no scenario files, no model doc.

### Walking the spec

| Spec item | TDD grip |
|---|---|
| S2 per-track volume | Strong — pure gain math + graph wiring under a mock context |
| S6 swing | Strong — the whole thing is one pure function |
| S7 polymeter | Strong — LCM and index math, easy to pin |
| S3 centred grid | Weak — a layout rule; a unit test can assert a class or a computed count, not that it *looks* centred |
| S1 upload | Weak — `decodeAudioData`, `FileReader`, drag events; the decodable-file path unit-tests, the drag-drop UX does not |
| S4 mobile | Weak — viewport behaviour; unit tests say nothing |
| S5 roving tabindex | Partial — `nextFocusIndex(cur, key, rows, cols)` is pure and testable; the focus move and the SR text are not |

### What it catches early / leaves late

**Catches:** every scheduler regression the moment it happens. S6 and S7 touch
v2's hottest path and TDD is the tightest net possible there.

**Leaves late:** S1, S4 and half of S5. The branch reaches "all units green" with
the upload flow and the mobile layout still unbuilt — nothing red is pointing at
them.

### Cost

Lowest artefact cost of the four. The risk is a false sense of doneness: a green
suite over unshipped features.

## Branch B — BDD

Behaviour-Driven Development: describe each capability as concrete scenarios in
domain language first, agree they are right, then drive the code outside-in from
step definitions.

### Where the first commit lands

In `features/*.feature`, in Gherkin. v2 already carries feature files as
*documentation*; this branch makes them executable — a runner plus step
definitions over a real DOM (jsdom, or Playwright for the touch and focus
scenarios).

```gherkin
Feature: Custom sample track

  Scenario: Loading a sample by drag and drop
    Given the custom track has no sample
    And the custom track row shows "drop a sound here"
    When I drop "tom.wav" onto the custom track
    Then the custom track plays "tom.wav" on its active steps
    And the row label can be edited

  Scenario: Sharing a pattern that uses a large custom sample
    Given the custom track uses a 2 MB sample
    When I press Share
    Then the copied link restores every track except the custom sample
    And I am told the custom sample will not travel
```

```gherkin
Feature: Playing on a phone

  Scenario: The grid on a 360px screen
    Given I open RhythmBrownBox at 360px wide
    Then the controls stack in one column
    And the step grid scrolls sideways within its own box
    And the page itself never scrolls sideways
    And every button is at least 44px tall
```

### The artefacts

Feature files (the spec, restated as behaviour), a step-definition layer, a
runner in CI. The feature files double as the doc page — the trick v2 used, now
backed by passing scenarios.

### Walking the spec

| Spec item | BDD grip |
|---|---|
| S1 upload | Strong — the drop, the empty state, the label edit, the share warning are all natural scenarios |
| S4 mobile | Strong — "at 360px …" is a first-class scenario, not an afterthought |
| S5 roving tabindex | Strong — "When I press ArrowRight / Then focus moves to the next step" reads directly |
| S2 per-track volume | Medium — "louder / muted" scenarios are easy; the exact gain curve is better as a unit test |
| S6 swing | Medium — "the off-beats are late" is describable; the exact offset wants a unit test underneath |
| S7 polymeter | Medium — "the hat and the kick drift apart then realign" is one good scenario; the LCM math sits under it |

### What it catches early / leaves late

**Catches:** exactly the items TDD leaves late. S1, S4 and S5 are where BDD
starts. The scenarios are also the Part 1 acceptance checklist, one-to-one.

**Leaves thin:** the numeric core. "Swing feels right" passing does not mean
`swungOffset` is exact — you still want unit tests, so BDD here is TDD-plus, not
TDD-instead.

### Cost

Highest infrastructure cost of the four: a runner, step definitions and a
browser-ish CI environment, all maintained. Scenario drift is real — one UI
change can break twenty scenarios' wording at once. For a solo build the
step-definition layer is a lot of scaffolding around a 6 KB app.

## TDD vs BDD on this spec

They are not opposites; they cover different halves. TDD owns S2 / S6 / S7 (the
numbers), BDD owns S1 / S4 / S5 (the interactions), and each is weak exactly
where the other is strong. A real branch of either ends up borrowing the other.
The honest read: **v2 already did a soft version of both**, so neither is the
interesting choice for v3's write-up.

Next: **[Part 3 — the FDD and DDD branches](plan-3-fdd-ddd.html).**
