import s from "./NavModal.module.scss";
import { Search, Notifications, CreatePost } from "../NavModal";
import { useContext, useState } from "react";
import { navContext } from "../../context/navContext";
import { useLocation } from "react-router-dom";
import { setNavLinkValue } from "../../utils/navUtils";
import { isNavModalState } from "../../utils/navUtils";

export const NavModal = () => {
  const [isClosing, setIsClosing] = useState(false);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsNavModalOpen(false);
      setNavLinkValue(location, setNavState);
      setIsClosing(false);
    }, 500);
  };

  const { navState, setNavState, isNavModalOpen, setIsNavModalOpen } =
    useContext(navContext);
  const location = useLocation();

  return (
    isNavModalOpen &&
    isNavModalState(navState) && (
      <div
        id={isClosing ? "closeModal" : "openModal"}
        className={s.modal}
        onClick={() => {
          closeModal();
        }}
      >
        {navState === "s" && (
          <div
            onClick={(e) => e.stopPropagation()}
            id={isClosing ? "closeSide" : "openSide"}
            className={s.sideContainer}
          >
            <div className={s.stickyBody}>
              <Search closeModal={closeModal} />
            </div>
          </div>
        )}
        {navState === "n" && (
          <div
            onClick={(e) => e.stopPropagation()}
            id={isClosing ? "closeSide2" : "openSide2"}
            className={s.sideContainer}
          >
            <div className={s.stickyBody}>
              <Notifications closeModal={closeModal} />
            </div>
          </div>
        )}
        {navState === "c" && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={s.centerContainer}
          >
            <CreatePost mode="create" />
          </div>
        )}
      </div>
    )
  );
};
