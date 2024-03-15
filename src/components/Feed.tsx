import Post from "./Post";
import PostModal from "./PostModal";
import { useEffect } from "react";
import { postDetails } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../util/http";
import { useSelector, useDispatch } from "react-redux";
import { allPostsActions } from "../store/redux-store";
import { CircularProgress } from "@mui/material";

function Feed() {
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["all-posts"],
    queryFn: getPosts,
    staleTime: 30000,
  });
  const dispatch = useDispatch();
  const posts = useSelector(
    (state: { allPosts: { posts: postDetails[] } }) => state.allPosts.posts
  );
  useEffect(() => {
    if (isSuccess) {
      dispatch(allPostsActions.setPosts(data?.posts));
    }
  }, [data, isSuccess, dispatch]);

  return (
    <>
      <PostModal />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className="flex flex-col mx-auto my-[90px]">
          {posts.length > 0 ? (
            posts.map((post) => {
              return <Post key={post.id} post={post} />;
            })
          ) : (
            <h1 className="font-bold text-2xl">No Posts</h1>
          )}
        </div>
      )}
    </>
  );
}

export default Feed;
