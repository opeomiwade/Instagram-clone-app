import LoginForm from "../components/Forms/LoginForm";
import classes from "../CSS/AuthPage.module.css";
import Footer from "../components/Footer";
import screenshot1 from "../assets/screenshot1-2x.png";
import screenshot2 from "../assets/screenshot2-2x.png";
import { json, redirect, useActionData, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { handleFirebaseAuthAPIError } from "../util/http";
export type errorObj = { isError: boolean; message: string };

function LoginPage() {
  const error: errorObj = useActionData() as errorObj;
  const [imageVisible, setIsVisisble] = useState<boolean>(true);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 860) {
          setIsVisisble(false);
        } else {
          setIsVisisble(true);
        }
      }
    });
    resizeObserver.observe(document.documentElement);
  }, []);

  return (
    <>
      <div className="flex flex-row items-center gap-[3rem] justify-center mt-[3rem]">
        {imageVisible && (
          <div className={`${classes.imgDiv}`}>
            <img className={classes.iphoneFrame} src={screenshot1} />
            <img className={classes.iphoneFrame} src={screenshot2} />
          </div>
        )}

        <div>
          <div className={classes.cardDiv}>
            <i className={classes.background} />
            <LoginForm error={error} />
          </div>
          <div className={`${classes.cardDiv} mt-[10px]`}>
            <p className="text-[12px]">
              {"Dont have an account?  "}
              <Link
                className="text-blue-500 text-[12px] font-bold hover:cursor-pointer"
                to="/signup"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LoginPage;

export async function action({ request }: { request: Request }) {
  let formData = await request.formData();
  let credentials = Object.fromEntries(formData.entries());
  try {
    const response = await axios.post(
      "https://instagram-clone-app-server.onrender.com/login",
      credentials
    );
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("streamAccessToken", response.data.streamChatToken);
    return redirect("/home");
  } catch (error: any) {
    const message = handleFirebaseAuthAPIError(error.response.data.errorCode);
    return json({ isError: true, message });
  }
}

export async function loader() {
  if (localStorage.getItem("accessToken")) {
    localStorage.removeItem("accessToken");
  }
  if (localStorage.getItem("streamAccessToken")) {
    localStorage.removeItem("streamAccessToken");
  }
  await axios.post("https://instagram-clone-app-server.onrender.com/sign-out");
  return null;
}
