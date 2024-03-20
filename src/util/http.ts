import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { postDetails } from "../types/types";

const queryClient = new QueryClient();

/**
 *
 * @returns
 */
export async function getPosts() {
  try {
    const response = await axios.get("http://localhost:3000/all-posts", {
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
      "http://localhost:3000/update-document",
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
    await axios.put("http://localhost:3000/update-document", requestBody, {
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
 */
export async function updateStreamChatProfilePic(imageUrl: string) {}

export default queryClient;
