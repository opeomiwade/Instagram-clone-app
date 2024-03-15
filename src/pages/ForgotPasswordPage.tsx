import ForgotPassword from "../components/ForgotPassword";
import axios from "axios";
import { redirect} from "react-router";
import Footer from "../components/Footer";

function ForgotPasswordPage() {
  return (
    <>
      <ForgotPassword />
      <Footer />
    </>
  );
}

export default ForgotPasswordPage;

export async function action({ request }: { request: Request }) {
  let formData = await request.formData();
  let credentials = Object.fromEntries(formData.entries());
  try {
    await axios.post(
      "https://instagram-clone-app-server.onrender.com/forgot-password",
      credentials
    );
    return redirect("/");
  } catch (error) {
    console.log(error)
  }
}
