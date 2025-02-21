import { api } from "./api";
import { createEntityAdapter } from "@reduxjs/toolkit";

export const notificationsAdapter = createEntityAdapter({
  selectId: (n) => n._id,
});
export const initialState = notificationsAdapter.getInitialState();

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => `/notifications`,
      transformResponse(response) {
        return notificationsAdapter.addMany(
          notificationsAdapter.getInitialState(),
          response
        );
      },
    }),
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "DELETE",
        body: {},
      }),
      async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData(
            "getNotifications",
            undefined,
            (draft) => {
              notificationsAdapter.removeOne(draft, notificationId);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to delete notification:", error);
          patchResult.undo();
        }
      },
    }),
    deleteNotifications: builder.mutation({
      query: () => ({
        url: `/notifications/delete/all`,
        method: "DELETE",
        body: {},
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData(
            "getNotifications",
            undefined,
            (draft) => {
              notificationsAdapter.removeAll(draft);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to delete notification:", error);
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useDeleteNotificationsMutation,
} = notificationApi;
