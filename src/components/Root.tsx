import SideBar from "./SideBar";
import { Outlet } from "react-router";
import CreateModal from "../components/Create";

function Root() {
  return (
    <div className="flex flex-row">
      <CreateModal />
      <SideBar />
      <Outlet />
    </div>
  );
}

export default Root;
