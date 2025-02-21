import s from "./Layout.module.scss";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import Avatar from "react-avatar";
import {
  home,
  homeFill,
  search,
  searchFill,
  explore,
  exploreFill,
  messages,
  messagesFill,
  notificationsIcon,
  notificationsIconFill,
  create,
  logo,
} from "../assets";
import equal from "deep-equal";
import { useGetMeQuery } from "../services/userApi";
import { useContext } from "react";
import { navContext } from "../context/navContext";
import { isProfileActive } from "../utils/navUtils";
import SidebarSkeleton from "../components/Skeletons/SidebarSkeleton";

export const SideBar = () => {
  const { navState, setNavState, setIsNavModalOpen } = useContext(navContext);
  const { data: user, isLoading } = useGetMeQuery();

  if (isLoading) return <SidebarSkeleton />;

  return (
    <div className={s.nav}>
      <div className={s.menu}>
        <img src={logo} alt="logo" className={s.logo} />
        <nav className={s.navigation}>
          <NavLink
            onClick={() => setNavState("h")}
            to="/"
            className={s.navLink}
          >
            <img src={equal(navState, "h") ? homeFill : home} alt="home" />
            <p className={equal(navState, "h") ? s.navActive : ""}>Home</p>
          </NavLink>
          <div
            className={s.navLink}
            onClick={() => {
              setNavState("s");
              setIsNavModalOpen(true);
            }}
          >
            <img
              src={equal(navState, "s") ? searchFill : search}
              alt="search"
            />
            <p className={equal(navState, "s") ? s.navActive : ""}>Search</p>
          </div>
          <NavLink
            to="/explore"
            className={s.navLink}
            onClick={() => setNavState("e")}
          >
            <img
              src={equal(navState, "e") ? exploreFill : explore}
              alt="explore"
            />
            <p className={equal(navState, "e") ? s.navActive : ""}>Explore</p>
          </NavLink>
          <NavLink
            to="/messages"
            className={s.navLink}
            onClick={() => setNavState("m")}
          >
            <img
              src={equal(navState, "m") ? messagesFill : messages}
              alt="messages"
            />
            <p className={equal(navState, "m") ? s.navActive : ""}>Messages</p>
          </NavLink>
          <div
            onClick={() => {
              setNavState("n");
              setIsNavModalOpen(true);
            }}
            className={s.navLink}
          >
            <img
              src={
                equal(navState, "n") ? notificationsIconFill : notificationsIcon
              }
              alt="notifications"
            />
            <p className={equal(navState, "n") ? s.navActive : ""}>
              Notifications
            </p>
          </div>
          <div
            onClick={() => {
              setNavState("c");
              setIsNavModalOpen(true);
            }}
            className={s.navLink}
          >
            <img src={create} alt="create" />
            <p>Create</p>
          </div>
          <NavLink
            to={`/profile/${user?.username}`}
            onClick={() => {
              window.scrollTo(0, 0);
              setNavState("p");
            }}
            className={({ isActive }) =>
              isProfileActive(navState, isActive) ? s.activeNavLink : s.navLink
            }
          >
            <Avatar src={user?.profile_image} size="24" round={true} />

            <p>Profile</p>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

SideBar.propTypes = {
  navState: PropTypes.string,
  setNavState: PropTypes.func,
  setIsNavModalOpen: PropTypes.func,
};
