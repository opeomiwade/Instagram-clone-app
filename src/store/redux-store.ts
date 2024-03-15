import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { postDetails, userDetails } from "../types/types";

const currentPostSlice = createSlice({
  name: "current-post",
  initialState: { post: {} as postDetails },
  reducers: {
    setCurrentPost(state, action) {
      state.post = { ...action.payload };
    },

    increaseLikes(state) {
      state.post.likes = state.post.likes + 1;
    },

    decreaseLikes(state) {
      state.post.likes = state.post.likes - 1;
    },

    addComment(state, action) {
      state.post.comments.push(action.payload.newcomment);
    },
  },
});

const sideBarSlice = createSlice({
  name: "sidebar",
  initialState: {
    sidebarSelection: "home",
    createModal: false,
    sidebarText: false,
  },
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

    sidebarText(state, action) {
      state.sidebarText = action.payload;
    },
  },
});

const currentUserSlice = createSlice({
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

        case "likedpost":
          if (state.userData.likedPosts.includes(action.payload.likedPost)) {
            state.userData.likedPosts = state.userData.likedPosts.filter(
              (post: number) => post !== action.payload.likedPost
            );
          } else {
            state.userData.likedPosts.push(action.payload.likedPost);
          }
          break;

        case "savedpost":
          if (state.userData.savedPosts.includes(action.payload.savedPost)) {
            state.userData.savedPosts = state.userData.savedPosts.filter(
              (post: number) => post !== action.payload.savedPost
            );
          } else {
            state.userData.savedPosts.push(action.payload.savedPost);
          }

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

        case "followaction":
          if (state.userData.following.includes(action.payload.username)) {
            state.userData.following = state.userData.following.filter(
              (username: string) => username !== action.payload.username
            );
          } else {
            state.userData.following.push(action.payload.username);
          }
          break;

        case "removefollower":
          state.userData.followers = state.userData.followers.filter(
            (username: string) => username != action.payload.username
          );
          break;

        case "deletepost":
          state.userData.posts = state.userData.posts.filter(
            (post: postDetails) => post.id != action.payload.postId
          );
          break;
        case "archive-action":
          if (
            state.userData.archivedPosts.some((post:postDetails) => post.id === action.payload.post.id)
          ) {
            state.userData.archivedPosts = state.userData.archivedPosts.filter(
              (post: postDetails) => post.id !== action.payload.post.id
            );
          } else {
            state.userData.archivedPosts.push(action.payload.post);
          }
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
  initialState: { posts: [] as postDetails[] },
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

const recentSearches = createSlice({
  name: "recent searches",
  initialState: { recents: [] as userDetails[] },
  reducers: {
    setRecentSearches(state, action) {
      state.recents = [...state.recents, action.payload.recent];
    },
    clear(state) {
      state.recents = [];
    },
    removeSearch(state, action) {
      state.recents = state.recents.filter(
        (user) => user.username !== action.payload.username
      );
    },
  },
});

const store = configureStore({
  reducer: {
    currentPost: currentPostSlice.reducer,
    sidebar: sideBarSlice.reducer,
    currentUser: currentUserSlice.reducer,
    allPosts: allPosts.reducer,
    recents: recentSearches.reducer,
  },
});

export default store;
export const currentPostActions = currentPostSlice.actions;
export const sidebarActions = sideBarSlice.actions;
export const currentUserActions = currentUserSlice.actions;
export const allPostsActions = allPosts.actions;
export const recentsActions = recentSearches.actions;
