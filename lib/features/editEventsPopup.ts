import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ServerResponseForEvents } from '../types/event';
import { Friend } from '../types/friend';

export interface EditEventPopupState {
   id: string; // 
   eventTitle: string;
   date: string;
   userId: string;
   invitedFriends: Friend[];
}

const initialState: EditEventPopupState = {
   id: '',
   eventTitle: '',
   date: '',
   userId: '',
   invitedFriends: [],
};

const editEventPopupSlice = createSlice({
    name: 'EditEventPopup',
    initialState,
    reducers: {
        updateEditEventAll: ( state, action: PayloadAction<ServerResponseForEvents>) => {
            return {
                id: action.payload.id,
                eventTitle: action.payload.eventTitle,
                date: action.payload.date,
                userId: action.payload.userId,
                invitedFriends: action.payload.invitedFriends,
            };
        },
        updateEditEventTitle: (state, action:PayloadAction<string>) => {
            return {
                ...state,
                eventTitle: action.payload,
            }
        },
        updateEditEventDate: (state, action:PayloadAction<string>) => {
            return {
                ...state,
                date: action.payload,
            }
        },
        updateEditEventUserId: (state, action:PayloadAction<string>) => {
            return {
                ...state,
                userId: action.payload,
            }
        },
        updateEditEventInvitedFriends: (state, action:PayloadAction<Friend[]>) => {
            return {
                ...state,
                invitedFriends: action.payload,
            }
        },

    }
});

export const { 
    updateEditEventAll,
    updateEditEventTitle,
    updateEditEventDate,
    updateEditEventUserId,
    updateEditEventInvitedFriends,
} = editEventPopupSlice.actions;
export default editEventPopupSlice.reducer; // Ensure this exports the reducer
