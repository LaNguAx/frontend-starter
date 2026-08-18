# Feature anatomy — client state (Redux slice)

`counter` is the reference for **client state**: data that exists only in the browser and is
owned by a Redux slice. Its counterpart is `features/notes`, the reference for **server state**
(RTK Query). The decision rule lives in the notes README and applies in both directions:

> Server-fetched data → RTK Query, no slice. Browser-only data → slice, no api. Never both.

**Permanent reference — never delete this feature.** It is the living documentation of
the client-state pattern (including its tests) and stays in the repo even after real
features exist. New features are built alongside it by copying its shape.

## Files and their roles

| File               | Role                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `counter-slice.ts` | `createSlice` with typed state, `PayloadAction`, and colocated `selectors` (RTK 2 idiom — exported via `counterSlice.selectors`, they accept the root state). Reducers are named as past-tense **events** (`incremented`, `stepChanged`), not commands. Derived data (`selectIsEven`) uses `createSelector` inside the `selectors` block — computed, never stored in state. |
| `components/`      | Small components that each do one thing: display (selectors only), controls (dispatch only), input (both). Composition happens in `Counter.tsx`. Redux access is only through the typed hooks — `useAppSelector` / `useAppDispatch` from `@/redux/hooks/redux-hooks`, never raw `useSelector` / `useDispatch`.                                                              |

## Slice rules

- Reducers may "mutate" — immer makes it safe — but must stay **pure**: no async, no
  `Math.random`/`Date.now`, no side effects. Async client logic belongs in thunks or the
  listener middleware, not here.
- **Business rules live in reducers**, not components: `stepChanged` clamps its payload to a
  whole number ≥ 1, so no component can ever put the state in an invalid shape.
- **Never store derivable data.** Parity is computed by a memoized selector; storing an
  `isEven` field in the slice would create a second source of truth to keep in sync.
- `reset: () => initialState` — returning a new state object is the idiomatic full reset.

## Integration points

1. **Route** — `counter-route.ts` exports the feature-owned lazy `RouteObject`, registered in
   `src/routes/router.ts`; the nav link lives in `src/ui/components/Sidebar.tsx`.
2. **Store** — `src/redux/store.ts`: register `[counterSlice.name]: counterSlice.reducer`.
   This is the single client-state touchpoint (server-state features don't even need this —
   they inject into the shared api reducer).
3. **i18n** — `counter.*` namespace in `he.json` + `en.json`. Note the typed-`t()` rule:
   pick between literal keys (`t(isEven ? 'counter.even' : 'counter.odd')`) — never build
   keys with string templates, which defeats key type-checking.

## Testing

Tests live in `src/tests/features/counter/`, mirroring this folder (never colocated):

- `counter-slice.test.ts` — reducers as pure functions (`reducer(state, action)` in, new state
  out) covering behavior **and** the business rules (clamping, reset); selector tests including
  proof of memoization via the wrapped selector's `.unwrapped` reselect instance.
- `Counter.test.tsx` — user-visible behavior through `renderWithProviders` (fresh store per
  test): click flows, step interaction, reset.

## Conventions

The shared conventions (naming, i18n typed keys, logical Tailwind + `cn()`, promise-`void`
marking) are listed in the notes README's conventions recap and apply here unchanged. The
library APIs used are the **current (2026)** ones — read `LIBRARY_PATTERNS.md` at the repo
root before writing or "fixing" any of this code.
