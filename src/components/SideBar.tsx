import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import TelegramIcon from "@mui/icons-material/Telegram";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LogoutIcon from "@mui/icons-material/Logout";
import Instagram from "../assets/icons/instaicon.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import classes from "../CSS/SideBar.module.css";
import { useNavigate } from "react-router";
import { recentsActions, sidebarActions } from "../store/redux-store";
import { useSelector, useDispatch } from "react-redux";
import image from "../assets/account circle.jpeg";

const SideBar = () => {
  const getIconStyle = (iconName: string) => ({
    stroke: selection === iconName ? "none" : "black",
    strokeWidth: "1.15px",
    fill: selection === iconName ? "black" : "none",
    fontSize: "30px",
  });
  // const [iconText, setVisible] = useState<boolean | undefined>();
  const [bottomAside, setAside] = useState<boolean | undefined>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selection = useSelector(
    (state: { sidebar: { sidebarSelection: string } }) =>
      state.sidebar.sidebarSelection
  );
  const iconText = useSelector(
    (state: { sidebar: { sidebarText: boolean } }) => state.sidebar.sidebarText
  );
  const userData = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 920 && selection !== "search") {
          dispatch(sidebarActions.sidebarText(false));
        } else if (selection === "search" || selection === "messages") {
          dispatch(sidebarActions.sidebarText(false));
        } else {
          dispatch(sidebarActions.sidebarText(true));
        }
        if (entry.contentRect.width < 650 && selection !== "search") {
          setAside(true);
        } else {
          setAside(false);
        }
      }
    });
    resizeObserver.observe(document.documentElement);

    return () =>{
      resizeObserver.disconnect()
    }
  }, [selection]);

  return (
    <aside
      className={`${
        bottomAside
          ? classes.bottomAside
          : `h-[100vh] flex flex-col py-[2rem] px-2 ${
              !iconText ? "w-fit" : "w-[15%]"
            } border-solid border-r-[1px] border-gray-200 justify-between`
      } fixed`}
    >
      {!bottomAside && (
        <img src={Instagram} alt="Instagram" style={{ width: "30px" }} />
      )}
      <div
        className={` flex  items-start ${
          bottomAside
            ? "w-[100%] flex-row justify-around"
            : "h-[80%] flex-col gap-[50px]"
        }`}
      >
        <button
          onClick={() => {
            dispatch(sidebarActions.updateSidebarState("home"));
            navigate("");
          }}
          className={`${
            !bottomAside && "w-[100%]"
          } p-2 flex items-start hover:bg-gray-200 rounded-md cursor-pointer`}
        >
          <HomeIcon style={getIconStyle("home")} />
          {iconText && (
            <a
              style={{
                fontWeight: selection === "home" ? "bold" : "",
                paddingLeft: "15px",
              }}
            >
              Home
            </a>
          )}
        </button>
        {!bottomAside && (
          <button
            onClick={() => {
              dispatch(sidebarActions.updateSidebarState("search"));
            }}
            className={`${
              !bottomAside && "w-[100%]"
            } p-2 flex items-start hover:bg-gray-200 rounded-md cursor-pointer`}
          >
            <SearchIcon style={getIconStyle("search")} />
            {iconText && (
              <a
                style={{
                  fontWeight: selection === "search" ? "bold" : "",
                  paddingLeft: "15px",
                }}
              >
                Search
              </a>
            )}
          </button>
        )}
        <button
          onClick={() => {
            dispatch(sidebarActions.updateSidebarState("messages"));
            navigate("messages");
          }}
          className={`${
            !bottomAside && "w-[100%]"
          } p-2 flex items-start hover:bg-gray-200 rounded-md cursor-pointer`}
        >
          <TelegramIcon style={getIconStyle("messages")} />
          {iconText && (
            <a
              style={{
                fontWeight: selection === "messages" ? "bold" : "",
                paddingLeft: "15px",
              }}
            >
              Messages
            </a>
          )}
        </button>
        <button
          onClick={() => {
            dispatch(sidebarActions.updateSidebarState("create"));
          }}
          className={`${
            !bottomAside && "w-[100%]"
          } p-2 flex items-start hover:bg-gray-200 rounded-md cursor-pointer`}
        >
          <AddBoxIcon
            style={{
              fill: "none",
              stroke: "black",
              strokeWidth: "1.15px",
              fontSize: "30px",
            }}
          />
          {iconText && <a className="pl-[15px]">Create</a>}
        </button>
        <button
          onClick={() => {
            dispatch(sidebarActions.updateSidebarState("profile"));
            navigate(userData.username);
          }}
          className={`${
            !bottomAside && "w-[100%]"
          } p-2 flex items-start hover:bg-gray-200 rounded-md cursor-pointer`}
        >
          <img
            src={userData.profilePic || image}
            style={{ width: "2rem", height: "2rem" }}
            className="rounded-full my-auto"
          />

          {iconText && (
            <a
              style={{
                fontWeight: selection === "profile" ? "bold" : "",
                paddingLeft: "15px",
              }}
            >
              Profile
            </a>
          )}
        </button>
      </div>
      <div>
        <button
          className={`${
            !bottomAside && "w-[100%]"
          } p-2 flex items-start hover:bg-gray-200 rounded-md cursor-pointer`}
          onClick={async () => {
            dispatch(sidebarActions.updateSidebarState("home"));
            dispatch(recentsActions.clear())
            localStorage.removeItem("accessToken");
            localStorage.removeItem("streamAccessToken")
            await axios.post("http://localhost:3000/sign-out");
            navigate("/");
          }}
        >
          <LogoutIcon
            style={{
              stroke: "black",
              strokeWidth: "1.15px",
              fill: "none",
              fontSize: "30px",
            }}
          />
          {iconText && <a style={{ paddingLeft: "15px" }}>Log Out</a>}
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
