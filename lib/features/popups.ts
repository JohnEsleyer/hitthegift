import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PopupsState {
   currentPopup: string;
   invitedEmail: string;
}

const initialState: PopupsState = {
   currentPopup: '',
   invitedEmail: '',
};

const popupsSlice = createSlice({
    name: 'popups',
    initialState,
    reducers: {
        updateCurrentPopup: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                currentPopup: action.payload,
            };
        },
        updateInvitedEmailForPopup: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                invitedEmail: action.payload,
            }
        }
    }
});

export const { updateCurrentPopup, updateInvitedEmailForPopup} = popupsSlice.actions;
export default popupsSlice.reducer; // Ensure this exports the reducer
