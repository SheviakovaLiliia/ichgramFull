import s from "../../pages/Pages.module.scss";

import { useContext } from "react";
import { navContext } from "../../context/navContext";
import PostCardSkeleton from "./PostCardSkeleton";

const arr = [1, 2, 3, 4];

export const SkeletonsGrid = () => {
  const { navState } = useContext(navContext);
  if (navState === "h")
    return (
      <div className="skeletonsGrid">
        {arr.map((el, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
};
