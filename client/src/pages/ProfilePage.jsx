import s from "./Pages.module.scss";
import { scrollUp } from "../assets";
import { Layout } from "../layouts";
import { ProfileInfo } from "../components";
import { Link, useLocation } from "react-router-dom";
import { PostModal } from "../components";
import PostImageSkeleton from "../components/Skeletons/PostImageSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
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
    hasMore,
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

          {posts && posts?.length > 0 && (
            <InfiniteScroll
              dataLength={displayedPosts.length}
              next={fetchMoreData}
              // hasMore={displayedPosts.length < posts?.length}
              hasMore={hasMore}
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
