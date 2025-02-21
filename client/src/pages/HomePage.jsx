import s from "./Pages.module.scss";
import { Layout } from "../layouts";
import { checked, search, scrollUp } from "../assets";
import { PostCard, PostModal } from "../components";
import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import SidebarSkeleton from "../components/Skeletons/SidebarSkeleton";
import { SkeletonsGrid } from "../components/Skeletons/SkeletonsGrid";
import PostCardSkeleton from "../components/Skeletons/PostCardSkeleton";
import toast, { Toaster } from "react-hot-toast";
import { useGetHomePage } from "../customHooks/postsHooks";

export const HomePage = () => {
  const location = useLocation();
  const {
    posts,
    hasMore,
    user,
    isLoading,
    fetchPosts,
    openSearch,
    isLoadingF,
    isFetchingF,
    error,
  } = useGetHomePage();

  if (error) toast.error("Error fetching posts...");

  if (error)
    return (
      <div>
        <Toaster />
      </div>
    );
  if (isLoading) return <SidebarSkeleton />;

  return (
    <Layout>
      <main className={s.homePage}>
        {isLoadingF && posts.length === 0 && <SkeletonsGrid />}
        {isFetchingF && posts.length === 0 && <SkeletonsGrid />}
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPosts}
          hasMore={hasMore}
          loader={<PostCardSkeleton />}
          className={s.homeScroller}
          style={{
            display: user?.followings?.length === 0 ? "none" : "grid",
          }}
        >
          {posts?.map((post, ind) => (
            <PostCard key={ind} postId={post?._id} />
          ))}
        </InfiniteScroll>

        {user?.followings?.length > 0 && !hasMore && (
          <div className={s.updatesMsgHome}>
            <img src={checked} alt="sign" />
            <h3>You&apos;ve seen all the updates</h3>
            <p>You have viewed all new publications</p>
          </div>
        )}
        {user?.followings?.length === 0 && (
          <div className={s.searchMsg}>
            <h3>You don&apos;t have any followings yet</h3>
            <p onClick={openSearch}>Search users</p>
            <img onClick={openSearch} src={search} alt="" />
          </div>
        )}
        {location.pathname.split("/")[0] === "post" && <PostModal />}
      </main>
      {document.body.scrollHeight > window.innerHeight && (
        <img
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="scrollUp"
          src={scrollUp}
          alt="scroll up"
        />
      )}
    </Layout>
  );
};
