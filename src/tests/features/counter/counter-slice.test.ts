import { makeStore } from '@/redux/store';
import {
  counterSlice,
  decremented,
  incremented,
  reset,
  selectCount,
  selectIsEven,
  stepChanged
} from '@/features/counter/counter-slice';

const { reducer } = counterSlice;

test('incremented adds the current step to the value', () => {
  expect(reducer({ value: 0, step: 1 }, incremented()).value).toBe(1);
  expect(reducer({ value: 0, step: 5 }, incremented()).value).toBe(5);
});

test('decremented subtracts the current step from the value', () => {
  expect(reducer({ value: 10, step: 3 }, decremented()).value).toBe(7);
});

test('stepChanged enforces a whole number step of at least 1', () => {
  expect(reducer({ value: 0, step: 1 }, stepChanged(4)).step).toBe(4);
  expect(reducer({ value: 0, step: 4 }, stepChanged(0)).step).toBe(1);
  expect(reducer({ value: 0, step: 4 }, stepChanged(-3)).step).toBe(1);
  expect(reducer({ value: 0, step: 4 }, stepChanged(2.7)).step).toBe(2);
});

test('reset restores the initial state', () => {
  expect(reducer({ value: 42, step: 7 }, reset())).toEqual({ value: 0, step: 1 });
});

test('selectIsEven derives parity from the count', () => {
  const store = makeStore();

  expect(selectIsEven(store.getState())).toBe(true);

  store.dispatch(incremented());
  expect(selectCount(store.getState())).toBe(1);
  expect(selectIsEven(store.getState())).toBe(false);
});

test('selectIsEven is memoized — no recomputation for the same state', () => {
  const store = makeStore();
  // Slice-wrapped selectors expose the original via `.unwrapped`; reselect v5
  // caches across ALL previously seen inputs, so clear both cache layers first
  const memoized = selectIsEven.unwrapped;
  memoized.clearCache();
  memoized.memoizedResultFunc.clearCache();
  memoized.resetRecomputations();

  const state = store.getState();
  selectIsEven(state);
  selectIsEven(state);
  selectIsEven(state);

  expect(memoized.recomputations()).toBe(1);
});
