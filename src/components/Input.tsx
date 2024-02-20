import { forwardRef } from "react";
import { InputProps } from "../types/types";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ name, id, placeholder, type, className, onBlur }, ref) => {
    return (
      <input
        name={name}
        placeholder={placeholder}
        id={id}
        type={type}
        className={className}
        onBlur={onBlur}
        ref={ref}
      />
    );
  }
);

export default Input;
