import { ReactElement } from "react";

const EmptyPlaceHolder: ReactElement = (
  <div className="h-full flex flex-col gap-4 items-center justify-center ">
    <h2 className="font-bold text-xl">Your Messages</h2>
    <p className="text-gray-400 text-xs">
      Send messages and pictures to friend{" "}
    </p>
    <button
      className="bg-blue-500 p-2 rounded-lg text-white font-semibold text-sm "
      // onClick={() => setOpen(true)}
    >
      Send a message
    </button>
  </div>
);

export default EmptyPlaceHolder;
