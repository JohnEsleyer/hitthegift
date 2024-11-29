import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Friend } from "../types/friend";
import { FriendRequestServerResponse } from "../types/friendrequest";

export interface FriendsSidebarState {
  toDeleteFriend: string; // ID of friend
  toDeleteFriendRequest: string; // ID of FriendRequest record
  isSidebarOpen: boolean; // used at products section, disable clicking of products while friends sidebar is open
  
  friends: Friend[];
  friendRequests: FriendRequestServerResponse[];
  friendRequestsReceiver: FriendRequestServerResponse[];
  friendRequestsSender: FriendRequestServerResponse[];
}

const initialState: FriendsSidebarState = {
  toDeleteFriend: "",
  toDeleteFriendRequest: "",
  isSidebarOpen: true,
  friends: [],
  friendRequests: [],
  friendRequestsReceiver: [],
  friendRequestsSender: [],
};

const friendsSidebarSlice = createSlice({
  name: "friendlistpage",
  initialState,
  reducers: {
    updateToDeleteFriend: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        toDeleteFriend: action.payload,
      };
    },
    updateToDeleteFriendRequest: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        toDeleteFriendRequest: action.payload,
      };
    },
    updateIsSidebarOpen: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isSidebarOpen: action.payload,
      };
    },
    updateFriends: (state, action: PayloadAction<Friend[]>) => {
      return {
        ...state,
        friends: action.payload,
      };
    },
    updateFriendRequests: (
      state,
      action: PayloadAction<FriendRequestServerResponse[]>
    ) => {
      return {
        ...state,
        friendRequests: action.payload,
      };
    },
    insertFriendRequest: (
      state,
      action: PayloadAction<FriendRequestServerResponse>
    ) => {
      // Check for existing friend request to avoid duplicates.
      if (
        state.friendRequests.some((request) => request.id == action.payload.id)
      ) {
        return;
      }

      return {
        ...state,
        friendRequests: [...state.friendRequests, action.payload],
      };
    },
    updateFriendRequestsReceiver: (
      state,
      action: PayloadAction<FriendRequestServerResponse[]>
    ) => {
      return {
        ...state,
        friendRequestsReceiver: action.payload,
      };
    },
    updateFriendRequestsSender: (
      state,
      action: PayloadAction<FriendRequestServerResponse[]>
    ) => {
      return {
        ...state,
        friendRequestsSender: action.payload,
      };
    },
    deleteAllFriendRequestsSender: (state) => {
      return {
        ...state,
        friendRequestsSender: [],
      };
    },
    deleteAllFriendRequests: (state) => {
      return {
        ...state,
        friendRequests: [],
      };
    },
    deleteAllFriendRequestsReceiver: (state) => {
      return {
        ...state,
        friendRequestsReceiver: [],
      };
    },

    deleteFriendRequestForFriendsSidebar: (
      state,
      action: PayloadAction<string>
    ) => {
      console.log("Entering deleteFriendRequestForFriendsSidebar reducer");
      console.log("Action payload (friendRequestId):", action.payload);
      console.log("State before update:", state);

      const updatedState = {
        ...state,
        friendRequests: state.friendRequests?.filter((request) => {
          const shouldKeep = request.id !== action.payload;
          console.log(
            `Filtering friendRequests: Keeping request with ID ${request.id}? ${shouldKeep}`
          );
          return shouldKeep;
        }),
        friendRequestsReceiver: state.friendRequestsReceiver.filter(
          (request) => {
            const shouldKeep = request.id !== action.payload;
            console.log(
              `Filtering friendRequestsReceiver: Keeping request with ID ${request.id}? ${shouldKeep}`
            );
            return shouldKeep;
          }
        ),
        friendRequestsSender: state.friendRequestsSender.filter((request) => {
          const shouldKeep = request.id !== action.payload;
          console.log(
            `Filtering friendRequestsSender: Keeping request with ID ${request.id}? ${shouldKeep}`
          );
          return shouldKeep;
        }),
      };

      console.log("Updated state:", updatedState);
      return updatedState;
    },
  },
});

export const {
  updateToDeleteFriend,
  updateToDeleteFriendRequest,
  updateIsSidebarOpen,
  updateFriends,
  updateFriendRequests,
  updateFriendRequestsReceiver,
  updateFriendRequestsSender,
  insertFriendRequest,
  deleteFriendRequestForFriendsSidebar,
  deleteAllFriendRequestsSender,
  deleteAllFriendRequestsReceiver,
  deleteAllFriendRequests,
} = friendsSidebarSlice.actions;
export default friendsSidebarSlice.reducer; // Ensure this exports the reducer
