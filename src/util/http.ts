import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { postDetails, userDetails } from "../types/types";

const queryClient = new QueryClient();

/**
 * method get all posts from backend
 */
export async function getPosts() {
  try {
    const response = await axios.get("https://instagram-clone-app-server.onrender.com/all-posts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

/**
 * Updates user post in my firestore backend
 * @param {postDetails} updatedPost - updated user post
 * @returns {Promise<any>} A promise that resolves to the response data from the server.
 */
export async function updatePost(updatedPost: postDetails) {
  try {
    const response = await axios.put(
      "https://instagram-clone-app-server.onrender.com/update-document",
      updatedPost,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        params: { updateType: "updatepost" },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

/**
 * Method to update user document in firestore backend
 * @param {string} accessToken - user access token, used for authentication
 * @param {Object} requestBody - data passed to the backend
 * @param {string} updateType - Optional. Specifies the type of update.
 */
export async function updateDoc(
  accessToken: string,
  requestBody: any,
  updateType?: string
) {
  try {
    axios.put("https://instagram-clone-app-server.onrender.com/update-document", requestBody, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { updateType },
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * Returns a custom error message based on the Firebase Authentication error code.
 * @param {string} firebaseAuthError - The Firebase Authentication error code.
 * @returns {string} A custom error message corresponding to the provided error code.
 */
export function handleFirebaseAuthAPIError(firebaseAuthError: String) {
  let message;
  switch (firebaseAuthError) {
    case "auth/invalid-credential":
      message = "Your password or username is incorrect";
      break;
    case "auth/invalid-email":
      message = "Account with this email does not exist";
      break;
    case "auth/email-already-in-use":
      message = "Account with this email already exists";
      break;
    case "auth/too-many-requests":
      message = "Please try again later you have made too many failed attempts";
      break;
    case "auth/user-not-found":
      message =
        "There is no existing user record corresponding to the provided identifier.";
      break;
    case "auth/weak-password":
      message = "Weak password, should be at least 6 characters";
      break;
    default:
      message = firebaseAuthError;
      break;
  }
  return message;
}

/**
 * method to update stream chat user image
 * @param {userDetails} userData  object containing user details
 */
export async function updateStreamChatProfilePic(userData: userDetails) {
  await axios
    .post("https://instagram-clone-app-server.onrender.com/update-stream-user-data", {
      id: userData.username,
      name: userData.name,
      image: userData.profilePic,
    })
    .catch((error) => console.log(error));
}

/**
 *
 * @param post method to share post with specified user via backend
 * @param members
 * @param message
 * @param postUrl
 */
export function sharePost(
  post: postDetails,
  members: string[],
  postUrl: string,
  message?: string
) {
  axios
    .post("https://instagram-clone-app-server.onrender.com/send-post", {
      members,
      post,
      message,
      postUrl,
    })
    .then(() => {})
    .catch((error) => console.log(error));
}

export default queryClient;
