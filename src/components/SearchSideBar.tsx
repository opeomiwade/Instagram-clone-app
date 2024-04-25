import CancelIcon from "@mui/icons-material/Cancel";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { Ref } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../util/getUserDoc";
import { useNavigate } from "react-router";
import { userDetails } from "../types/types";
import { useSelector, useDispatch } from "react-redux";
import { recentsActions, sidebarActions } from "../store/redux-store";
import Recents from "./Recents";
import UserSearchResult from "./UserSearchResult";

function SearchSideBar() {
  const inputRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useQuery({
    queryKey: ["all-users"],
    queryFn: getAllUsers,
    staleTime: 10000,
  });
  const [results, setSearchResults] = useState<userDetails[]>();
  const recents = useSelector(
    (state: { recents: { recents: userDetails[] } }) => state.recents.recents
  );

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value.trim() !== "") {
      let result = data?.filter(
        (user) =>
          user.username
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          user.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setSearchResults(result);
    } else {
      setSearchResults([]);
    }
  }

  function clickHandler(event: React.MouseEvent<HTMLDivElement>) {
    const username = event.currentTarget.id;
    const searchedUser = data?.find((user) => user.username === username);
    dispatch(recentsActions.setRecentSearches({ recent: searchedUser }));
    dispatch(sidebarActions.updateSidebarState("profile"));
    navigate(username);
  }

  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -200, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeIn" }}
      className="h-[100vh] border-r-2 rounded-r-3xl ml-16 w-[400px] fixed p-4 z-20 shadow-md bg-white"
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
      <div className="h-[80%] overflow-y-auto">
        {results === undefined ? (
          <Recents recentSearches={recents} />
        ) : results.length === 0 ? (
          <p className="text-center font-bold text-lg mt-8">No User Found</p>
        ) : (
          results?.map((user) => {
            return (
              <UserSearchResult
                key={user.username}
                user={user}
                clickHandler={clickHandler}
              />
            );
          })
        )}
      </div>
    </motion.div>
  );
}

export default SearchSideBar;
