import ContentLoader from "react-content-loader";

const PostCardSkeleton = (props) => {
  if (window.innerWidth > 1080)
    return (
      <ContentLoader viewBox="0 0 404 600" height={600} width={404} {...props}>
        <circle cx="13.5" cy="26.5" r="13.5" />
        <rect x="35" y="17.5" width="80" height="15" />
        <rect x="0" y="50" width="404" height="404" />
        <rect x="0" y="465" width="20" height="20" />
        <rect x="30" y="465" width="20" height="20" />
        <rect x="0" y="495" width="40" height="10" />
        <rect x="0" y="512" width="404" height="8" />
        <rect x="0" y="525" width="180" height="8" />
        <rect x="0" y="545" width="100" height="7" />
      </ContentLoader>
    );

  if (window.innerWidth <= 1080)
    return (
      <ContentLoader viewBox="0 0 350 600" height={600} width={340} {...props}>
        <circle cx="13.5" cy="26.5" r="13.5" />
        <rect x="35" y="17.5" width="80" height="15" />
        <rect x="0" y="50" width="340" height="350" />
        <rect x="0" y="425" width="20" height="20" />
        <rect x="30" y="425" width="20" height="20" />
        <rect x="0" y="455" width="40" height="10" />
        <rect x="0" y="472" width="404" height="8" />
        <rect x="0" y="485" width="180" height="8" />
        <rect x="0" y="505" width="100" height="7" />
      </ContentLoader>
    );
};

export default PostCardSkeleton;
