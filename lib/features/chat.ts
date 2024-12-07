import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ServerResponseForEvents } from '../types/event';
import { UserConversation } from '../types/conversation';
import { ChatMessage } from '../types/message';

export interface ChatState {
   showLoading: boolean; // This loading flag is used by the HomeTemplate component to make sure we get the correct conversation Id
   conversations: UserConversation[];
   messages: ChatMessage[];
}

const initialState: ChatState = {
   showLoading: false,
   conversations: [],
   messages: [],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        updateShowLoading: ( state, action: PayloadAction<boolean>) => {
            return {
                ...state,
               showLoading: action.payload,
            };
        },

        updateConversations: (state, action: PayloadAction<UserConversation[]>) => {
            return {
                ...state,
                conversations: action.payload,
            }
        },
        updateMessages: (state, action: PayloadAction<ChatMessage[]>) => {
            return {
                ...state,
                messages: action.payload,
            }
        }
    }
});

export const { 
    updateShowLoading,
    updateConversations,
    updateMessages,
} = chatSlice.actions;
export default chatSlice.reducer; // Ensure this exports the reducer
