import React, { createContext, useEffect, useState } from "react";
import { userDetails } from "../types/types";
import { useDispatch } from "react-redux";
import { recentsActions, sidebarActions } from "../store/redux-store";
import { useNavigate } from "react-router";
import queryClient from "../util/http";
import { getAllUsers } from "../util/getUserDoc";

const SearchContext = createContext({
  changeHandler: (_event: React.ChangeEvent<HTMLInputElement>) => {},
  clickHandler: (_event: React.MouseEvent<HTMLDivElement>) => {},
  setSearchResults: (_newValue: React.SetStateAction<userDetails[]>) => {},
  results: [] as userDetails[],
});

export const SearchContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [results, setSearchResults] = useState<userDetails[]>(
    [] as userDetails[]
  );
  const [allUsers, setAllUsers] = useState<userDetails[]>();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    queryClient
      .fetchQuery({
        queryKey: ["all-users"],
        queryFn: getAllUsers,
        staleTime: 6000,
      })
      .then((users) => setAllUsers(users));
  }, []);

  function clickHandler(event: React.MouseEvent<HTMLDivElement>) {
    const username = event.currentTarget.id;
    const searchedUser = allUsers?.find((user) => user.username === username);
    dispatch(recentsActions.setRecentSearches({ recent: searchedUser }));
    dispatch(sidebarActions.updateSidebarState("profile"));
    navigate(username);
  }

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value.trim() !== "") {
      let result = allUsers?.filter(
        (user) =>
          user.username
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          user.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setSearchResults(result!);
    } else {
      setSearchResults([]);
    }
  }

  const values = {
    changeHandler,
    clickHandler,
    setSearchResults,
    results,
  };

  return (
    <SearchContext.Provider value={values}>{children}</SearchContext.Provider>
  );
};

export default SearchContext;
