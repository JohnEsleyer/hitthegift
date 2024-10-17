// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userDataSlice, { UserDataState } from './features/userData';
import { loadState, saveState } from '@/utils/localStorage';
import popupsSlice from './features/popups';
import wishlist from './features/wishlist';
import insideFriend from './features/insideFriend';
import friendsListPage from './features/friendslistPage';
import mylist from './features/mylist';
import productImageUpload from './features/productImageUpload';
import editProductPopup from './features/editProductsPopup';
import editEventPopup from './features/editEventsPopup';
import friendsSidebar from './features/friendsSidebar';

export const makeStore = () => {
    let persistedState;
    if (typeof window !== 'undefined'){
    persistedState = loadState() as { userData: UserDataState }; // Cast the loaded state to the correct type
    }

    const store = configureStore({
        reducer: {
            userData: userDataSlice,
            popups: popupsSlice,
            wishlist: wishlist,
            insideFriend: insideFriend,
            friendsListPage: friendsListPage,
            mylist: mylist,
            productImageUpload: productImageUpload,
            editProductPopup: editProductPopup,
            editEventPopup: editEventPopup,
            friendsSidebar: friendsSidebar,
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
