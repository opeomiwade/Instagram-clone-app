import React, { useState, useEffect, useRef, Ref } from "react";
import image from "../assets/account circle.jpeg";
import ProfileTabs from "./ProfileTabs";
import { useDispatch, useSelector } from "react-redux";
import ProfileImageModal from "./ProfileImageModal";
import NoPosts from "./NoPosts";
import PostModal from "./PostModal";
import TabContent from "./ProfileTabContent";
import { postDetails, userDetails } from "../types/types";
import { currentUserActions, sidebarActions } from "../store/redux-store";
import { updateDoc } from "../util/http";
import axios from "axios";
import { useNavigate } from "react-router";
import ListModal from "../components/FollowingFollowerModal";

const Profile: React.FC<{ userData: { [key: string]: any } }> = ({
  userData,
}) => {
  const [selectedType, setType] = useState<string>("posts");
  const [hideFooter, setHidden] = useState<boolean>(false);
  const [imageModal, setModal] = useState<boolean>(false);
  const followButtonRef = useRef<HTMLButtonElement>();
  const [title, setTitle] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allPosts = useSelector(
    (state: { allPosts: { posts: postDetails[] } }) => state.allPosts.posts
  );

  const currentUser = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );
  let isCurrentUser = currentUser.username === userData.username;
  isCurrentUser ? (userData = currentUser) : userData;

  function closeModal() {
    setTitle("");
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 920) {
          setHidden(false);
        } else {
          setHidden(true);
        }
      }
    });
    resizeObserver.observe(document.documentElement);
    if (Object.keys(currentUser).length > 0) {
      updateDoc(localStorage.getItem("accessToken") as string, currentUser);
    }
    if (!isCurrentUser) {
      updateDoc(localStorage.getItem("accessToken") as string, userData);
    }
  }, [currentUser.following, userData.followers]);

  function selectedTypeHandler(tabName: string) {
    setType(tabName);
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

  async function logOutHandler() {
    dispatch(sidebarActions.updateSidebarState("home"));
    localStorage.removeItem("accessToken");
    await axios.post("http://localhost:3000/sign-out");
    navigate("/");
  }

  return (
    <>
      {
        <ProfileImageModal
          onClose={() => setModal(!imageModal)}
          open={imageModal}
        />
      }
      <PostModal />
      <ListModal
        title={title}
        closeModal={closeModal}
        userInfo={userData as userDetails}
        isCurrentUser={isCurrentUser}
      />
      <div className={`container w-[85%] ${hideFooter && "absolute right-0"}`}>
        <header className="flex  justify-center p-6 gap-[100px]">
          <img
            onClick={() => setModal(!imageModal)}
            src={userData.profilePic || image}
            className="rounded-full flex shrink max-w-[150px] max-h-[150px] hover:cursor-pointer"
          />
          <div className="flex flex-col justify-center gap-[25px]">
            <div className="flex gap-[15px] items-center">
              <h2 className="font-bold text-xl">{userData.username}</h2>
              <button
                className="bg-gray-200 text-black text-md font-semibold rounded-md w-[7rem] p-2"
                ref={followButtonRef as Ref<HTMLButtonElement>}
                onClick={
                  isCurrentUser
                    ? () => {
                        setType("saved");
                      }
                    : followButtonHandler
                }
              >
                {isCurrentUser
                  ? "View Saved"
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
        <section
          className={`h-[60%] max-w-[80%] mx-auto ${
            userData.posts.length < 1 ? "flex flex-col" : ""
          }`}
        >
          <ProfileTabs
            selectedType={selectedType}
            onSelectType={selectedTypeHandler}
            currentUser={currentUser.username === userData.username}
          />
          {userData.posts.length < 1 && selectedType === "posts" && (
            <NoPosts selectedTab={selectedType} />
          )}
          {userData.savedPosts.length < 1 && selectedType === "saved" && (
            <NoPosts selectedTab={selectedType} />
          )}
          {selectedType === "posts" && userData.posts.length > 0 && (
            <TabContent posts={userData.posts} />
          )}
          {selectedType === "saved" && userData.savedPosts.length > 0 && (
            <TabContent
              posts={allPosts.filter((post) =>
                userData.savedPosts.includes(post.id)
              )}
            />
          )}
        </section>
      </div>
    </>
  );
};

export default Profile;
