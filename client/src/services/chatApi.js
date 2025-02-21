import { api } from "./api";

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserChats: builder.query({
      query: () => `/messages/get_user_chats`,
      providesTags: "ChatList",
    }),
    getChatInfo: builder.query({
      query: (username) => ({
        url: `/messages/get_chat`,
        method: "POST",
        body: { username },
      }),
      invalidatesTags: ["ChatList"],
      async onQueryStarted(username, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled; //waiting result
          dispatch(chatApi.endpoints.getMessages.initiate(username));
        } catch (err) {
          console.error("Failed to update: ", err);
        }
      },
    }),
    getMessages: builder.query({
      query: (username) => `/messages/get_messages/${username}`,
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useGetChatInfoQuery,
  useGetUserChatsQuery,
} = chatApi;
