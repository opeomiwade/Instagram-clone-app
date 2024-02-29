import React, { ReactNode, createContext, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { allPostsActions, currentUserActions } from "../store/redux-store";
import { postDetails } from "../types/types";

const PostContext = createContext({
  likePostHandler: async (
    event: React.MouseEvent<HTMLImageElement | HTMLButtonElement>,
    post: postDetails
  ) => {},
  savedPostHandler: async (_post: postDetails) => {},
  addCommentHandler: async (
    _post: postDetails,
    _comment: string,
    _showEmojiPicker: boolean,
    _setPicker: React.Dispatch<React.SetStateAction<boolean>>,
    _setNewComment: React.Dispatch<React.SetStateAction<string>>
  ) => {},
  postChanged: false,
  setChanged: (_newValue: React.SetStateAction<boolean>) => {},
});

export const PostContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [postChanged, setChanged] = useState<boolean>(false);
  const dispatch = useDispatch();
  const userData = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );
  const posts = useSelector(
    (state: { allPosts: { posts: postDetails[] } }) => state.allPosts.posts
  );

  async function likePostHandler(
    event: React.MouseEvent<HTMLImageElement | HTMLButtonElement>,
    post: postDetails
  ) {
    console.log("called");
    setChanged(true);
    const liked = userData.likedPosts.includes(post.id);
    if (
      (event.currentTarget.tagName == "IMG" && !liked) ||
      event.currentTarget.tagName == "BUTTON"
    ) {
      dispatch(
        allPostsActions.updateLikes({
          postID: post.id,
          posts,
          type: liked ? "decrease" : "increase",
        })
      );
      dispatch(
        currentUserActions.updateUserData({
          likedPost: post.id,
          type: "likedpost",
        })
      );
      await axios
        .put(
          "http://localhost:3000/update-document",
          { id: post.id },
          {
            params: { updateType: liked ? "removelikedpost" : "newlikedpost" },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .catch((error) => console.log(error));
    }
  }

  async function addCommentHandler(
    post: postDetails,
    comment: string,
    showEmojiPicker: boolean,
    setPicker: React.Dispatch<React.SetStateAction<boolean>>,
    setNewComment: React.Dispatch<React.SetStateAction<string>>
  ) {
    showEmojiPicker ? setPicker(!showEmojiPicker) : null;
    setNewComment("");
    setChanged(true);
    dispatch(
      allPostsActions.updateComments({
        comment: {
          comment: comment,
          profilePic: userData.profilePic,
          username: userData.username,
        },
        postID: post.id,
      })
    );
  }

  async function savedPostHandler(post: postDetails) {
    setChanged(true);
    const saved = userData.savedPosts.includes(post.id);
    dispatch(
      currentUserActions.updateUserData({
        savedPost: post.id,
        type: "savedpost",
      })
    );
    await axios.put(
      "http://localhost:3000/update-document",
      { id: post.id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        params: { updateType: saved ? "removesavedpost" : "newsavedpost" },
      }
    );
  }

  const values = {
    likePostHandler,
    addCommentHandler,
    savedPostHandler,
    postChanged,
    setChanged,
  };

  return <PostContext.Provider value={values}>{children}</PostContext.Provider>;
};

export default PostContext;
