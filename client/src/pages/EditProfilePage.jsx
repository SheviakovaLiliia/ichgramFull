import s from "./Pages.module.scss";
import { Layout } from "../layouts";
import { EditProfileForm } from "../components/EditProfileForm/EditProfileForm";

export const EditProfilePage = () => {
  return (
    <Layout>
      <main className={s.editProfilePage}>
        <h1>Edit profile</h1>
        <EditProfileForm />
      </main>
    </Layout>
  );
};
