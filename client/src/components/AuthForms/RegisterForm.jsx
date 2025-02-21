import s from "./AuthForms.module.scss";
import logo from "../../assets/logoMain.svg";
import { Link } from "react-router-dom";
import { useRegister } from "../../customHooks/authHooks";
import { Toaster } from "react-hot-toast";

export const RegisterForm = () => {
  const { register, handleSubmit, errors, onSubmit, isLoading, error } =
    useRegister();

  return (
    <div className={s.authForm}>
      <div className={s.formContainerAuth}>
        <img className={s.logoR} src={logo} alt="logo" />
        <p className={s.description}>
          Sign up to see photos and videos from your friends.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className={s.formAuth}>
          <div className={s.inputContainer}>
            <input
              className={s.inputAuth}
              name="email"
              placeholder="Email"
              type="text"
              {...register("email", {
                required: "Email is required",
                maxLength: 20,
              })}
            />
            {errors.email && (
              <p className={s.validError}>{errors.email.message}</p>
            )}
          </div>
          <div className={s.inputContainer}>
            <input
              className={s.inputAuth}
              placeholder="Full Name"
              type="text"
              name="fullName"
              {...register("fullName", {
                required: "Full name is required",
                maxLength: 20,
              })}
            />
            {errors.fullName && (
              <p className={s.validError}>{errors.fullName.message}</p>
            )}
          </div>
          <div className={s.inputContainer}>
            <input
              className={s.inputAuth}
              placeholder="Username"
              type="text"
              {...register("username", {
                required: "Username is required",

                maxLength: 20,
              })}
            />

            {errors.username && (
              <p className={s.validError}>{errors.username.message}</p>
            )}
          </div>
          <div className={s.inputContainer}>
            <input
              className={s.inputAuth}
              placeholder="Password"
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
          <div className={s.terms}>
            <p>
              People who use our service may have uploaded your contact
              information to Instagram.{" "}
              <a className={s.termsLink} href="">
                Learn More
              </a>{" "}
            </p>

            <p>
              By signing up, you agree to our{" "}
              <a className={s.termsLink} href="">
                Terms,{" "}
              </a>
              <a className={s.termsLink} href="">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a className={s.termsLink} href="">
                Cookie Policy
              </a>
              .
            </p>
          </div>
          <button disabled={isLoading} type="submit" className={s.registerBtn}>
            Sign up
          </button>
          {error && (
            <p className={s.globalError}>Login or password is incorrect</p>
          )}
        </form>
      </div>
      <div className={s.loginRef}>
        <p className={s.loginText}>
          <span>Have an account?</span>
          <Link className={s.loginLink} to="/login">
            Log in
          </Link>
        </p>
      </div>
      <Toaster />
    </div>
  );
};
