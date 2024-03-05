import { Form } from "react-router-dom";
import Input from "./Input";
import { useNavigation } from "react-router-dom";
import { useState, useRef } from "react";
import { errorObj } from "../pages/LoginPage";

const AuthForm: React.FC<{ error: errorObj }> = ({ error }) => {
  const [disabled, setdisabled] = useState<boolean>(true);
  const emailRef = useRef<HTMLInputElement | undefined>();
  const navigation = useNavigation();
  const passwordRef = useRef<HTMLInputElement | undefined>();

  function blurHandler() {
    if (
      emailRef.current?.value.trim() === "" ||
      passwordRef.current?.value.trim() === ""
    ) {
      setdisabled(true);
    } else {
      setdisabled(false);
    }
  }

  return (
    <Form method="post" className="flex gap-[1rem] flex-col">
      <Input
        name="email"
        id="email"
        placeholder="Username, Email"
        className="rounded-md border-solid border-[1px] p-[5px] text-[12px]"
        ref={emailRef as React.Ref<HTMLInputElement>}
        onBlur={blurHandler}
      />
      <Input
        name="password"
        type="password"
        id="password"
        className="rounded-md border-solid border-[1px] p-[5px] w-[300px] text-[12px]"
        placeholder="Password"
        ref={passwordRef as React.Ref<HTMLInputElement>}
        onBlur={blurHandler}
      />
      <button
        className={`text-white font-semibold rounded-md ${
          navigation.state === "submitting" ? "bg-blue-800" : "bg-blue-300"
        }  ${!disabled ? "hover:bg-blue-800 p-[5px]" : ""}`}
        type="submit"
        disabled={disabled}
      >
        {navigation.state === "submitting" ? "Logging In...." : "Log In"}
      </button>
      <a
        href="/forgot-password"
        className="text-blue-500 text-center w-fit mx-auto"
      >
        Forgot Password?
      </a>
      {error && (
        <div className="text-[12px] text-red-700  bg-red-300 text-center rounded-md p-1">
          {error.message}
        </div>
      )}
    </Form>
  );
};

export default AuthForm;
