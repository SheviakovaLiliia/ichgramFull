import s from "./Pages.module.scss";
import { Layout } from "../layouts";
import { scrollUp, searchReset } from "../assets";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useLocation } from "react-router-dom";
import { PostModal } from "../components";
import toast, { Toaster } from "react-hot-toast";
import { useGetExplorePage } from "../customHooks/postsHooks";

export const ExplorePage = () => {
  const location = useLocation();
  const {
    posts,
    isMobile,
    hasMore,
    matchingPosts,
    searchInput,
    resetSerchInput,
    isFetching,
    errorS,
    handleSearch,
    fetchPosts,
  } = useGetExplorePage();

  if (errorS) toast.error("Couldn't get posts for searching");
  if (isFetching && posts.length === 0)
    return <div className="loaderS">Loading...</div>;

  return (
    <Layout>
      <main className={s.explorePage}>
        {location.pathname.split("/")[0] === "post" && <PostModal />}
        {isMobile && (
          <>
            <form className={s.searchForm}>
              <input
                value={searchInput}
                onChange={(e) => handleSearch(e)}
                className={s.searchInput}
                placeholder="Search"
                type="text"
              />
              <img
                className={s.searchReset}
                src={searchReset}
                alt="remove search value"
                onClick={resetSerchInput}
              />
            </form>
            {matchingPosts?.length > 0 && (
              <div className={s.postExploreFlex}>
                {matchingPosts?.map((post) => (
                  <Link
                    key={post._id}
                    to={`/post/${post._id}`}
                    state={{ backgroundLocation: location }}
                    className={s.postImgContainer}
                  >
                    <img
                      src={post?.image}
                      alt={post._id}
                      className={s.postImg}
                    />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
        {matchingPosts.length === 0 && (
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchPosts}
            hasMore={hasMore}
            loader={<div className="loaderE"></div>}
            className={s.exploreScroller}
          >
            {posts.map((postsTable, ind) => (
              <div
                key={ind}
                className={!isMobile ? s.postsExploreGrid : s.postExploreFlex}
              >
                {postsTable.map((post, index) => (
                  <div
                    className={!isMobile ? `post${index + 1}` : ""}
                    key={index}
                  >
                    <Link
                      to={`/post/${post._id}`}
                      state={{ backgroundLocation: location }}
                      className={
                        !isMobile ? s.explorePostLink : s.postImgContainer
                      }
                    >
                      <img
                        className={s.postImg}
                        src={post.image}
                        alt={`Post ${index}`}
                      />
                    </Link>
                  </div>
                ))}
              </div>
            ))}
          </InfiniteScroll>
        )}
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
