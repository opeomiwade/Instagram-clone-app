import { motion } from "framer-motion";
import { useContext } from "react";
import { userDetails } from "../types/types";
import { useSelector } from "react-redux";
import Recents from "./Recents";
import UserSearchResult from "./UserSearchResult";
import SearchBar from "./SearchBar";
import SearchContext from "../context/SearchContext";

function SearchSideBar() {
  const recents = useSelector(
    (state: { recents: { recents: userDetails[] } }) => state.recents.recents
  );
  const ctx = useContext(SearchContext);

  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -200, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeIn" }}
      className="h-[100vh] border-r-2 rounded-r-3xl ml-16 w-[400px] fixed p-4 z-20 shadow-md bg-white"
    >
      <h1 className="font-bold text-3xl text-left m-4">Search</h1>
      <SearchBar
        changeHandler={ctx.changeHandler}
      />
      <hr className="mt-8" />
      <div className="h-[80%] overflow-y-auto">
        {ctx.results.length < 1 && recents.length > 0 ? (
          <Recents recentSearches={recents} />
        ) : ctx.results.length === 0 ? (
          <p className="text-center font-bold text-lg mt-8">No User Found</p>
        ) : (
          ctx.results?.map((user) => {
            return (
              <UserSearchResult
                key={user.username}
                user={user}
                clickHandler={ctx.clickHandler}
              />
            );
          })
        )}
      </div>
    </motion.div>
  );
}

export default SearchSideBar;
