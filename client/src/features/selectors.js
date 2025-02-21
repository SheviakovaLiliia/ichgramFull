// import { createSelector } from "@reduxjs/toolkit";
// import { commentsAdapter } from "../services/postApi";
// import { postApi } from "../services/postApi";

// export const selectComments = (postId) => {
//   return createSelector(
//     (state) => state.postApi?.queries || {}, // Безопасная проверка наличия postApi и queries
//     (queries) => {
//       const queryData = queries[`getComments(${postId})`]?.data;
//       return queryData
//         ? commentsAdapter.getSelectors().selectAll(queryData)
//         : [];
//     }
//   );
// };
