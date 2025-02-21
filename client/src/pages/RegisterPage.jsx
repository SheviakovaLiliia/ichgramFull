import s from "./Pages.module.scss";
import { RegisterForm } from "../components";

export const RegisterPage = () => {
  return (
    <section className={s.registerPage}>
      <RegisterForm />
    </section>
  );
};
