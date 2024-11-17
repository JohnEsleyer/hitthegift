import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ServerResponseForEvents } from '../types/event';


interface UserConversation {
    conversationId: string;
    unreadMessageCount: number;
    friend: {
      id: string;
      name: string;
    };
  }
  

export interface ChatState {
   showLoading: boolean; // This loading flag is used by the HomeTemplate component to make sure we get the correct conversation Id
   conversations: UserConversation[];
}

const initialState: ChatState = {
   showLoading: false,
   conversations: [],
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
        }   
    }
});

export const { 
    updateShowLoading,
    updateConversations,
} = chatSlice.actions;
export default chatSlice.reducer; // Ensure this exports the reducer
