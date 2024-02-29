import CancelIcon from "@mui/icons-material/Cancel";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { Ref } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../util/getUserDoc";
import { useNavigate } from "react-router";
import { userDetails } from "../types/types";
import { useSelector, useDispatch } from "react-redux";
import { recentsActions } from "../store/redux-store";
import Recents from "./Recents";

function SearchSideBar() {
  const inputRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useQuery({
    queryKey: ["all-users"],
    queryFn: getAllUsers,
  });
  const [results, setSearchResults] = useState<userDetails[]>();
  const recents = useSelector(
    (state: { recents: { recents: userDetails[] } }) => state.recents.recents
  );
  const userData = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    let result = data?.filter(
      (user) =>
        user.username
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        user.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSearchResults(result);
  }

  function clickHandler(event: React.MouseEvent<HTMLDivElement>) {
    const username = event.currentTarget.id;
    const searchedUser = data?.find((user) => user.username === username);
    dispatch(recentsActions.setRecentSearches({ recent: searchedUser }));
    navigate(username);
  }

  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -200, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeIn" }}
      className="h-[100vh] border-r-2 rounded-r-3xl ml-16 w-[400px] fixed p-4 z-[1000] shadow-md bg-white"
    >
      <h1 className="font-bold text-3xl text-left m-4">Search</h1>
      <div className="flex relative bg-gray-100 items-center p-2 rounded-md">
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
      <hr className="mt-8" />
      <div className="h-[80%] overflow-auto">
        {results === undefined ? (
          <Recents recentSearches={recents} />
        ) : results.length === 0 ? (
          <p className="text-center font-bold text-lg mt-8">No User Found</p>
        ) : (
          results?.map((user) => {
            return (
              <div
                id={user.username}
                key={user.username}
                className="flex justify-between mt-4 items-center w-full hover:cursor-pointer hover:bg-gray-200 p-2 rounded-md"
                onClick={clickHandler}
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={user.profilePic}
                    className="rounded-full w-[40px] h-[40px]"
                  />
                  <div className="flex flex-col items-start">
                    <h3 className="font-bold text-left text-sm">
                      {user.username}
                    </h3>
                    <p className="text-gray-500 text-left">{`${user.name} ${
                      userData.following.includes(user.username)
                        ? ".following"
                        : ""
                    }`}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

export default SearchSideBar;
