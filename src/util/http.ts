import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { postDetails } from "../types/types";

const queryClient = new QueryClient();

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

export async function updateDoc(
  accessToken: string,
  requestBody: {},
  updateType?: string
) {
  try {
    await axios.put("https://instagram-clone-app-server.onrender.com/update-document", requestBody, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { updateType },
    });
  } catch (error) {
    console.log(error);
  }
}

export default queryClient;
