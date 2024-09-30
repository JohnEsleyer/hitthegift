import {configureStore} from '@reduxjs/toolkit'
import userData from './features/userData';


export const makeStore = () => {
    return configureStore({
        reducer: {
            userData: userData,
        }
    });
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
