import { createPortal } from "react-dom";
import classes from "../CSS/Modal.module.css";
import React, { useEffect, useRef, useState } from "react";
import { getAllUsers } from "../util/getUserDoc";
import queryClient from "../util/http";
import CloseIcon from "@mui/icons-material/Close";
import { userDetails } from "../types/types";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { currentUserActions } from "../store/redux-store";
import { updateDoc } from "../util/http";

const List: React.FC<{
  title: string;
  userInfo: userDetails;
  closeModal: () => void;
  isCurrentUser: boolean;
}> = ({ title, userInfo, closeModal, isCurrentUser }) => {
  const dialogRef = useRef<HTMLDialogElement>();
  const [followingList, setFollowingList] = useState<userDetails[]>();
  const [results, setSearchResults] = useState<userDetails[]>();
  const [followersList, setFollowersList] = useState<userDetails[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const open = title.length > 1;

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value.trim() !== "") {
      title === "Following"
        ? setSearchResults(() => {
            return followingList?.filter((user) => {
              return (
                user.username.toLowerCase().includes(event.target.value) ||
                user.name.toLowerCase().includes(event.target.value)
              );
            });
          })
        : setSearchResults(() => {
            return followersList?.filter((user) => {
              user.username.toLowerCase().includes(event.target.value) ||
                user.name.toLowerCase().includes(event.target.value);
            });
          });
    } else {
      setSearchResults([]);
    }
  }

  function followingButtonHandler(event: React.MouseEvent<HTMLButtonElement>) {
    // Update following of current user
    dispatch(
      currentUserActions.updateUserData({
        username: event.currentTarget.id,
        type: "followaction",
      })
    );
    setFollowingList(
      followingList?.filter((user) => user.username != event.currentTarget.id)
    );

    //Update followers of respective user
    const unfollowedUser = followingList?.find(
      (user) => user.username === event.currentTarget.id
    );
    unfollowedUser!.followers = unfollowedUser!.followers.filter(
      (user) => user != userInfo.username
    );
    updateDoc(
      localStorage.getItem("accessToken") as string,
      unfollowedUser as {}
    );
  }

  function removeButtonHandler(event: React.MouseEvent<HTMLButtonElement>) {
    dispatch(
      currentUserActions.updateUserData({
        username: event.currentTarget.id,
        type: "removefollower",
      })
    );
    setFollowersList(
      followersList?.filter((user) => user.username != event.currentTarget.id)
    );

    //Update following of respective user
    const removedUser = followersList?.find(
      (user) => user.username === event.currentTarget.id
    );
    removedUser!.following = removedUser!.following.filter(
      (user) => user != userInfo.username
    );
    updateDoc(localStorage.getItem("accessToken") as string, removedUser as {});
  }

  useEffect(() => {
    const fetchData = async () => {
      const users = await queryClient.fetchQuery({
        queryKey: ["all-users"],
        queryFn: getAllUsers,
      });
      setFollowingList(() => {
        return users.filter((user) =>
          userInfo.following.includes(
            user.username ||
              user.username.toLowerCase() ||
              user.username.toUpperCase()
          )
        );
      });
      setFollowersList(() => {
        return users.filter((user) =>
          userInfo.followers.includes(
            user.username ||
              user.username.toLowerCase() ||
              user.username.toUpperCase()
          )
        );
      });
    };
    if (open) {
      fetchData();
    }
  }, [open]);

  return createPortal(
    <dialog
      className={`${classes.modal} ${open ? "flex" : ""}`}
      open={open}
      ref={dialogRef as React.Ref<HTMLDialogElement>}
      onClose={() => {}}
    >
      <div className="bg-white rounded-md w-[400px] h-[400px]">
        <div className="flex justify-end items-center gap-32 p-2">
          <h2 className="font-bold p-2 text-center">{title}</h2>
          <button
            onClick={() => {
              closeModal();
              dialogRef.current?.close();
            }}
          >
            <CloseIcon />
          </button>
        </div>
        <hr />
        <div className="p-[2px] w-[90%] mx-auto my-2 rounded-md bg-gray-200 ">
          <input
            className="bg-gray-200 w-full focus:outline-none"
            placeholder="Search"
            onChange={changeHandler}
          />
        </div>
        {title === "Following" &&
          followingList?.map((user) => {
            return (
              <div
                key={user.username}
                className="flex justify-between p-4 mb-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user.profilePic}
                    className="w-[40px] h-[40px] rounded-full"
                  />
                  <h4
                    className="font-bold flex flex-col text-sm hover:cursor-pointer"
                    onClick={() => {
                      navigate(`/home/${user.username}`);
                      closeModal();
                    }}
                  >
                    {user.username}
                    <span className="text-gray-600 font-normal">
                      {user.name}
                    </span>
                  </h4>
                </div>
                {isCurrentUser && (
                  <button
                    id={user.username}
                    className="bg-gray-200 rounded-lg font-bold text-xs max-w-[100px] w-[100px] hover:bg-gray-300"
                    onClick={followingButtonHandler}
                  >
                    Following
                  </button>
                )}
              </div>
            );
          })}
        {title === "Followers" &&
          followersList?.map((user) => {
            return (
              <div
                key={user.username}
                className="flex justify-between p-4 mb-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user.profilePic}
                    className="w-[40px] h-[40px] rounded-full"
                  />
                  <h4
                    onClick={() => {
                      navigate(`/home/${user.username}`);
                      closeModal();
                    }}
                    className="font-bold flex flex-col text-sm hover:cursor-pointer"
                  >
                    {user.username}
                    <span className="text-gray-600 font-normal">
                      {user.name}
                    </span>
                  </h4>
                </div>
                {isCurrentUser && (
                  <button
                    id={user.username}
                    onClick={removeButtonHandler}
                    className="bg-gray-200 rounded-lg font-bold text-xs max-w-[100px] w-[100px] hover:bg-gray-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </dialog>,
    document.getElementById("modal")!
  );
};

export default List;
