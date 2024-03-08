import LoginForm from "../components/LoginForm";
import classes from "../CSS/AuthPage.module.css";
import Footer from "../components/Footer";
import screenshot1 from "../assets/screenshot1-2x.png";
import screenshot2 from "../assets/screenshot2-2x.png";
import { useNavigate} from "react-router";
import { json, redirect, useActionData } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
export type errorObj = { isError: boolean; message: string };

function AuthPage() {
  const navigate = useNavigate();
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
              Dont have an account?
              <a
                className="text-blue-500 text-[12px] font-bold hover:cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AuthPage;

export async function action({ request }: { request: Request }) {
  let formData = await request.formData();
  let credentials = Object.fromEntries(formData.entries());
  try {
    const response = await axios.post(
      "https://instagram-clone-app-server.onrender.com/login",
      credentials
    );
    localStorage.setItem("accessToken", response.data.accessToken)
    return redirect("/home")
  } catch (error: any) {
    return json({ isError: true, message: error.response.data.errorMessage });
  }
}


export function loader(){
  if(localStorage.getItem("accessToken")){
    localStorage.removeItem("accessToken")
  }
  return null
}