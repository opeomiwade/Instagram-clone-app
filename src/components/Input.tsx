import { forwardRef } from "react";
import { InputProps } from "../types/types";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ name, id, placeholder, type, className, onChange, value, onBlur}, ref) => {
    return (
      <input
        name={name}
        placeholder={placeholder}
        id={id}
        type={type}
        className={className}
        onChange={onChange}
        ref={ref}
        onBlur={onBlur}
        value={value}
      />
    );
  }
);

export default Input;
