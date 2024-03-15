import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { postDetails } from "../types/types";

const queryClient = new QueryClient();

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
  requestBody: {},
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

export default queryClient;
