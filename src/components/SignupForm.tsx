import React, { useState, useRef } from "react";
import { Form, Link } from "react-router-dom";
import Input from "./Input";
import classes from "../CSS/AuthPage.module.css";
import { useNavigation } from "react-router-dom";
import { errorObj } from "../pages/LoginPage";

const SignupForm: React.FC<{ error: errorObj }> = ({ error }) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const usernameRef = useRef<HTMLInputElement>();
  const navigation = useNavigation();
  const nameRef = useRef<HTMLInputElement>();

  function blurHandler() {
    if (
      emailRef.current?.value.trim() === "" ||
      passwordRef.current?.value.trim() === "" ||
      usernameRef.current?.value.trim() === "" ||
      nameRef.current?.value.trim() === ""
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
          Fill in the form below to create an account
        </p>
        <Form method="post" className="flex gap-[1rem] flex-col">
          <Input
            name="email"
            id="email"
            placeholder="Email"
            className="rounded-md border-solid border-[1px] w-[300px] p-[5px] text-[12px]"
            onBlur={blurHandler}
            ref={emailRef as React.Ref<HTMLInputElement>}
          />
          <Input
            name="name"
            id="name"
            type="name"
            className="rounded-md border-solid border-[1px] p-[5px] w-[300px] text-[12px]"
            placeholder="Name"
            onBlur={blurHandler}
            ref={nameRef as React.Ref<HTMLInputElement>}
          />
          <Input
            name="username"
            id="username"
            className="rounded-md border-solid border-[1px] p-[5px] w-[300px] text-[12px]"
            placeholder="Username"
            onBlur={blurHandler}
            ref={usernameRef as React.Ref<HTMLInputElement>}
          />
          <Input
            name="password"
            type="password"
            id="password"
            className="rounded-md border-solid border-[1px] p-[5px] w-[300px] text-[12px]"
            placeholder="Password"
            onBlur={blurHandler}
            ref={passwordRef as React.Ref<HTMLInputElement>}
          />
          <button
            className={`text-white font-semibold rounded-md ${
              navigation.state === "submitting" ? "bg-blue-800" : "bg-blue-300"
            } ${!disabled ? "hover:bg-blue-500 p-[5px]" : ""} `}
            type="submit"
            disabled={disabled}
          >
            {navigation.state === "submitting" ? "Signing Up..." : "Sign Up"}
          </button>
          {error && (
            <div className="text-[12px] text-red-700  bg-red-300 text-center rounded-md p-1">
              {error.message}
            </div>
          )}
        </Form>
      </div>
      <div className={`${classes.cardDiv} mt-[10px]`}>
        <p className="text-[12px]">
          {"Have an account?  "}
          <Link
            className="text-blue-500 text-[12px] font-bold hover:cursor-pointer"
            to="/"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
