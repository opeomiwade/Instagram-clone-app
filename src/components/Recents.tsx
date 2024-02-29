import { userDetails } from "../types/types";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch } from "react-redux";
import { recentsActions } from "../store/redux-store";
import React from "react";

const Recents: React.FC<{ recentSearches: userDetails[] }> = ({
  recentSearches,
}) => {
  const dispatch = useDispatch();

  function removeSearchHandler(event: React.MouseEvent<HTMLButtonElement>) {
    const username = event.currentTarget.id;
    dispatch(recentsActions.removeSearch({ username }));
  }

  return (
    <>
      <div className="flex justify-between my-4">
        <h2 className="font-bold">Recent</h2>
        <button
          className="text-blue-500 font-bold text-sm hover:cursor-pointer"
          onClick={() => dispatch(recentsActions.clear())}
        >
          Clear all
        </button>
      </div>
      {recentSearches?.map((user) => {
        return (
          <div
            id={user.username}
            key={user.username}
            className="flex justify-between mt-4 items-center w-full hover:cursor-pointer hover:bg-gray-200 p-2 rounded-md"
          >
            <div className="flex gap-4 items-center">
              <img
                src={user.profilePic}
                className="rounded-full w-[40px] h-[40px]"
              />
              <div className="flex flex-col items-start">
                <h3 className="font-bold text-left text-sm">{user.username}</h3>
                <p className="text-gray-500 text-left">{user.name}</p>
              </div>
            </div>
            <button onClick={removeSearchHandler} id={user.username}>
              <ClearIcon style={{ fill: "gray" }} />
            </button>
          </div>
        )
      })}
    </>
  );
};

export default Recents;
