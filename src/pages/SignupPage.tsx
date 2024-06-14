import SignupForm from "../components/Forms/SignupForm";
import Footer from "../components/Footer";
import axios, { AxiosResponse } from "axios";
import { useActionData, json, redirect } from "react-router";
import { errorObj } from "../types/types";
import { handleFirebaseAuthAPIError } from "../util/http";


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
      "https://instagram-clone-app-server.onrender.com/signup",
      credentials
    );
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("streamAccessToken", response.data.streamChatToken);
    return redirect("/home");
  } catch (error: any) { 
    console.log(error.response.data)
    const message = handleFirebaseAuthAPIError(error.response.data.errorCode || error.response.data.message)
    return json({ isError: true, message });
  }
}

export default SignupPage;
