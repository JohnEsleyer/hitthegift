// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userDataSlice, { UserDataState } from './features/userData';
import { loadState, saveState } from '@/utils/localStorage';
import overlaysSlice from './features/overlays';
import wishlist from './features/wishlist';
import insideFriend from './features/insideFriend';
import friendsList from './features/friendslist';

export const makeStore = () => {
    let persistedState;
    if (typeof window !== 'undefined'){
    persistedState = loadState() as { userData: UserDataState }; // Cast the loaded state to the correct type
    }

    const store = configureStore({
        reducer: {
            userData: userDataSlice,
            overlays: overlaysSlice,
            wishlist: wishlist,
            insideFriend: insideFriend,
            friendsList: friendsList,
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
