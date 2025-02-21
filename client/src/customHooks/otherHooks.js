import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { navContext } from "../context/navContext";
import { setNavLinkValue } from "../utils/navUtils";

export const useNavigationState = () => {
  const location = useLocation();
  const { setNavState } = useContext(navContext);

  useEffect(() => {
    setNavLinkValue(location, setNavState);
  }, [location.pathname]);
};
