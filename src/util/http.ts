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

export async function updatePost(updatedPost: postDetails) {
  try {
    const response = await axios.put("http://localhost:3000/update-document",updatedPost, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      }, params:{updateType:"updatepost"}
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export default queryClient;
