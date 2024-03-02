import Post from "./Post";
import PostModal from "./PostModal";
import { useEffect } from "react";
import { postDetails } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../util/http";
import { useSelector, useDispatch } from "react-redux";
import { allPostsActions } from "../store/redux-store";


function Feed() {
  const { data,isSuccess } = useQuery({
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
      <div className="flex flex-col mx-auto my-[90px]">
        {posts.length > 1 &&
          posts.map((post) => {
            return <Post key={post.id} post={post} />;
          })}
      </div>
    </>
  );
}

export default Feed;
