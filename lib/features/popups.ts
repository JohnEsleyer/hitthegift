import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PopupsState {
   currentPopup: string;
}

const initialState: PopupsState = {
   currentPopup: '',
};

const popupsSlice = createSlice({
    name: 'popups',
    initialState,
    reducers: {
        updateCurrentPopup: (state, action: PayloadAction<string>) => {
            return {
                currentPopup: action.payload
            };
        },
        
    }
});

export const { updateCurrentPopup} = popupsSlice.actions;
export default popupsSlice.reducer; // Ensure this exports the reducer
