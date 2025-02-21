import ContentLoader from "react-content-loader";

// export const CommentSkeleton = () => {};

const CommentSkeleton = (props) => {
  return (
    <ContentLoader viewBox="0 0 200 53" height={53} width="200" {...props}>
      <circle cx="27.5" cy="26.5" r="13.5" />
      <rect x="50" y="15" width="120" height="10" />
      <rect x="50" y="35" width="20" height="10" />\
      <rect x="86" y="35" width="28" height="10" />
      {/* <rect x="fit-content" y="97.8" width="253.5" height="17" /> */}
      {/* <rect x="129.9" y="132.3" width="212.5" height="17" /> */}
    </ContentLoader>
  );
};

export default CommentSkeleton;
