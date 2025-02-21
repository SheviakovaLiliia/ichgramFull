import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ResetPage,
  ProfilePage,
  EditProfilePage,
  ChatPage,
  ExplorePage,
  PostPage,
  NotFoundPage,
  ResetPassPage,
} from "../pages";
import { PostModal, Messages } from "../components";
import { ProtectedRoute, AuthRoute } from "../routes";

import { navContext } from "../context/navContext";

export const MainRoute = () => {
  const location = useLocation();
  const state = location.state;
  const [navState, setNavState] = useState("");
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);

  return (
    <>
      <navContext.Provider
        value={{ navState, setNavState, isNavModalOpen, setIsNavModalOpen }}
      >
        <Routes location={state?.backgroundLocation || location}>
          {/* public routes */}
          <Route element={<AuthRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset" element={<ResetPage />} />
            <Route path="/reset-password/:token" element={<ResetPassPage />} />
          </Route>
          {/* protected routes */}

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route
              path="/profile/:username/edit"
              element={<EditProfilePage />}
            />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/messages" element={<ChatPage />} />
            <Route path="/post/:postId" element={<PostPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/messages" element={<ChatPage />}>
              <Route path=":username" element={<Messages />} />
            </Route>
          </Route>
        </Routes>
        {/* <Routes>
          <Route path="/reset-password/:token" element={<ResetPassPage />} />
        </Routes> */}
        {state?.backgroundLocation && (
          <Routes>
            <Route path="/post/:postId" element={<PostModal />} />
          </Routes>
        )}
      </navContext.Provider>
    </>
  );
};
