import s from "./AuthForms.module.scss";
import logo from "../../assets/logoMain.svg";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useLogin } from "../../customHooks/authHooks";

export const LoginForm = () => {
  const { register, handleSubmit, errors, onSubmit, isLoading, error } =
    useLogin();

  return (
    <div className={s.authForm}>
      <div className={s.formContainerAuth}>
        <img className={s.logo} src={logo} alt="logo" />

        <form onSubmit={handleSubmit(onSubmit)} className={s.formAuth}>
          <div className={s.inputContainer}>
            <input
              className={s.inputAuth}
              placeholder="Username or email"
              type="text"
              name="password"
              {...register("login", {
                required: "Email is required",
                maxLength: 20,
              })}
            />
            {errors.login && (
              <p className={s.validError}>{errors.login.message}</p>
            )}
          </div>
          <div className={s.inputContainer}>
            <input
              className={s.inputAuth}
              name="password"
              placeholder="Password"
              type="text" //change to password later
              {...register("password", {
                required: "Password is required",
                minLength: 6,
              })}
            />
            {errors.password && (
              <p className={s.validError}>{errors.password.message}</p>
            )}
          </div>
          <button disabled={isLoading} type="submit" className={s.loginBtn}>
            Log in
          </button>
          {error && (
            <p className={s.globalError}>Login or password is incorrect</p>
          )}
          <div className={s.divider}>
            <div className={s.dividingLine}></div>

            <div className={s.dividingWord}>OR</div>
          </div>
        </form>

        <Link to="/reset" className={s.changePassword}>
          Forgot password?
        </Link>
      </div>
      <div className={s.signupRef}>
        <p className={s.signupText}>
          <span>Don&apos;t have an account?</span>
          <Link className={s.signupLink} to="/register">
            Sign up
          </Link>
        </p>
      </div>
      <Toaster />
    </div>
  );
};
