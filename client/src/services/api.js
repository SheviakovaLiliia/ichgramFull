import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "./baseQueryWithReauth";

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "AuthCheck",
    "CurrentUser",
    "User",
    "Post",
    "UserPosts",
    "ChatList",
  ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `/auth/login`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["AuthCheck"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled; //waiting result
          localStorage.setItem("isLoggedIn", "t");
        } catch (err) {
          console.error(err);
        }
      },
    }),
    authCheck: builder.query({
      query: () => `/auth/auth-check`,
      providesTags: ["AuthCheck"],
      keepUnusedDataFor: 3540, //59 min
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          const refreshLoop = async () => {
            setTimeout(async () => {
              // Checking if user online
              if (navigator.onLine && document.visibilityState === "visible") {
                try {
                  await dispatch(
                    api.endpoints.refreshToken.initiate()
                  ).unwrap();
                  refreshLoop();
                } catch (err) {
                  console.error("Error refreshing token:", err);
                }
              } else {
                console.log("Token isn't refreshed");
                refreshLoop(); //waiting another 30min
              }
            }, 3480000); // 58 min
          };

          refreshLoop();
        } catch (err) {
          console.error(err);
        }
      },
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
        credentials: "include",
      }),
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: `/auth/register`,
        method: "POST",
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/auth/logout`,
        method: "POST",
      }),
      invalidatesTags: ["AuthCheck"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled; //waiting result
          localStorage.setItem("isLoggedIn", "f");
        } catch (err) {
          console.error(err);
        }
      },
    }),
    resetPassword: builder.mutation({
      query: (emailOrUsername) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: emailOrUsername,
      }),
    }),
    resetPasswordStep2: builder.mutation({
      query: (passwordData) => ({
        url: `/auth/reset-password/step2`,
        method: "POST",
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useAuthCheckQuery,
  useRegisterUserMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useResetPasswordStep2Mutation,
} = api;
