import ContentLoader from "react-content-loader";

// export const CommentSkeleton = () => {};

const PostImageSkeleton = (props) => {
  return (
    <ContentLoader viewBox="0 0 307 307" height={307} width={307} {...props}>
      <rect x="0" y="0" width="307" height="307" />
    </ContentLoader>
  );
};

export default PostImageSkeleton;
