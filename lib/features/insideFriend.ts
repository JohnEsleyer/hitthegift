import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InsideFriendState {
   friendId: string;
   friendName: string;
   friends: string[];
   isOpenChatbox: boolean;
   conversationId: string;
}

const initialState: InsideFriendState = {
   friendId: '',
   friendName: '',
   friends: [],
   isOpenChatbox: false,
   conversationId: '',
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
        updateFriendName: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                friendName: action.payload,
            }
        },
        updateIsOpenChatbox: (state, action: PayloadAction<boolean>) => {
            return {
                ...state,
                isOpenChatbox: action.payload,
            }
        },
        updateConversationId: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                conversationId: action.payload,
            }
        },
    }
});

export const { 
    updateFriendId, 
    updateFriendName, 
    updateIsOpenChatbox,
    updateConversationId,
} = insideFriendSlice.actions;
export default insideFriendSlice.reducer; // Ensure this exports the reducer
