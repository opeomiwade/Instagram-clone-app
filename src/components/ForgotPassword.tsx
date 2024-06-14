import React, { useState, useEffect } from "react";
import { Form, useNavigate } from "react-router-dom";
import Input from "./Input";
import classes from "../CSS/AuthPage.module.css";
import { FaCameraRetro } from "react-icons/fa6";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [passwordMatch, setMatch] = useState<boolean>(true);
  const [formInput, setFormInput] = useState<{
    email: string;
    new: string;
    confirm: string;
  }>({ email: "", new: "", confirm: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formInput.new !== formInput.confirm) {
        setMatch(false);
      } else {
        setMatch(true);
      }
    }, 500);
    if (
      passwordMatch &&
      formInput.email.trim() !== "" &&
      formInput.new.trim() !== "" &&
      formInput.confirm.trim() !== ""
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [formInput, passwordMatch]);

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = event.currentTarget;
    setFormInput((prevState) => {
      return { ...prevState, [id]: value };
    });
  }

  return (
    <div className="flex flex-col items-center mt-[3rem]">
      <div className={classes.cardDiv}>
        <div className="flex items-center gap-2 text-5xl mb-4 shadows-into-light-regular">
          <FaCameraRetro size={50} />
          IG-Clone
        </div>
        <p className="font-medium m-2 text-center text-gray-500">
          Enter New Password
        </p>
        <Form method="post" className="flex gap-[1rem] flex-col">
          <Input
            name="email"
            id="email"
            type="email"
            className="rounded-md border-solid border-[1px] p-[5px] w-[300px] text-[12px]"
            onChange={changeHandler}
            value={formInput.email}
            placeholder="Enter your account email"
          />
          <Input
            name="newpassword"
            id="new"
            type="password"
            className="rounded-md border-solid border-[1px] p-[5px] w-[300px] text-[12px]"
            onChange={changeHandler}
            value={formInput.new}
            placeholder="Enter New Password"
          />
          <Input
            name="confirmpassword"
            id="confirm"
            type="password"
            placeholder="Confirm Password"
            onChange={changeHandler}
            value={formInput.confirm}
            className={`rounded-md border-solid border-[1px] w-[300px] p-[5px] text-[12px] ${
              false ? "border-red-500" : ""
            }`}
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
          {!passwordMatch && (
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
