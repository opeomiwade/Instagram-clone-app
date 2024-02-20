import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { postDetails } from "../types/types";

const currentPostSlice = createSlice({
  name: "current-post",
  initialState: { post: {} as postDetails },
  reducers: {
    setCurrentPost(state, action) {
      state.post = { ...action.payload };
    },
  },
});

const sideBarSlice = createSlice({
  name: "sidebar",
  initialState: { sidebarSelection: "home", createModal: false },
  reducers: {
    updateSidebarState(state, action) {
      if (action.payload === "home") {
        state.sidebarSelection = "home";
      } else if (action.payload === "search") {
        state.sidebarSelection = "search";
      } else if (action.payload === "messages") {
        state.sidebarSelection = "messages";
      } else if (action.payload === "create") {
        state.createModal = !state.createModal;
      } else if (action.payload === "profile") {
        state.sidebarSelection = "profile";
      }
    },
  },
});

const userSlice = createSlice({
  name: "currentUser",
  initialState: { userData: {} as { [key: string]: any } },
  reducers: {
    setCurrentUser(state, action: PayloadAction<{ userData: any }>) {
      state.userData = { ...action.payload.userData };
    },
    updateUserData(state, action) {
      switch (action.payload.type) {
        case "newpost":
          state.userData.posts.push(action.payload.newPost);
          break;

        case "newlikedpost":
          state.userData.likedPosts.push(action.payload.likedPost);
          break;

        case "removelikedpost":
          state.userData.likedPosts = state.userData.likedPosts.filter(
            (post: number) => post !== action.payload.likedPost
          );
          break;

        case "newsavedpost":
          state.userData.savedPosts.push(action.payload.savedPost);
          break;

        case "removesavedpost":
          state.userData.savedPosts = state.userData.savedPosts.filter(
            (post: number) => post !== action.payload.savedPost
          );
          break;

        case "newcomment":
          const id = action.payload.postID;
          let posts = state.userData.posts.map((post: postDetails) => {
            if (post.id == id) {
              return {
                ...post,
                comments: [...post.comments, action.payload.comment],
              };
            } else {
              return post;
            }
          });
          state.userData = { ...state.userData, posts: posts };
          break;

        default:
          state.userData = { ...state.userData, ...action.payload.userData };
          break;
      }
    },
  },
});

const allPosts = createSlice({
  name: "allPosts",
  initialState: { posts: [{} as postDetails] },
  reducers: {
    setPosts(state, action) {
      state.posts = [...action.payload];
    },

    updateLikes(state, action) {
      const id = action.payload.postID;
      const posts = action.payload.posts;
      let updatedPosts = posts.map((post: postDetails) => {
        if (post.id == id) {
          return {
            ...post,
            likes:
              action.payload.type == "increase"
                ? post.likes + 1
                : post.likes - 1,
          };
        } else {
          return post;
        }
      });
      state.posts = [...updatedPosts];
    },

    updateComments(state, action) {
      const id = action.payload.postID;
      const newComment = action.payload.comment;
      let posts = state.posts.map((post: postDetails) => {
        if (post.id == id) {
          return { ...post, comments: [...post.comments, newComment] };
        } else {
          return post;
        }
      });
      state.posts = posts;
    },
  },
});

const store = configureStore({
  reducer: {
    currentPost: currentPostSlice.reducer,
    sidebar: sideBarSlice.reducer,
    currentUser: userSlice.reducer,
    allPosts: allPosts.reducer,
  },
});

export default store;
export const currentPostActions = currentPostSlice.actions;
export const sidebarActions = sideBarSlice.actions;
export const currentUserActions = userSlice.actions;
export const allPostsActions = allPosts.actions;
