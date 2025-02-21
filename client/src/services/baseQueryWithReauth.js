import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./config";
import { api as mainApi } from "./api";

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && [401, 403].includes(result.error.status)) {
    console.error("Authentication failed, loging user out...");

    if (
      !["/login", "/reset", "/register"].includes(
        window.location.pathname.split("-")[0]
      )
    ) {
      await api.dispatch(mainApi.endpoints.logout.initiate());
      window.location.href = "/login";
    }
  }
  return result;
};

export default baseQueryWithReauth;
