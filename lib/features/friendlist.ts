import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FriendListState {
   friendId: string;
}

const initialState: FriendListState = {
   friendId: '',
};

const friendListSlice = createSlice({
    name: 'friendlist',
    initialState,
    reducers: {
        updateFriendId: (state, action: PayloadAction<string>) => {
            return {
                friendId: action.payload
            };
        },
        
    }
});

export const { updateFriendId} = friendListSlice.actions;
export default friendListSlice.reducer; // Ensure this exports the reducer
