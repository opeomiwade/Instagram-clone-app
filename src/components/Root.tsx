import SideBar from "./SideBar";
import { Outlet } from "react-router";
import CreateModal from "../components/Create";
import { useSelector } from "react-redux";
import Search from "./SearchSideBar";
import { AnimatePresence } from "framer-motion";

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
        {sidebarState === "search" && <Search />}
      </AnimatePresence>
      <Outlet />
    </div>
  );
}

export default Root;
