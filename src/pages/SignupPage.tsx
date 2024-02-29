import SignupForm from "../components/SignupForm";
import Footer from "../components/Footer";
import axios, { AxiosResponse } from "axios";
import { useActionData, json, redirect } from "react-router";
import { errorObj } from "./LoginPage";


function SignupPage() {
  const error: errorObj = useActionData() as errorObj;

  return (
    <>
      <SignupForm error={error} />
      <Footer />
    </>
  );
}

export async function action({ request }: { request: Request }) {
  let formData = await request.formData();
  let credentials = Object.fromEntries(formData.entries());
  try {
    const response: AxiosResponse = await axios.post(
      "http://localhost:3000/signup",
      credentials
    );
    localStorage.setItem("accessToken", response.data.accessToken);
    return redirect("/home");
  } catch (error: any) {   
    return json({ isError: true, message: error.response.data.errorMessage || error.response.data.message });
  }
}

export default SignupPage;
