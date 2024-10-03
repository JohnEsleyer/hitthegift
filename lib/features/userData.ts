import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserDataState {
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
        updateUserFirstName: (state, action: PayloadAction<string>) => {
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
    updateUserFirstName,
    updateUserLastName,
} = userDataSlice.actions;
export default userDataSlice.reducer; // Ensure this exports the reducer
