import CancelIcon from "@mui/icons-material/Cancel";
import { Ref, useRef } from "react";

const SearchBar: React.FC<{
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
}> = ({ changeHandler, width }) => {
  const inputRef = useRef<HTMLInputElement>();

  return (
    <div
      className={`flex relative bg-gray-100 items-center p-2 rounded-md ${
        width ? width : "w-full"
      } right-0`}
    >
      <input
        className="rounded-md bg-gray-100 w-full border-0 focus:outline-none"
        placeholder="Search"
        ref={inputRef as Ref<HTMLInputElement>}
        onChange={changeHandler}
      />
      <button
        onClick={() => {
          inputRef.current!.value = "";
        }}
      >
        <CancelIcon style={{ fill: "gray", fontSize: "15px" }} />
      </button>
    </div>
  );
};

export default SearchBar;
