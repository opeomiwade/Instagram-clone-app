import LoginForm from "../components/Forms/LoginForm";
import classes from "../CSS/AuthPage.module.css";
import Footer from "../components/Footer";
import { FaCameraRetro as Camera } from "react-icons/fa6";
import { json, redirect, useActionData, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { handleFirebaseAuthAPIError } from "../util/http";
import { FaCameraRetro } from "react-icons/fa";
import { errorObj } from "../types/types";

function LoginPage() {
  const error: errorObj = useActionData() as errorObj;
  const [imageVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 860) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
    });
    resizeObserver.observe(document.documentElement);
  }, []);

  return (
    <>
      <div className="flex flex-row items-center gap-[5rem] justify-center mt-[8rem] h-full">
        {imageVisible && (
          <div className={`${classes.imgDiv}`}>
            <Camera size={400}/>
          </div>
        )}

        <div>
          <div className={classes.cardDiv}>
            <div className="flex items-center gap-2 text-5xl mb-4 shadows-into-light-regular">
              <FaCameraRetro size={50} />
              IG-Clone
            </div>{" "}
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
