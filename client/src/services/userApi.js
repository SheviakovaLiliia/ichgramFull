import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./config";
import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => `/user/get/me`,
      providesTags: ["CurrentUser"],
      keepUnusedDataFor: 120, //2 min
    }),
    getUser: builder.query({
      query: (username) => `/user/${username}`,
      providesTags: ["User"],
    }),
    getUsersForSearch: builder.query({
      query: () => `/user`,
    }),
    addUserToSearch: builder.mutation({
      query: (credentials) => ({
        url: `/user/add-to-search`,
        method: "POST",
        body: { username: credentials },
      }),
      invalidatesTags: ["CurrentUser"],
    }),
    editProfile: builder.mutation({
      query: ({ username, credentials }) => ({
        url: `/user/${username}/edit`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["CurrentUser"], // editProfile
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled; //waiting result
          dispatch(userApi.endpoints.getMe.initiate()); // start getMe
        } catch (err) {
          console.error("Failed to update: ", err);
        }
      },
    }),
    followUser: builder.mutation({
      query: (username) => ({
        url: `/user/follow/${username}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["CurrentUser"],
      async onQueryStarted(username, { dispatch, queryFulfilled }) {
        const patchResults = [
          dispatch(
            api.util.updateQueryData("getUser", username, (draft) => {
              draft.isFollowedByOwner = !draft.isFollowedByOwner;
              draft.followers_count += 1;
            })
          ),
          dispatch(
            api.util.updateQueryData("getMe", username, (draft) => {
              draft.followings_count += 1;
            })
          ),
        ];
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to follow user:", error);

          patchResults.forEach((patchResult) => patchResult.undo());
        }
      },
    }),

    unfollowUser: builder.mutation({
      query: (username) => ({
        url: `/user/unfollow/${username}`,
        method: "DELETE",
        body: {},
      }),
      invalidatesTags: ["CurrentUser"],

      async onQueryStarted(username, { dispatch, queryFulfilled }) {
        const patchResults = [
          dispatch(
            api.util.updateQueryData("getUser", username, (draft) => {
              draft.isFollowedByOwner = !draft.isFollowedByOwner;
              draft.followers_count -= 1;
            })
          ),
          dispatch(
            api.util.updateQueryData("getMe", null, (draft) => {
              draft.followings_count -= 1;
            })
          ),
        ];
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to follow user:", error);

          patchResults.forEach((patchResult) => patchResult.undo());
        }
      },
    }),
    // getChat: builder.query({
    //   query: (username) => ({
    //     url: `/messages/get_chat`,
    //     method: "POST",
    //     body: username,
    //   }),

    // }),
    // getUserChats: builder.query({
    //   query: () => `/messages/get_user_chats`,
    // }),
  }),
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useEditProfileMutation,
  useGetUsersForSearchQuery,
  useAddUserToSearchMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetChatQuery,
  useGetUserChatsQuery,
} = userApi;
