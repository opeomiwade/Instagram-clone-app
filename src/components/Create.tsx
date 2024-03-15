import { createPortal } from "react-dom";
import React, { useRef, useState } from "react";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import classes from "../CSS/Modal.module.css";
import { useSelector, useDispatch } from "react-redux";
import { json } from "react-router";
import { currentUserActions, sidebarActions } from "../store/redux-store";
import handleFileChange from "../util/handleFileChange";
import uploadImage from "../util/uploadImage";
import queryClient from "../util/http";

const Create = () => {
  const fileInputRef = useRef<HTMLInputElement>();
  const dispatch = useDispatch();
  const dialogRef = useRef<HTMLDialogElement>();
  const [imageFileUrl, setUrl] = useState<string>();
  const [caption, setCaption] = useState<string>("");
  const [sharing, setSharing] = useState<boolean>(false);
  const open = useSelector(
    (state: { sidebar: { createModal: boolean } }) => state.sidebar.createModal
  );
  const userData = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );

  async function shareButtonHandler() {
    setSharing(true);
    try {
      const imageUrl = await uploadImage(
        fileInputRef.current!.files![0],
        userData.username,
        `post-images/p${userData.posts.length + 1}/`
      );
      dispatch(
        currentUserActions.updateUserData({
          newPost: {
            id: `${userData.posts.length + 1}${userData.username}`,
            username: userData.username,
            imageUrl,
            caption,
            likes: 0,
            comments: [],
            profilePic: userData.profilePic,
          },
          type: "newpost",
        })
      );
    } catch (error: any) {
      return json({ error });
    }
    setSharing(false);
    dialogRef.current?.close();
  }

  async function onClose() {
    setUrl("");
    setCaption("");
    dispatch(sidebarActions.updateSidebarState("create"));
    fileInputRef.current!.value = "";
    await axios
      .put(
        "http://localhost:3000/update-document",
        userData.posts[userData.posts.length - 1],
        {
          params: { updateType: "post" },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .catch((error) => console.log(error));
    queryClient.invalidateQueries({ queryKey: ["all-posts"] });
  }

  return createPortal(
    <dialog
      className={`${classes.modal} ${open && "flex"}`}
      open={open}
      ref={dialogRef as React.Ref<HTMLDialogElement>}
      onClose={onClose}
    >
      <button
        onClick={() => {
          dialogRef.current!.close();
        }}
      >
        <CloseIcon
          style={{
            fill: "white",
            fontSize: "30px",
            position: "absolute",
            right: 20,
            top: 10,
            margin: "10px",
          }}
          className="hover:cursor-pointer"
        />
      </button>
      <div className="bg-white flex shrink flex-col items-center rounded-l-lg w-[560px] min-w-[350px] h-[600px] min-h-[400px]">
        <div
          className={`flex ${
            imageFileUrl ? "justify-between" : "justify-center"
          } w-full px-4`}
        >
          {imageFileUrl && (
            <button
              onClick={() => {
                setUrl("");
                setCaption("");
                fileInputRef.current!.value = "";
              }}
            >
              <KeyboardBackspaceOutlinedIcon style={{ fontSize: "30px" }} />
            </button>
          )}
          <h3 className="font-bold text-center p-2 mx-auto ">
            Create New Post
          </h3>
        </div>

        <hr className="w-full" />
        <div
          className={`${
            !imageFileUrl ? "flex flex-col items-center justify-center" : ""
          } h-[600px]  w-full`}
        >
          {!imageFileUrl && (
            <InsertPhotoOutlinedIcon style={{ fontSize: "10rem" }} />
          )}
          <input
            hidden
            ref={fileInputRef as React.Ref<HTMLInputElement>}
            type="file"
            accept="/imageFile/png imageFile/jpeg imageFile/jpg "
            onChange={(event) => handleFileChange(event, setUrl)}
          />
          {imageFileUrl && (
            <img src={imageFileUrl} className="h-full max-h-[565px] w-full" />
          )}
          {!imageFileUrl && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-500 rounded-lg font-semibold p-2  text-white w-fit"
            >
              Upload Photo from computer
            </button>
          )}
        </div>
      </div>
      {imageFileUrl && (
        <div className="flex flex-col rounded-r-lg bg-white w-[300px] min-w-[150px] h-[600px] min-h-[400px]">
          <h3 className="p-2 text-right">
            <button
              className="font-bold text-blue-500 text-right"
              onClick={shareButtonHandler}
            >
              {sharing ? "Sharing..." : "Share"}
            </button>
          </h3>

          <hr className="w-full" />
          <h3 className="font-bold w-full p-4">{userData.username}</h3>
          <textarea
            placeholder="Write a caption...."
            className="px-4 h-[40%] focus:outline-none"
            style={{ resize: "none" }}
            value={caption}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCaption(event.target.value)
            }
          ></textarea>
          <hr className="w-full" />
          <EmojiPicker
            style={{ width: "300px", minWidth: "150px" }}
            onEmojiClick={(emojiObj) =>
              setCaption((text) => {
                return text + " " + emojiObj.emoji;
              })
            }
          />
        </div>
      )}
    </dialog>,
    document.getElementById("modal")!
  );
};

export default Create;
