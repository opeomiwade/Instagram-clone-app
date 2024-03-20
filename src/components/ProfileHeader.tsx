import image from "../assets/account circle.jpeg";
import { useRef, Ref } from "react";
import { useDispatch } from "react-redux";
import { sidebarActions, currentUserActions } from "../store/redux-store";
import axios from "axios";
import { useNavigate } from "react-router";
import { HeaderProps } from "../types/types";

const Header: React.FC<HeaderProps> = ({
  userData,
  isCurrentUser,
  setTitle,
  currentUser,
  openArchiveModal,
  openProfileImageModal,
}) => {
  const followButtonRef = useRef<HTMLButtonElement>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function logOutHandler() {
    dispatch(sidebarActions.updateSidebarState("home"));
    localStorage.removeItem("accessToken");
    localStorage.removeItem("streamAccessToken");
    await axios.post("https://instagram-clone-app-server.onrender.com/sign-out");
    navigate("/");
  }

  function followButtonHandler() {
    if (!isCurrentUser) {
      //Update following of account
      const isFollowing = currentUser.following.includes(userData.username);
      isFollowing
        ? (followButtonRef.current!.innerText = "Follow")
        : (followButtonRef.current!.innerText = "Following");
      dispatch(
        currentUserActions.updateUserData({
          username: userData.username,
          type: "followaction",
        })
      );

      //Update followers of account
      isFollowing
        ? (userData.followers = userData.followers.filter(
            (username: string) => username !== currentUser.username
          ))
        : userData.followers.push(currentUser.username);
    }
  }

  return (
    <header className="flex  justify-center p-6 gap-[100px]">
      <img
        onClick={() => {
          openProfileImageModal();
        }}
        src={userData.profilePic || image}
        className="rounded-full flex shrink max-w-[150px] max-h-[150px] hover:cursor-pointer"
      />
      <div className="flex flex-col justify-center gap-[25px]">
        <div className="flex gap-[15px] items-center">
          <h2 className="font-bold text-xl">{userData.username}</h2>
          <button
            className="bg-gray-200 text-black text-md font-semibold rounded-md w-[10rem] p-2"
            ref={followButtonRef as Ref<HTMLButtonElement>}
            onClick={
              isCurrentUser
                ? () => {
                    openArchiveModal();
                  }
                : followButtonHandler
            }
          >
            {isCurrentUser
              ? "Archived Posts"
              : currentUser.following &&
                currentUser.following.includes(userData.username)
              ? "Following"
              : "Follow"}
          </button>
          <button
            className={`bg-gray-200 ${
              isCurrentUser ? "text-red-500" : "text-black"
            } text-md font-semibold rounded-md p-2 w-[7rem]`}
            onClick={isCurrentUser ? logOutHandler : () => {}}
          >
            {isCurrentUser ? "Log Out" : "Message"}
          </button>
        </div>

        <div className="flex justify-between ">
          <h3 className="font-bold">{`${userData.posts.length} posts`}</h3>
          <h3
            className="font-bold hover:cursor-pointer"
            onClick={() => setTitle("Followers")}
          >{`${userData.followers.length} followers`}</h3>
          <h3
            className="font-bold hover:cursor-pointer"
            onClick={() => setTitle("Following")}
          >{`${userData.following.length} following`}</h3>
        </div>
        <h4 className="font-bold">{userData.name}</h4>
        <h4 className="font-semibold text-sm">
          Followed by kingjames, espn, kai_cenat
        </h4>
      </div>
    </header>
  );
};

export default Header;
