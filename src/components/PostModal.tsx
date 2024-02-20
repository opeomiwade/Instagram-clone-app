import React, { useRef } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import MoreIcon from "@mui/icons-material/MoreHorizOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import BookmarkIcon from "@mui/icons-material/BookmarkOutlined";
import classes from "../CSS/Modal.module.css";
import { useSelector, useDispatch } from "react-redux";
import { postDetails } from "../types/types";
import { currentPostActions } from "../store/redux-store";
import { useState, useContext } from "react";
import CommentInput from "./CommentInput";
import PostContext from "../context/PostContext";
import { motion } from "framer-motion";

const PostDialog = () => {
  const dialog = useRef<HTMLDialogElement>();
  const [showEmojiPicker, setPicker] = useState<boolean>(false);
  const [comment, setNewComment] = useState<string>("");
  const ctx = useContext(PostContext);

  const post = useSelector(
    (state: { currentPost: { post: postDetails } }) => state.currentPost.post
  );

  const userData = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );
  const dispatch = useDispatch();

  function emojiButtonHandler() {
    setPicker(!showEmojiPicker);
  }

  function addCommentClickHandler() {
    ctx.addCommentHandler(
      post,
      comment,
      showEmojiPicker,
      setPicker,
      setNewComment
    );
  }

  function addEmojiToComment(emojiObj: { [key: string]: any }) {
    setNewComment((text) => text + " " + emojiObj.emoji);
  }

  function inputChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setNewComment(event.target.value);
  }

  return createPortal(
    <dialog
      className={`${classes.modal}`}
      open={Object.keys(post).length > 0}
      ref={dialog as React.Ref<HTMLDialogElement>}
      onClose={() => dispatch(currentPostActions.setCurrentPost({}))}
    >
      <button
        onClick={() => {
          dialog.current?.close();
        }}
      >
        <CloseIcon
          style={{
            fill: "white",
            fontSize: "30px",
            position: "absolute",
            right: 0,
            margin: "10px",
          }}
          className="hover:cursor-pointer"
        />
      </button>
      <div className="xl:container h-[90%] mx-auto">
        <div className="flex bg-white h-full rounded-r-lg">
          <img src={post.imageUrl} className="max-w-[60%]" />
          <div className="w-full z-10">
            <div className="flex justify-between p-2">
              <div className="flex gap-2">
                <img
                  src={post.profilePic}
                  className="rounded-full w-[50px] h-[50px]"
                />
                <h3 className="font-bold my-auto">{post.username}</h3>
              </div>

              <div>
                <MoreIcon style={{ margin: "8px" }} />
              </div>
            </div>
            <hr />
            <div className=" h-[65%] p-2 overflow-auto">
              <h3 className="font-bold">
                {`${post.username} `}
                <span className="font-normal">{post.caption}</span>
              </h3>
            </div>
            <hr />
            <div className="flex justify-between p-2 h-[10%]">
              <div className="flex w-28 mt-2 justify-between">
                <motion.button
                  className="hover:cursor-pointer"
                  whileTap={{
                    scale: 0.9,
                    transition: {
                      duration: 0.2,
                      type: "spring",
                      stiffness: 800,
                    },
                  }}
                  onClick={(event) => ctx.likePostHandler(event, post)}
                >
                  <FavoriteBorderOutlinedIcon
                    style={{
                      fill:
                        Object.keys(userData).length > 0 &&
                        userData.likedPosts.includes(post.id)
                          ? "red"
                          : "none",
                      stroke:
                        Object.keys(userData).length > 0 &&
                        userData.likedPosts.includes(post.id)
                          ? "none"
                          : "black",
                      strokeWidth: "2px",
                    }}
                  />
                </motion.button>
                <button className="hover:cursor-pointer ">
                  <CommentIcon />
                </button>
                <button className="hover:cursor-pointer">
                  <SendOutlinedIcon />
                </button>
              </div>
              <motion.button
                onClick={() => ctx.savedPostHandler(post)}
                whileTap={{
                  scale: 0.9,
                  transition: { duration: 0.2, type: "spring", stiffness: 800 },
                }}
              >
                <BookmarkIcon
                  style={{
                    fill:
                      Object.keys(userData).length > 0 &&
                      userData.savedPosts.includes(post.id)
                        ? "black"
                        : "none",
                    stroke:
                      Object.keys(userData).length > 0 &&
                      userData.savedPosts.includes(post.id)
                        ? "none"
                        : "black",
                    strokeWidth: "2px",
                  }}
                />
              </motion.button>
            </div>
            <h3 className="font-bold mb-2 p-2">{`${post.likes} likes`}</h3>
            <hr />
            <CommentInput
              post={post}
              emojiButtonHandler={emojiButtonHandler}
              addCommentClickHandler={addCommentClickHandler}
              changeHandler={inputChangeHandler}
              onEmojiClick={addEmojiToComment}
              comment={comment}
              showEmojiPicker={showEmojiPicker}
            />
          </div>
        </div>
      </div>
    </dialog>,
    document.getElementById("modal")!
  );
};

export default PostDialog;
