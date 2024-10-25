import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserDataState {
    id: string;
    firstName: string;
    lastName: string;
    verified: boolean;
    verificationToken: string;
    email: string;
    hobbyInfo: string;
    showInterest: boolean;
}

const initialState: UserDataState = {
    id: '',
    firstName: '',
    lastName: '',
    verified: false, 
    verificationToken: '',
    email: '',
    hobbyInfo: 'This is the value of hobbyInfo in redux',
    showInterest: true,
};

const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        updateUserData: (state, action: PayloadAction<UserDataState>) => {
            return action.payload;
        },
        updateHobbyInfo: (state, action: PayloadAction<string>) => {
            console.log('updating from state...' + action.payload);
            return {
                ...state,
                hobbyInfo: action.payload,
            };
        },
        updateUserId: (state, action: PayloadAction<string>) => {
            console.log('updating user id...');
            return {
                ...state,
                id: action.payload,
            }
        },
        updateUserFirstNameStore: (state, action: PayloadAction<string>) => {
            console.log('updating user first name...');
            return {
                ...state,
                firstName: action.payload,
            }
        },
        updateUserLastName: (state, action: PayloadAction<string>) => {
            console.log('updating user last name...');
            return {
                ...state,
                lastName: action.payload,
            }
        },
    }
});

export const { 
    updateUserData, 
    updateHobbyInfo, 
    updateUserId,
    updateUserFirstNameStore,
    updateUserLastName,
} = userDataSlice.actions;
export default userDataSlice.reducer; // Ensure this exports the reducer
