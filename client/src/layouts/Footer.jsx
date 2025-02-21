import s from "./Layout.module.scss";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { navContext } from "../context/navContext";

export const Footer = () => {
  const { setNavState } = useContext(navContext);
  return (
    <footer className={s.footer}>
      <div className={s.navLinks}>
        <Link to="/" onClick={() => setNavState("h")}>
          Home
        </Link>
        <p onClick={() => setNavState("s")}>Search</p>
        <Link to="/explore" onClick={() => setNavState("e")}>
          Explore
        </Link>
        <Link to="/messages" onClick={() => setNavState("m")}>
          Messages
        </Link>

        <p onClick={() => setNavState("n")}>Notifications</p>
        <p onClick={() => setNavState("c")}>Create</p>
      </div>
      <p className={s.footerText}>
        {" "}
        <span>© 2024 ICHgram</span>
      </p>
    </footer>
  );
};
