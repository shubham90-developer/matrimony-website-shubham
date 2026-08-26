import { Metadata } from "next";
import Register from "./components/Register";

export const metadata: Metadata = {
  title: "Register | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const RegisterPage = () => {
  return (
    <>
      <Register />
    </>
  );
};

export default RegisterPage;
