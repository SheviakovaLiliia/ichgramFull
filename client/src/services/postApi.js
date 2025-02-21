import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./config";
import { userApi } from "./userApi";
// import { unLikeComment } from "../api/api";
import { api } from "./api";
import { createEntityAdapter } from "@reduxjs/toolkit";

export const commentsAdapter = createEntityAdapter({
  selectId: (comment) => comment._id, // Use `_id` as the unique identifier
});
export const initialState = commentsAdapter.getInitialState();

// export const {
//   selectAll: selectAllComments,
//   selectById: selectCommentById,
//   selectIds: selectCommentIds,
// } = commentsAdapter.getSelectors((state) => state.comments);

export const postApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query({
      query: (postId) => `/post/${postId}`,
      providesTags: (result, error, postId) => [{ type: "Post", id: postId }],
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        try {
          await dispatch(postApi.endpoints.getComments.initiate(postId));
        } catch (err) {
          console.error("Failed to load comments: ", err);
        }
      },
    }),
    getUserPosts: builder.query({
      query: (username) => `/post/get/${username}`,
      providesTags: ["UserPosts"],
    }),
    getRandomPosts: builder.query({
      query: (count) => `/post/get/random?count=${count}`,
    }),
    getFollowedPosts: builder.query({
      query: (page) => `/post/get/followed?page=${page}`,
      keepUnusedDataFor: 120,
    }),
    searchPosts: builder.query({
      query: () => `/post/search/get-posts`,
    }),
    createPost: builder.mutation({
      query: (post) => ({
        url: `/post/create`,
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["UserPosts"],
      // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      //   try {
      //     await queryFulfilled; //waiting result
      //     dispatch(userApi.endpoints.getMe.initiate()); // start getMe
      //   } catch (err) {
      //     console.error("Failed to update: ", err);
      //   }
      // },
    }),
    updatePost: builder.mutation({
      query: ({ postId, credentials }) => ({
        url: `/post/${postId}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
      ],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/post/${postId}`,
        method: "DELETE",
        body: {},
      }),
      invalidatesTags: ["UserPosts"],
    }),
    //new mutations
    addComment: builder.mutation({
      query: ({ postId, credentials }) => ({
        url: `/comment/add/${postId}`,
        method: "POST",
        body: credentials,
      }),
      //adding new comment locally
      async onQueryStarted(
        { postId, credentials },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResult = dispatch(
          api.util.updateQueryData("getPost", postId, (draft) => {
            draft.comment_count += 1;
          })
        );

        try {
          const { data: newComment } = await queryFulfilled;

          dispatch(
            postApi.util.updateQueryData("getComments", postId, (draft) => {
              draft.ids.unshift(newComment._id);

              draft.entities[newComment._id] = newComment;
            })
          );
        } catch (error) {
          patchResult.undo();
          console.error("Failed to add comment:", error);
        }
      },
    }),
    likePost: builder.mutation({
      query: (postId) => ({
        url: `/post/like/${postId}`,
        method: "POST",
        body: {},
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData("getPost", postId, (draft) => {
            draft.like_count += 1;
            draft.isLikedByUser = !draft.isLikedByUser;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    unlikePost: builder.mutation({
      query: (postId) => ({
        url: `/post/unlike/${postId}`,
        method: "DELETE",
        body: {},
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData("getPost", postId, (draft) => {
            draft.like_count -= 1;
            draft.isLikedByUser = !draft.isLikedByUser;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    //comments part
    getComments: builder.query({
      query: (postId) => `/post/get/${postId}/comments`,
      transformResponse(response) {
        return commentsAdapter.addMany(
          commentsAdapter.getInitialState(),
          response
        );
      },
    }),
    likeComment: builder.mutation({
      query: ({ commentId }) => ({
        url: `/comment/like/${commentId}`,
        method: "POST",
        body: {},
      }),
      async onQueryStarted(
        { commentId, postId },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          postApi.util.updateQueryData("getComments", postId, (draft) => {
            const comment = draft.entities[commentId];
            if (comment) {
              comment.like_count += 1;
              comment.isLikedByUser = true;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error("Error liking comment: ", error);
        }
      },
    }),
    unLikeComment: builder.mutation({
      query: ({ commentId }) => ({
        url: `/comment/unlike/${commentId}`,
        method: "DELETE",
        body: {},
      }),
      async onQueryStarted(
        { commentId, postId },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          postApi.util.updateQueryData("getComments", postId, (draft) => {
            const comment = draft.entities[commentId];
            if (comment) {
              comment.like_count -= 1;
              comment.isLikedByUser = false;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error("Error unliking comment: ", error);
        }
      },
    }),
    deleteComment: builder.mutation({
      query: ({ commentId }) => ({
        url: `/comment/${commentId}`,
        method: "DELETE",
        body: {},
      }),
      async onQueryStarted(
        { commentId, postId },
        { dispatch, queryFulfilled }
      ) {
        const patchResults = [
          dispatch(
            postApi.util.updateQueryData("getComments", postId, (draft) => {
              commentsAdapter.removeOne(draft, commentId);
            })
          ),
          dispatch(
            postApi.util.updateQueryData("getPost", postId, (draft) => {
              if (draft.comment_count > 0) {
                draft.comment_count -= 1;
              }
            })
          ),
        ];

        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to delete comment:", error);
          patchResults.forEach((patchResult) => patchResult.undo());
        }
      },
    }),
  }),
});



export const {
  useGetPostQuery,
  useLazyGetPostQuery,
  useGetRandomPostsQuery,
  useLazyGetRandomPostsQuery,
  useLazyGetFollowedPostsQuery,
  useLikeFollowedPostMutation,
  useUnLikeFollowedPostMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
  useAddCommentMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useLikeCommentMutation,
  useUnLikeCommentMutation,
  useDeletePostMutation,
  useGetFollowedPostQuery,
  useLazyGetFollowedPostQuery,
  useGetCommentsQuery,
  useDeleteCommentMutation,
  useGetUserPostsQuery,
  useSearchPostsQuery,
} = postApi;


