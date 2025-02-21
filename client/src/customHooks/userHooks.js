import { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {
  useGetMeQuery,
  useGetUserQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useEditProfileMutation,
} from "../services/userApi";
import { useGetUserPostsQuery } from "../services/postApi";
import { navContext } from "../context/navContext";
import toast, { Toaster } from "react-hot-toast";
import { useLogoutMutation } from "../services/api";
import { useDispatch } from "react-redux";
import { chatApi } from "../services/chatApi";
import { useForm } from "react-hook-form";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export const useProfile = () => {
  const { username } = useParams();
  const {
    data: me,
    isLoading: isLoadingMe,
    isFetching: isFetchingMe,
    error: errorMe,
  } = useGetMeQuery();
  const {
    data: userData,
    isLoading: isLoadingUser,
    isFetching: isFetchingUser,
    error: errorUser,
  } = useGetUserQuery(username, {
    skip: !username || username === me?.username,
  });
  const {
    data: posts,
    isLoading: isLoadingPosts,
    isFetching: isFetchingPosts,
    error: errorPosts,
  } = useGetUserPostsQuery(username);

  const { navState } = useContext(navContext);
  const isMobile = window.innerWidth <= 768;

  const isOwner = me?.username === username;
  const user = isOwner ? me : userData;

  console.log(user);

  //   console.log(userData);

  const [page, setPage] = useState(1);
  const postsPerPage = isMobile ? 4 : 12;
  const [displayedPosts, setDisplayedPosts] = useState([]);

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);

  // useEffect(() => {
  //   if (posts) {
  //     setDisplayedPosts(posts.slice(0, postsPerPage));
  //   }
  // }, [posts, location.pathname, navState]);

  // const fetchMoreData = () => {
  //   const nextPosts = posts.slice(
  //     page * postsPerPage,
  //     (page + 1) * postsPerPage
  //   );
  //   setDisplayedPosts((prev) => [...prev, ...nextPosts]);
  //   setPage(page + 1);
  // };

  useEffect(() => {
    if (posts?.length) {
      const newPosts = posts?.slice(0, postsPerPage);
      setDisplayedPosts(newPosts);
      setHasMore(newPosts.length < posts.length);
    }
  }, [posts]);

  const fetchMoreData = () => {
    const nextPosts = posts.slice(
      page * postsPerPage,
      (page + 1) * postsPerPage
    );

    if (nextPosts.length === 0) {
      setHasMore(false);
      return;
    }

    setDisplayedPosts((prev) => [...prev, ...nextPosts]);
    setPage((prev) => prev + 1);
  };

  const handleFollowClick = async () => {
    try {
      user?.isFollowedByOwner
        ? await unfollowUser(user.username).unwrap()
        : await followUser(user.username).unwrap();
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out user: ", error);
    }
  };

  const handlePrefetchChat = (username) => {
    dispatch(chatApi.util.prefetch("getChatInfo", username, { force: true }));
  };

  return {
    user,
    posts,
    displayedPosts,
    isLoadingMe,
    isLoadingUser,
    isLoadingPosts,
    isFetchingMe,
    isFetchingPosts,
    isFetchingUser,
    errorMe,
    errorPosts,
    errorUser,
    fetchMoreData,
    handleFollowClick,
    handleLogout,
    handlePrefetchChat,
    hasMore,
  };
};

// export const useProfilee = () => {
//   const { username } = useParams();
//   const { data: me } = useGetMeQuery();
//   const { data: userData } = useGetUserQuery(username, {
//     skip: !username || username === me?.username,
//   });
//   const { data: posts = [] } = useGetUserPostsQuery(username);

//   const isOwner = me?.username === username;
//   const user = isOwner ? me : userData;

//   const [page, setPage] = useState(1);
//   const postsPerPage = window.innerWidth <= 768 ? 4 : 12;
//   const [displayedPosts, setDisplayedPosts] = useState([]);
//   const [hasMore, setHasMore] = useState(true);

//   useEffect(() => {
//     if (posts.length) {
//       const newPosts = posts.slice(0, postsPerPage);
//       setDisplayedPosts(newPosts);
//       setHasMore(newPosts.length < posts.length);
//     }
//   }, [posts]);

//   const fetchMoreData = () => {
//     const nextPosts = posts.slice(page * postsPerPage, (page + 1) * postsPerPage);

//     if (nextPosts.length === 0) {
//       setHasMore(false);
//       return;
//     }

//     setDisplayedPosts((prev) => [...prev, ...nextPosts]);
//     setPage((prev) => prev + 1);
//   };

//   return { user, displayedPosts, hasMore, fetchMoreData };
// };

export const useEditProfile = () => {
  const [cropData, setCropData] = useState(null);
  const cropperRef = useRef(null);
  const navigate = useNavigate();
  const [showCropper, setShowCropper] = useState(false);

  const { data: user, isLoading, isFetching } = useGetMeQuery();
  const [
    editProfile,
    { isLoading: isLoadingUpdating, error: errorUpdating, isSuccess },
  ] = useEditProfileMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      website: user?.bio_website || "",
      about: user?.bio || "",
      profileImage: null,
    },
  });

  const [preview, setPreview] = useState(user?.profile_image || null);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be smaller than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const cropImage = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        croppedCanvas.toBlob((blob) => {
          setCropData(URL.createObjectURL(blob));
          setValue("profileImage", [blob], {
            shouldValidate: true,
            shouldDirty: true,
          });
          trigger("profileImage");
          setShowCropper(false);
        }, "image/jpeg");
      }
    }
  };

  const onSubmit = async (data) => {
    let toastId;
    try {
      console.log(data);
      toastId = toast.loading("Updating profile...");
      const formData = new FormData();
      if (data.profileImage) {
        formData.append("image", data.profileImage[0]);
      }

      formData.append("newUsername", data.username);
      formData.append("website", data.website);
      formData.append("bio", data.about);

      await editProfile({ username: user.username, credentials: formData });
      toast.success("Edited profile successfully", { id: toastId });
      navigate(-1);
    } catch (error) {
      toast.error("Something went wrong while updating profile", {
        id: toastId,
      });
      console.error("Failed to edit profile: ", error);
    }
  };

  return {
    cropData,
    register,
    handleSubmit,
    watch,
    errors,
    showCropper,
    isLoading,
    isFetching,
    preview,
    isLoadingUpdating,
    errorUpdating,
    isSuccess,
    handleFileChange,
    cropImage,
    onSubmit,
    user,
    cropperRef,
    setShowCropper,
    setPreview,
  };
};
