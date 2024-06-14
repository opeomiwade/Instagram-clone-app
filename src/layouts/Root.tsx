import SideBar from "../components/SideBar";
import { Outlet } from "react-router";
import CreateModal from "../components/Modals/Create";
import { useSelector } from "react-redux";
import Search from "../components/SearchSideBar";
import { AnimatePresence } from "framer-motion";
import { SearchContextProvider } from "../context/SearchContext";

function Root() {
  const sidebarState = useSelector(
    (state: { sidebar: { sidebarSelection: string } }) =>
      state.sidebar.sidebarSelection
  );

  return (
    <div className="flex flex-row">
      <CreateModal />
      <SideBar />
      <AnimatePresence>
        {sidebarState === "search" && (
          <SearchContextProvider>
            <Search />
          </SearchContextProvider>
        )}
      </AnimatePresence>
      <Outlet />
    </div>
  );
}

export default Root;
