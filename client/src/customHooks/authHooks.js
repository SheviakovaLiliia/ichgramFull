import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useResetPasswordMutation,
  useResetPasswordStep2Mutation,
  useLoginMutation,
  useRegisterUserMutation,
} from "../services/api";
import toast from "react-hot-toast";

export const useResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [resetPassword] = useResetPasswordMutation();
  const [resetPasswordStep2] = useResetPasswordStep2Mutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmitStep1 = async (data) => {
    try {
      const emailOrUsername = {
        emailOrUsername: data.emailOrUsername,
      };
      const response = await resetPassword(emailOrUsername).unwrap();
      toast.success("Srart resetting password successfuly ");
      const token = response.token;
      const username = response.username;
      reset();
      const resetUrl = `/reset-password/${token}divider${username}`;
      navigate(resetUrl);
    } catch (error) {
      toast.error("Error resetting password");
      console.error("Error resetting password step 1:", error);
    }
  };

  const onSubmitStep2 = async (data) => {
    const username = token?.split("divider")[1];
    console.log(username);
    try {
      const passwordData = {
        password: data.password,
        username: username,
      };
      await resetPasswordStep2(passwordData).unwrap();
      await toast.success("Your password has been changed successfully!");
      reset();
      navigate("/login");
    } catch (error) {
      toast.error("Error resetting password");
      console.error("Error resetting password step 2:", error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmitStep1,
    onSubmitStep2,
  };
};

export const useLogin = () => {
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const user = {
        login: data.login,
        password: data.password,
      };

      await login(user).unwrap();
      toast.success("User logged in successfuly ");

      navigate("/");
    } catch (error) {
      toast.error("Error logging in user");
      console.error("Error logging in user", error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    error,
  };
};

export const useRegister = () => {
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const user = {
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      };

      await registerUser(user).unwrap();
      toast.success("User registered successfuly ");
      navigate("/login");
    } catch (error) {
      toast.error("Error while register user");
      console.error("Error registering user", error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    error,
  };
};
