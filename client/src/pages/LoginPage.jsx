import s from "./Pages.module.scss";
import { LoginForm } from "../components";
import loginImg from "../assets/loginBackground.png";

export const LoginPage = () => {
  return (
    <section className={s.loginPage}>
      <div className={s.loginMain}>
        <img className={s.loginImg} src={loginImg} alt="mobile app" />

        <LoginForm />
      </div>
    </section>
  );
};
