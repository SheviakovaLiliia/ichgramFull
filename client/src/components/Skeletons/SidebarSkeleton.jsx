import ContentLoader from "react-content-loader";

const SidebarSkeleton = (props) => {
  if (window.innerWidth > 1200)
    return (
      <ContentLoader viewBox="0 0 245 490" height={490} width={245} {...props}>
        <rect x="24" y="40" width="97" height="30" />

        <rect x="24" y="116" width="24" height="24" />
        <rect x="64" y="119" width="43" height="16" />

        <rect x="24" y="166" width="24" height="24" />
        <rect x="64" y="169" width="50" height="16" />

        <rect x="24" y="216" width="24" height="24" />
        <rect x="64" y="219" width="53" height="16" />

        <rect x="24" y="264" width="24" height="24" />
        <rect x="64" y="267" width="74" height="16" />

        <rect x="24" y="312" width="24" height="24" />
        <rect x="64" y="315" width="91" height="16" />

        <rect x="24" y="360" width="24" height="24" />
        <rect x="64" y="362" width="47" height="16" />

        <circle cx="36" cy="458" r="13" />
        <rect x="64" y="450" width="46" height="16" />
      </ContentLoader>
    );
  if (window.innerWidth <= 1200 && window.innerWidth > 768)
    return (
      <ContentLoader viewBox="0 0 60 490" height={490} width={60} {...props}>
        <rect x="24" y="32" width="24" height="24" />

        <rect x="24" y="82" width="24" height="24" />

        <rect x="24" y="132" width="24" height="24" />

        <rect x="24" y="180" width="24" height="24" />

        <rect x="24" y="227" width="24" height="24" />

        <rect x="24" y="274" width="24" height="24" />

        <circle cx="36" cy="332" r="13" />
      </ContentLoader>
    );

  if (window.innerWidth <= 768)
    return (
      <div
        style={{
          height: "calc(100vh - 60px)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ margin: "0 auto" }} className="loaderS"></div>
      </div>
    );
};

export default SidebarSkeleton;
