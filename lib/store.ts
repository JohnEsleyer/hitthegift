// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userDataSlice, { UserDataState } from './features/userData';
import { loadState, saveState } from '@/utils/localStorage';

export const makeStore = () => {
    const persistedState = loadState() as { userData: UserDataState }; // Cast the loaded state to the correct type

    const store = configureStore({
        reducer: {
            userData: userDataSlice,
        },
        preloadedState: persistedState,
    });

    store.subscribe(() => {
        saveState(store.getState()); // Save state on every change
    });

    return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
