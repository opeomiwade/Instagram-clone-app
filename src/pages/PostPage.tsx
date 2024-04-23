import PostModal from "../components/PostModal";
import axios from "axios";
import { useEffect } from "react";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { postDetails } from "../types/types";
import { currentPostActions } from "../store/redux-store";
import { useDispatch } from "react-redux";
import { json } from "react-router-dom";

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
      } = await axios.get("https://instagram-clone-app-server.onrender.com/all-posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const [post] = posts.filter((post: postDetails) => post.id === postId);
      if (!post) {
        throw json({ message: "Post Not Found" });
      }
      return post;
    } catch (error) {
      console.log(error);
      throw json({ message: "Post Not Found" });
    }
  } else {
    return redirect("/home/messages");
  }
}

export default PostModalPage;
