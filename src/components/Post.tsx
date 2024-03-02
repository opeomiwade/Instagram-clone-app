import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import BookmarkIcon from "@mui/icons-material/BookmarkOutlined";
import MoreIcon from "@mui/icons-material/MoreHorizOutlined";
import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { postDetails } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import { currentPostActions } from "../store/redux-store";
import { updatePost } from "../util/http";
import CommentInput from "./CommentInput";
import PostContext from "../context/PostContext";
import image from "../assets/account circle.jpeg";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router";

const Post: React.FC<{ post: postDetails }> = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [comment, setNewComment] = useState<string>("");
  const [showEmojiPicker, setPicker] = useState<boolean>(false);
  const [showMoreDropDown, setShow] = useState<boolean>(false);
  const {
    likePostHandler,
    savedPostHandler,
    postChanged,
    setChanged,
    addCommentHandler,
  } = useContext(PostContext);
  const userData = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );

  useEffect(() => {
    if (postChanged) {
      updatePost(post);
      setChanged(false);
    }
  }, [post]);

  function emojiButtonHandler() {
    setPicker(!showEmojiPicker);
  }

  function addCommentClickHandler() {
    addCommentHandler(post, comment, showEmojiPicker, setPicker, setNewComment);
  }

  function addEmojiToComment(emojiObj: { [key: string]: any }) {
    setNewComment((text) => text + " " + emojiObj.emoji);
  }

  function inputChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setNewComment(event.target.value);
  }

  return (
    <div className="py-[10px] px-4">
      <div className="flex p-2 justify-between">
        <span className="flex gap-2">
          <img
            src={post.profilePic || image}
            className="rounded-full w-[2rem] h-[2rem]"
          />
          <h4 className="font-bold my-2 flex justify-between">
            {post.username}
          </h4>
        </span>
        <div className="relative" onClick={() => setShow(!showMoreDropDown)}>
          <MoreIcon className="hover:cursor-pointer" />
          {showMoreDropDown && (
            <div className="absolute top-[100%] bg-white rounded-md z-50 border-2 w-[150px]">
              <button className="flex items-center w-full justify-center p-2" onClick={() => navigate(post.username)}>
                <PersonIcon /> View Profile
              </button>
              <hr />
              <button className="p-2 text-center w-full">Cancel</button>
            </div>
          )}
        </div>
      </div>

      <img
        src={post.imageUrl}
        className="rounded-md min-w-[338px] min-h-[309px] w-[475px] h-[474px] hover:cursor-pointer"
        onDoubleClick={(event) => likePostHandler(event, post)}
      />
      <div className="flex flex-row items-start my-2 justify-between ">
        <div className="flex flex-row justify-between w-28">
          <motion.button
            id="fav"
            whileTap={{
              scale: 0.9,
              transition: { duration: 0.2, type: "spring", stiffness: 800 },
            }}
            className="hover:cursor-pointer"
            onClick={(event) => likePostHandler(event, post)}
          >
            <FavoriteBorderOutlinedIcon
              style={{
                fill: userData.likedPosts.includes(post.id) ? "red" : "none",
                stroke: userData.likedPosts.includes(post.id)
                  ? "none"
                  : "black",
                strokeWidth: "2px",
              }}
            />
          </motion.button>
          <button
            id="comment"
            className="hover:cursor-pointer"
            onClick={() => dispatch(currentPostActions.setCurrentPost(post))}
          >
            <CommentIcon />
          </button>
          <button id="send" className="hover:cursor-pointer">
            <SendOutlinedIcon />
          </button>
        </div>

        <div>
          <motion.button
            id="bookmark"
            whileTap={{
              scale: 0.9,
              transition: { duration: 0.2, type: "spring", stiffness: 800 },
            }}
            className="hover:cursor-pointer"
            onClick={() => savedPostHandler(post)}
          >
            <BookmarkIcon
              style={{
                fill: userData.savedPosts.includes(post.id) ? "black" : "none",
                stroke: userData.savedPosts.includes(post.id)
                  ? "none"
                  : "black",
                strokeWidth: "2px",
              }}
            />
          </motion.button>
        </div>
      </div>

      <p className="font-bold">{`${post.likes} likes`}</p>
      <h5 className="font-bold">
        {`${post.username}: `}
        <span className="font-normal text-gray-400 text-[1rem]">
          {post.caption}
        </span>
      </h5>

      {post.comments.length > 0 && (
        <p
          onClick={() => dispatch(currentPostActions.setCurrentPost(post))}
          className="text-gray-500 text-[15px] mt-2 w-fit hover:cursor-pointer "
        >{`View All ${post.comments.length} commments `}</p>
      )}
      <CommentInput
        post={post}
        emojiButtonHandler={emojiButtonHandler}
        addCommentClickHandler={addCommentClickHandler}
        changeHandler={inputChangeHandler}
        onEmojiClick={addEmojiToComment}
        comment={comment}
        showEmojiPicker={showEmojiPicker}
      />
      <hr />
    </div>
  );
};

export default Post;
