import PostModal from "../components/PostModal";
import axios from "axios";
import { useEffect } from "react";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { postDetails } from "../types/types";
import { currentPostActions } from "../store/redux-store";
import { useDispatch } from "react-redux";

function PostModalPage() {
  const post = useLoaderData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(currentPostActions.setCurrentPost(post));

    return () => {
      navigate(-1);
    };
  }, []);
  return <PostModal />;
}

export async function loader({ request }: { request: Request }) {
  const pathName = new URL(request.url).pathname;
  const postId = pathName.split("/").pop();
  if (localStorage.getItem("accessToken")) {
    try {
      const {
        data: { posts },
      } = await axios.get("http://localhost:3000/all-posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const [post] = posts.filter((post: postDetails) => post.id === postId);
      return post;
    } catch (error) {
      console.log(error);
    }
  } else {
    return redirect("/home/messages");
  }
}

export default PostModalPage;
