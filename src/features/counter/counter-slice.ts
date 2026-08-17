import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CounterState {
  value: number;
  step: number;
}

const initialState: CounterState = {
  value: 0,
  step: 1
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  // Reducers "mutate" thanks to immer — they are still pure functions.
  // Action names are past-tense events (what happened), not commands.
  reducers: {
    incremented: (state) => {
      state.value += state.step;
    },
    decremented: (state) => {
      state.value -= state.step;
    },
    stepChanged: (state, action: PayloadAction<number>) => {
      // Business rules live in reducers: the step is always a whole number >= 1
      state.step = Math.max(1, Math.trunc(action.payload) || 1);
    },
    reset: () => initialState
  },
  // Selectors are colocated with the slice (RTK 2 idiom). They receive the SLICE
  // state; the exported `counterSlice.selectors` versions accept the root state.
  selectors: {
    selectCount: (state) => state.value,
    selectStep: (state) => state.step,
    // Derived state is computed in a memoized selector, never stored in the slice
    selectIsEven: createSelector([(state: CounterState) => state.value], (value) => value % 2 === 0)
  }
});

export const { incremented, decremented, stepChanged, reset } = counterSlice.actions;
export const { selectCount, selectStep, selectIsEven } = counterSlice.selectors;
