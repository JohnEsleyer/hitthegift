import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InsideFriendState {
   friendId: string;
   friends: string[];
}

const initialState: InsideFriendState = {
   friendId: '',
   friends: [],
};

const insideFriendSlice = createSlice({
    name: 'insideFriend',
    initialState,
    reducers: {
        updateFriendId: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                friendId: action.payload,
            };
        },
        
    }
});

export const { updateFriendId} = insideFriendSlice.actions;
export default insideFriendSlice.reducer; // Ensure this exports the reducer
