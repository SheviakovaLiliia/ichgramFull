import s from "./Layout.module.scss";
import PropTypes from "prop-types";
import { SideBar } from "./Sidebar";
import { Footer } from "./Footer";
import { NavModal } from "../components/NavModal/NavModal";
import { useContext } from "react";
import { navContext } from "../context/navContext";
import { useNavigationState } from "../customHooks/otherHooks";

export const Layout = ({ children }) => {
  const { navState } = useContext(navContext);

  useNavigationState();
  console.log(navState);

  return (
    <section className={s.layout}>
      <SideBar />
      <div className={s.pageContent}>
        <NavModal />

        {children}
      </div>
      <Footer />
    </section>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
