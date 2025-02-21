import ContentLoader from "react-content-loader";

const ProfileInfoSkeleton = (props) => {
  return (
    <ContentLoader viewBox="0 0 700 172" height={172} width={700} {...props}>
      <circle cx="75" cy="75" r="75" />
      <rect x="90" y="0" width="50" height="15" />
      <rect x="190" y="0" width="50" height="20" />
      <rect x="290" y="0" width="20" height="20" />
      {/* <rect x="30" y="465" width="20" height="20" />
      <rect x="0" y="495" width="40" height="10" />
      <rect x="0" y="512" width="404" height="8" />
      <rect x="0" y="525" width="180" height="8" />
      <rect x="0" y="545" width="100" height="7" /> */}
    </ContentLoader>
  );
};

export default ProfileInfoSkeleton;
