import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { useDispatch } from "react-redux";
import { sidebarActions } from "../store/redux-store";
import { useNavigate } from "react-router";

const NoPosts:React.FC<{selectedTab: string}> = ({selectedTab}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function clickHandler(){
    if(selectedTab == "posts"){
          dispatch(sidebarActions.updateSidebarState("create"))
    }
    else{
      navigate("/home")
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="rounded-full border-solid border-2 border-black p-2 hover:cursor-pointer" onClick={clickHandler}>
        <CameraAltOutlinedIcon style={{ fontSize: "40px" }} />
      </div>
      <h1 className="font-bold text-3xl">{`${selectedTab === "posts" ? "Share" : "Save"} Photos`}</h1>
      <button className="text-blue-500 font-bold w-fit text-sm" onClick={clickHandler}>
       {` ${selectedTab === "posts" ? "Share" : "Save"} Your First Post`}
      </button>
    </div>
  );
}

export default NoPosts;
