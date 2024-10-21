import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FriendsSidebarState {
    toDeleteFriend: string; // ID of friend
    toDeleteFriendRequest:string; // ID of FriendRequest record
    isSidebarOpen: boolean; // used at products section, disable clicking of products while friends sidebar is open
}

const initialState: FriendsSidebarState = {
   toDeleteFriend: '',
   toDeleteFriendRequest: '',
   isSidebarOpen: true,
};

const friendsSidebarSlice = createSlice({
    name: 'friendlistpage',
    initialState,
    reducers: {
        updateToDeleteFriend: (state, action: PayloadAction<string>) => {
            return {
                ...state, 
                toDeleteFriend: action.payload,
            }
        },
        updateToDeleteFriendRequest: (state, action: PayloadAction<string>) => {
            return {
                ...state, 
                toDeleteFriendRequest: action.payload,
            }
        },
        updateIsSidebarOpen: (state, action: PayloadAction<boolean>)=> {
            return {
                ...state,
                isSidebarOpen: action.payload,
            }
        }
    }
});

export const { updateToDeleteFriend, updateToDeleteFriendRequest, updateIsSidebarOpen } = friendsSidebarSlice.actions;
export default friendsSidebarSlice.reducer; // Ensure this exports the reducer
