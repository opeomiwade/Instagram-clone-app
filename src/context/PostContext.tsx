import React, { ReactNode, createContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allPostsActions, currentUserActions } from "../store/redux-store";
import { postDetails } from "../types/types";
import { updateDoc } from "../util/http";

const PostContext = createContext({
  likePostHandler: async (
    _event: React.MouseEvent<HTMLImageElement | HTMLButtonElement>,
    _post: postDetails
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
  deletePostHandler: (_postId: string) => {},
  archivePostHandler: (_post: postDetails) => {},
  unArchivePostHandler: (_post: postDetails) => {},
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
      let updateType = liked ? "removelikedpost" : "newlikedpost";
      updateDoc(
        localStorage.getItem("accessToken")!,
        { id: post.id },
        updateType
      );
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

  function deletePostHandler(postId: string) {
    dispatch(
      currentUserActions.updateUserData({ postId: postId, type: "deletepost" })
    );
  }

  function archivePostHandler(post: postDetails) {
    dispatch(
      currentUserActions.updateUserData({ post: post, type: "archive-action" })
    );
    dispatch(
      currentUserActions.updateUserData({
        postId: post.id,
        type: "deletepost",
      })
    );
  }

  function unArchivePostHandler(post: postDetails) {
    dispatch(
      currentUserActions.updateUserData({ post: post, type: "archive-action" })
    );
    dispatch(
      currentUserActions.updateUserData({ newPost: post, type: "newpost" })
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
    let updateType = saved ? "removesavedpost" : "newsavedpost";
    updateDoc(
      localStorage.getItem("accessToken")!,
      { id: post.id },
      updateType
    );
  }

  const values = {
    likePostHandler,
    addCommentHandler,
    savedPostHandler,
    postChanged,
    setChanged,
    deletePostHandler,
    archivePostHandler,
    unArchivePostHandler,
  };

  return <PostContext.Provider value={values}>{children}</PostContext.Provider>;
};

export default PostContext;
