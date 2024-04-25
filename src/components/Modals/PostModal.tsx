import React, { useRef } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import MoreIcon from "@mui/icons-material/MoreHorizOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import BookmarkIcon from "@mui/icons-material/BookmarkOutlined";
import classes from "../../CSS/Modal.module.css";
import { useSelector, useDispatch } from "react-redux";
import { postDetails } from "../../types/types";
import { currentPostActions } from "../../store/redux-store";
import { useState, useContext } from "react";
import CommentInput from "../CommentInput";
import PostContext from "../../context/PostContext";
import { motion } from "framer-motion";
import Comment from "../Comment";
import { updatePost } from "../../util/http";
import MoreDropDown from "../MoreDropdown";
import {
  SwipeableList,
  TrailingActions,
  SwipeAction,
  SwipeableListItem,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import DeleteIcon from "@mui/icons-material/Delete";

const PostDialog: React.FC<{
  isCurrentUser?: boolean;
  showNewMessageModal?: (value: boolean) => void;
}> = ({ isCurrentUser, showNewMessageModal }) => {
  const dialog = useRef<HTMLDialogElement>();
  const [showEmojiPicker, setPicker] = useState<boolean>(false);
  const [comment, setNewComment] = useState<string>("");
  const [showMoreDropDown, setShow] = useState<boolean>(false);
  const ctx = useContext(PostContext);
  const dispatch = useDispatch();

  const sidebarState = useSelector(
    (state: { sidebar: { sidebarSelection: string } }) =>
      state.sidebar.sidebarSelection
  );

  const post = useSelector(
    (state: { currentPost: { post: postDetails } }) => state.currentPost.post
  );

  const userData = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );

  const trailingActions = (comment: object) => (
    <TrailingActions>
      <SwipeAction
        destructive={true}
        onClick={() => {
          ctx.deleteCommentHandler(post, comment);
        }}
      >
        <div className="flex gap-2 bg-red-500 items-center">
          <DeleteIcon style={{ fontSize: "30px", fill: "white" }} />{" "}
          <p className="text-bold text-white">Delete</p>
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  function emojiButtonHandler() {
    setPicker(!showEmojiPicker);
  }

  function addCommentClickHandler() {
    dispatch(
      currentPostActions.addComment({
        newcomment: {
          comment,
          username: userData.username,
          profilePic: userData.profilePic,
        },
      })
    );
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

  function closeModal() {
    setShow(false);
    dialog.current?.close();
  }

  return createPortal(
    <dialog
      className={`${classes.modal}`}
      open={Object.keys(post).length > 0}
      ref={dialog as React.Ref<HTMLDialogElement>}
      onClose={() => {
        dispatch(currentPostActions.setCurrentPost({}));
        if (
          sidebarState === "profile" &&
          userData.posts &&
          userData.posts.length > 0
        ) {
          // only perform this action when the user open and then closes the modal in the userprofile page
          // makes updates to the post the user opened in the profile page.
          updatePost(post);
        }
      }}
    >
      <button
        onClick={() => {
          dialog.current?.close();
        }}
        className="z-30"
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
      <div className="flex rounded-r-lg h-[90%] mx-auto bg-white w-[75%]">
        <img src={post.imageUrl} className="max-w-[60%]" />
        <div className="w-full">
          <div className="flex justify-between p-2">
            <div className="flex gap-2">
              <img
                src={post.profilePic}
                className="rounded-full w-[50px] h-[50px]"
              />
              <h3 className="font-bold my-auto">{post.username}</h3>
            </div>

            <div
              className="hover:cursor-pointer relative"
              onClick={() => setShow(!showMoreDropDown)}
            >
              <MoreIcon style={{ margin: "8px" }} />
              {showMoreDropDown && (
                <MoreDropDown
                  post={post}
                  isCurrentUser={isCurrentUser}
                  close={closeModal}
                />
              )}
            </div>
          </div>
          <hr />
          <div className=" h-[65%] p-2 overflow-auto flex flex-col">
            {post.caption && post.caption.trim().length > 0 && (
              <div className="w-full flex items-center gap-[20px]">
                <div className="rounded-full border-2 border-amber-500 p-[2px]">
                  <img
                    src={post.profilePic}
                    className="rounded-full w-[30px] h-[30px]"
                  />
                </div>

                <h3 className="font-bold">
                  {`${post.username} `}
                  <span className="font-normal">{post.caption}</span>
                </h3>
              </div>
            )}
            {post.comments && post.comments.length > 0 && (
              <SwipeableList>
                {post.comments.map((comment) => {
                  //only users that own a post or comment can delete comments
                  return userData.username === comment.username ||
                    userData.username === post.username ? (
                    <SwipeableListItem
                      key={comment.id}
                      trailingActions={trailingActions(comment)}
                    >
                      <Comment comment={comment} />
                    </SwipeableListItem>
                  ) : (
                    <Comment key={comment.id} comment={comment} />
                  );
                })}
              </SwipeableList>
            )}
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
                onClick={(event) => {
                  userData.likedPosts.includes(post.id)
                    ? dispatch(currentPostActions.decreaseLikes())
                    : dispatch(currentPostActions.increaseLikes());
                  ctx.likePostHandler(event, post);
                }}
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
              <button
                className="hover:cursor-pointer"
                onClick={() => {
                  showNewMessageModal && showNewMessageModal(true);
                  ctx.setPostToShare(post);
                }}
              >
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
            dialog={true}
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
    </dialog>,
    document.getElementById("modal")!
  );
};

export default PostDialog;
