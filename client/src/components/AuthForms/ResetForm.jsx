import s from "./AuthForms.module.scss";
import lock from "../../assets/resetIcon.svg";
import { Link, useLocation } from "react-router-dom";
import { useResetPassword } from "../../customHooks/authHooks";
import { Toaster } from "react-hot-toast";

export const ResetForm = () => {
  const location = useLocation();
  const { register, handleSubmit, errors, onSubmitStep1, onSubmitStep2 } =
    useResetPassword();

  return location.pathname === "/reset" ? (
    // step 1
    <div className={s.formContainerReset}>
      <img className={s.lock} src={lock} alt="lock" />
      <h2>Trouble logging in?</h2>

      <form className={s.formReset} onSubmit={handleSubmit(onSubmitStep1)}>
        <p className={s.descriptionR}>
          Enter your email, phone, or username and we&apos;ll send you a link to
          get back into your account.
        </p>
        <div className={s.inputContainer}>
          <input
            className={s.inputReset}
            placeholder="Email or username"
            type="text"
            {...register("emailOrUsername", {
              required: "Username or email is required",
            })}
          />

          {errors.emailOrUsername && (
            <p className={s.validError}>{errors.emailOrUsername.message}</p>
          )}
        </div>

        <button className={s.resetBtn}>Reset your password</button>

        <div className={s.divider}>
          <div className={s.dividingLine}></div>

          <div className={s.dividingWord}>OR</div>
        </div>
      </form>
      <Link className={s.registerLinkR} to="/register">
        Create new account
      </Link>

      <Link to="/login" className={s.loginLinkR}>
        Back to login
      </Link>
      <Toaster position="top-center" reverseOrder={true} />
    </div>
  ) : (
    // step 2
    <div
      className={s.formContainerReset}
      onSubmit={handleSubmit(onSubmitStep2)}
    >
      <img className={s.lock} src={lock} alt="lock" />
      <h2>Reset Password</h2>

      <form className={s.formReset}>
        <p className={s.descriptionR}>Enter your new password</p>
        <div className={s.inputContainer}>
          <input
            className={s.inputReset}
            placeholder="New Password"
            type="text"
            {...register("password", {
              required: "Password is required",
              minLength: 6,
            })}
          />
          {errors.password && (
            <p className={s.validError}>{errors.password.message}</p>
          )}
        </div>

        <button className={s.resetBtn}>Reset password</button>

        <div className={s.divider}>
          <div className={s.dividingLine}></div>

          <div className={s.dividingWord}>OR</div>
        </div>
      </form>
      <Link className={s.registerLinkR} to="/register">
        Create new account
      </Link>

      <Link to="/login" className={s.loginLinkR}>
        Back to login
      </Link>
      <Toaster position="top-center" reverseOrder={true} />
    </div>
  );
};
