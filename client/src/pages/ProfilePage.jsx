import s from "./Pages.module.scss";
import { scrollUp } from "../assets";
import { Layout } from "../layouts";
import { ProfileInfo } from "../components";
import { useState, useEffect, useContext } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useGetMeQuery, useGetUserQuery } from "../services/userApi";
import { useGetUserPostsQuery } from "../services/postApi";
import { PostModal } from "../components";
import PostImageSkeleton from "../components/Skeletons/PostImageSkeleton";
import ProfileInfoSkeleton from "../components/Skeletons/ProfileInfoSkeleton";
import equal from "deep-equal";
import InfiniteScroll from "react-infinite-scroll-component";
import { navContext } from "../context/navContext";
import toast, { Toaster } from "react-hot-toast";
import { useProfile } from "../customHooks/userHooks";

export const ProfilePage = () => {
  const location = useLocation();
  const {
    user,
    posts,
    displayedPosts,
    isLoadingMe,
    isLoadingUser,
    isFetchingMe,
    isFetchingUser,
    errorMe,
    errorPosts,
    errorUser,
    fetchMoreData,
  } = useProfile();

  if (isLoadingMe || isLoadingUser) return <p className="loaderS"></p>;
  if (isFetchingMe || isFetchingUser)
    return <p className="loaderS">Fetching...</p>;

  if (errorMe || errorUser || errorPosts) toast.error("Something went wrong..");
  if (errorMe || errorUser || errorPosts) return <p>Something went wrong...</p>;

  return (
    <Layout>
      <main className={s.profilePage}>
        {location.pathname.split("/")[0] === "post" && <PostModal />}
        <div className={s.profilePageContent}>
          {/* <ProfileInfoSkeleton /> */}
          {user && <ProfileInfo user={user} />}

          {posts && (
            <InfiniteScroll
              dataLength={displayedPosts.length}
              next={fetchMoreData}
              hasMore={displayedPosts.length < posts?.length}
              loader={<PostImageSkeleton />}
              className={s.postsProfile}
            >
              {displayedPosts.map((post, index) => (
                <Link
                  key={index}
                  to={`/post/${post._id}`}
                  state={{ backgroundLocation: location }}
                  className={s.postLinkProfile}
                >
                  <img
                    className={s.postImgProfile}
                    key={post._id}
                    src={post.image}
                    alt="post"
                  />
                </Link>
              ))}
            </InfiniteScroll>
          )}
        </div>
      </main>
      <img
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="scrollUp"
        src={scrollUp}
        alt="scroll up"
      />
      <Toaster />
    </Layout>
  );
};
