import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserDataState {
    id: string;
    firstName: string;
    lastName: string;
    verified: boolean;
    birthday: string;
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
    birthday:'',
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
            return {
                ...state,
                hobbyInfo: action.payload,
            };
        },
        updateUserId: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                id: action.payload,
            }
        },
        updateUserFirstNameStore: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                firstName: action.payload,
            }
        },
        updateUserLastName: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                lastName: action.payload,
            }
        },
        updateUserVerified: (state, action:PayloadAction<boolean>) => {
            return {
                ...state,
                verified: action.payload,
            }
        },
        updateUserVerificationToken: (state, action:PayloadAction<string>) => {
            return{
                ...state,
                verificationToken: action.payload,
            }
        },
        updateUserBirthdayStore: (state, action: PayloadAction<string>) => {
            return {
            ...state, 
            birthday: action.payload,   
            }  
        }
    }
});

export const { 
    updateUserData, 
    updateHobbyInfo, 
    updateUserId,
    updateUserFirstNameStore,
    updateUserLastName,
    updateUserVerified,
    updateUserVerificationToken,
    updateUserBirthdayStore,
} = userDataSlice.actions;
export default userDataSlice.reducer; // Ensure this exports the reducer
