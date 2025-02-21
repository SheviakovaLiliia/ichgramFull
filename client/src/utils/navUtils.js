import equal from "deep-equal";

export const setNavLinkValue = (loc, setValue) => {
  if (equal(loc.pathname, "/")) {
    setValue("h");
  } else if (loc.state && equal(loc.state.backgroundLocation.pathname, "/")) {
    setValue("h");
  } else if (loc.pathname.includes("explore")) {
    setValue("e");
  } else if (
    loc.state &&
    loc.state.backgroundLocation.pathname.includes("explore")
  ) {
    setValue("e");
  } else if (loc.pathname.includes("messages")) {
    setValue("m");
  } else if (loc.pathname.includes("profile")) {
    setValue("p");
  } else if (
    loc.state &&
    loc.state.backgroundLocation.pathname.includes("profile")
  ) {
    setValue("p");
  } else {
    setValue("");
  }
};

export const isProfileActive = (state, active) => {
  if (active) {
    if (equal("c", state) || equal("p", state)) {
      return true;
    } else if (equal("s", state) || equal("n", state)) {
      return false;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const isNavModalState = (state) => {
  if (equal(state, "s") || equal(state, "n") || equal(state, "c")) {
    return true;
  } else {
    return false;
  }
};
