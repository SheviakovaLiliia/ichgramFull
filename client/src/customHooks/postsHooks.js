import { useEffect, useState, useContext } from "react";
import {
  useLazyGetFollowedPostsQuery,
  useLazyGetRandomPostsQuery,
  useSearchPostsQuery,
} from "../services/postApi";
import { useGetMeQuery } from "../services/userApi";
import { navContext } from "../context/navContext";
import toast from "react-hot-toast";

export const useGetHomePage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { data: user, isLoading } = useGetMeQuery();
  const { setNavState, setIsNavModalOpen } = useContext(navContext);

  const [
    fetchFollowedPosts,
    { isLoading: isLoadingF, isFetching: isFetchingF, error },
  ] = useLazyGetFollowedPostsQuery();

  // console.log(user);

  const openSearch = () => {
    setNavState("s");
    setIsNavModalOpen(true);
  };

  const fetchPosts = async () => {
    try {
      const newPosts = await fetchFollowedPosts(page, {
        skip: posts.length > 0 && page === 1,
      }).unwrap();
      if (newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setPage(page + 1);
        if (newPosts.length < 4) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // console.log(posts);

  return {
    posts,
    hasMore,
    user,
    isLoading,
    fetchPosts,
    openSearch,
    isLoadingF,
    isFetchingF,
    error,
  };
};

export const useGetExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [hasMore, setHasMore] = useState(true);

  const { data: postsForSearch = 0, error: errorS } = useSearchPostsQuery({
    skip: !isMobile,
  });
  const [fetchRandomPosts, { isFetching }] = useLazyGetRandomPostsQuery();

  const [matchingPosts, setMatchingPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e) => {
    if (postsForSearch && postsForSearch.length > 0) {
      setSearchInput(e.target.value);
      if (e.target.value?.length < 1) {
        setMatchingPosts([]);
        setSearchInput("");
        return;
      }
      const regex = new RegExp(e.target.value, "i");
      const filtered = postsForSearch.filter((post) =>
        regex.test(post.content)
      );

      setMatchingPosts(filtered);
    }
  };

  const resetSerchInput = () => {
    setSearchInput("");
    setMatchingPosts([]);
  };

  const fetchPosts = async () => {
    try {
      const count = window.innerWidth > 768 ? "10" : "4";
      const timestamp = Date.now();

      const newPosts = await fetchRandomPosts(
        `${count}&t=${timestamp}`
      ).unwrap();

      if (newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, newPosts]);
        if (!isMobile && newPosts.length < 10) setHasMore(false);
        if (isMobile && newPosts.length < 4) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      toast.error("Couldn't get posts");
      console.error("Error fetching posts:", error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // console.log(posts);

  return {
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
  };
};
