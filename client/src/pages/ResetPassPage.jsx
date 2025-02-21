import s from "./Pages.module.scss";
import { ResetForm } from "../components";

export const ResetPassPage = () => {
  return (
    <section className={s.resetPage}>
      <ResetForm />
    </section>
  );
};
