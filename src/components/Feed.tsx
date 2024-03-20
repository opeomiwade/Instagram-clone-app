import Post from "./Post";
import PostModal from "./PostModal";
import { useEffect } from "react";
import { postDetails } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import queryClient, { getPosts } from "../util/http";
import { useSelector, useDispatch } from "react-redux";
import { allPostsActions } from "../store/redux-store";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

function Feed() {
  const { data, isSuccess, isFetching, isStale } = useQuery({
    queryKey: ["all-posts"],
    queryFn: getPosts,
    staleTime: 60000,
  });
  const dispatch = useDispatch();
  const posts = useSelector(
    (state: { allPosts: { posts: postDetails[] } }) => state.allPosts.posts
  );

  useEffect(() => {
    if (isSuccess) {
      dispatch(allPostsActions.setPosts(data?.posts));
    }
    // on initial render, fetch new posts and/or post with updated info.
    queryClient.invalidateQueries({ queryKey: ["all-posts"] });
  }, [data, isSuccess, dispatch]);

  return (
    <>
      <PostModal />
      <div
        className={`flex flex-col mx-auto ${
          isFetching ? "justify-center items-center h-[100vh]" : "my-[90px]"
        }`}
      >
        {isStale && !isFetching && (
          <motion.button
            initial={{ x: 0, y: -100 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{
              type: "spring",
              duration: 1,
              ease: "easeIn",
              stiffness: "100",
            }}
            className="rounded-lg bg-white font-bold p-2 z-50 shadow-lg w-[100px] mx-auto"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["all-posts"] })
            }
          >
            New Posts
          </motion.button>
        )}
        {isFetching ? (
          <CircularProgress />
        ) : posts.length > 0 ? (
          posts.map((post) => {
            return <Post key={post.id} post={post} />;
          })
        ) : (
          <h1 className="font-bold text-2xl h-[100vh] items-center justify-center">
            No Posts
          </h1>
        )}
      </div>
    </>
  );
}

export default Feed;
