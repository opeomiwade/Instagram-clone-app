import React, { useState, useRef } from "react";
import { Form, useNavigate } from "react-router-dom";
import Input from "./Input";
import classes from "../CSS/AuthPage.module.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState<boolean>(true);
  const confirmPasswordRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const emailRef = useRef<HTMLInputElement>();

  function blurHandler() {
    if (
      confirmPasswordRef.current?.value.trim() === "" ||
      passwordRef.current?.value.trim() === "" ||
      confirmPasswordRef.current?.value.trim() !==
        passwordRef.current?.value.trim()
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }
  return (
    <div className="flex flex-col items-center mt-[3rem]">
      <div className={classes.cardDiv}>
        <i className={classes.background} />
        <p className="font-medium m-2 text-center text-gray-500">
          Enter New Password
        </p>
        <Form method="post" className="flex gap-[1rem] flex-col">
          <Input
            name="email"
            id="email"
            type="email"
            className="rounded-md border-solid border-[1px] p-[5px] w-[300px] text-[12px]"
            placeholder="Enter your account email"
            onBlur={blurHandler}
            ref={emailRef as React.Ref<HTMLInputElement>}
          />
          <Input
            name="password"
            id="password"
            type="password"
            className="rounded-md border-solid border-[1px] p-[5px] w-[300px] text-[12px]"
            placeholder="Enter New Password"
            onBlur={blurHandler}
            ref={passwordRef as React.Ref<HTMLInputElement>}
          />
          <Input
            name="confirmpassword"
            id="confirm"
            type="password"
            placeholder="Confirm Password"
            className={`rounded-md border-solid border-[1px] w-[300px] p-[5px] text-[12px] ${
              confirmPasswordRef.current?.value.trim() !==
              passwordRef.current?.value.trim()
                ? "border-red-500"
                : ""
            }`}
            onBlur={blurHandler}
            ref={confirmPasswordRef as React.Ref<HTMLInputElement>}
          />

          <button
            className={`text-white font-semibold rounded-md bg-blue-300 ${
              !disabled ? "hover:bg-blue-500 p-[5px]" : ""
            } `}
            type="submit"
            disabled={disabled}
          >
            Change Password
          </button>
          {confirmPasswordRef.current?.value.trim() !==
            passwordRef.current?.value.trim() && (
            <div className="text-[12px] text-red-700  bg-red-300 text-center rounded-md p-1">
              Passwords are not the same, please re-enter
            </div>
          )}
        </Form>
      </div>
      <div className={`${classes.cardDiv} mt-[10px]`}>
        <p className="text-[12px]">
          Have an account?
          <a
            className="text-blue-500 text-[12px] font-bold hover:cursor-pointer"
            onClick={() => navigate("/")}
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
