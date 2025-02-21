import s from "./Pages.module.scss";
import { Layout } from "../layouts";
import mobileDevices from "../assets/loginBackground.png";

export const NotFoundPage = () => {
  return (
    <Layout>
      <div className={s.notFoundPage}>
        <img className={s.notFoundImg} src={mobileDevices} alt="mobile app" />
        <div className={s.notFoundText}>
          <h2>Oops! Page Not Found (404 Error)</h2>
          <p>
            We&apos;re sorry, but the page you&apos;re looking for doesn&apos;t
            seem to exist. If you typed the URL manually, please double-check
            the spelling. If you clicked on a link, it may be outdated or
            broken.
          </p>
        </div>
      </div>
    </Layout>
  );
};
