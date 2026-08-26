import { Metadata } from "next";
import Login from "./components/Login";

export const metadata: Metadata = {
  title: "Login | Your Website Name",
  description: "Browse membership plans to find your perfect life partner.",
};

const LoginPage = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default LoginPage;
