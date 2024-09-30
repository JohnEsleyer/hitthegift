import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface UserDataState{
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    verified: boolean;
    email: string;
    hobbyInfo: string;
    showInterest: boolean;
}

const initialState: UserDataState = {
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    verified: false, 
    email: '',
    hobbyInfo: '',
    showInterest: true,
}

const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        updateUserData: (state, action) => {
            return action.payload;
        },
        updateHobbyInfo: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                hobbyInfo: action.payload,
            }
        }
    }
});

export const {updateUserData} = userDataSlice.actions;
export default userDataSlice.reducer;