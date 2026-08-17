import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '@/redux/apis/base-api';
import { counterSlice } from '@/features/counter/counter-slice';

export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      [counterSlice.name]: counterSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware)
  });

export const store = makeStore();

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
