import Post from "./Post";
import PostModal from "./Modals/PostModal";
import { useEffect, useState, useContext } from "react";
import { postDetails, userDetails } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import queryClient, { getPosts, updateDoc } from "../util/http";
import { useSelector, useDispatch } from "react-redux";
import { allPostsActions, newMessageModalActions } from "../store/redux-store";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import NewMessageModal from "./Modals/NewMessageModal";
import Suggestions from "./Suggestions";
import { getAllUsers } from "../util/getUserDoc";
import SearchBar from "./SearchBar";
import UserSearchResult from "./UserSearchResult";
import SearchContext from "../context/SearchContext";

function Feed() {
  const dispatch = useDispatch();
  const posts = useSelector(
    (state: { allPosts: { posts: postDetails[] } }) => state.allPosts.posts
  );
  const currentUser = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );
  const [suggestions, setSuggestions] = useState<userDetails[]>();
  const [showSuggestions, setShow] = useState<boolean>(true);
  const [smallScreen, setSmallScreen] = useState<boolean | undefined>(false);
  const ctx = useContext(SearchContext);

  const { data, isSuccess, isFetching, isStale } = useQuery({
    queryKey: ["all-posts"],
    queryFn: getPosts,
    staleTime: 60000,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const allUsers = (await queryClient.fetchQuery({
          queryKey: ["all-users"],
          queryFn: getAllUsers,
          staleTime: 60000,
        })) as userDetails[];
        setSuggestions(() => {
          if (currentUser.following && currentUser.following.length > 0) {
            return allUsers.filter(
              (user) =>
                user.username !== currentUser.username &&
                !currentUser.following.includes(user.username)
            );
          } else {
            return allUsers.filter(
              (user) => user.username !== currentUser.username
            );
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 1160) {
          setShow(false);
        } else {
          setShow(true);
        }
        if (entry.contentRect.width < 768) {
          setSmallScreen(true);
        } else {
          setSmallScreen(false);
        }
      }
    });
    resizeObserver.observe(document.documentElement);
    fetchData();

    return () => {
      resizeObserver.disconnect();
    };
  }, [currentUser.following]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(allPostsActions.setPosts(data.posts));
    }

    // // update archived posts of current user
    if (Object.keys(currentUser).length > 0)
      updateDoc(
        localStorage.getItem("accessToken") as string,
        currentUser
      ).then(() => {
        // on initial render, fetch new posts and/or post with updated info.
        queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      });
  }, [data, isSuccess, currentUser.archivedPosts]);

  function closeNewMessageModal() {
    dispatch(newMessageModalActions.closeModal());
  }

  return (
    <>
      <NewMessageModal
        modalTitle="Share"
        closeNewMessageModal={closeNewMessageModal}
      />
      <PostModal />
      <div className="flex flex-col mx-auto mt-4">
        {smallScreen && !isFetching &&  (
          <div className="z-30 w-[250px]">
            <SearchBar changeHandler={ctx.changeHandler} width="w-[250px]" />
            {ctx.results.length > 0 && (
              <div className="h-[80%] overflow-y-auto shadow-2xl rounded-lg p-4">
                {ctx.results.length === 0 ? (
                  <p className="text-center font-bold text-lg mt-8">
                    No User Found
                  </p>
                ) : (
                  ctx.results?.map((user) => {
                    return (
                      <UserSearchResult
                        key={user.username}
                        user={user}
                        clickHandler={ctx.clickHandler}
                      />
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mx-auto">
          <div
            className={`flex flex-col ${
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
                className="rounded-lg bg-white font-bold p-2 z-20 shadow-lg w-[100px] mx-auto"
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ["all-posts"] })
                }
              >
                New Posts
              </motion.button>
            )}
            {isFetching ? (
              <CircularProgress />
            ) : (
              <>
                {posts.length > 0 ? (
                  posts.map((post) => {
                    return <Post key={post.id} post={post} />;
                  })
                ) : (
                  <h1 className="font-bold text-2xl h-[100vh] items-center justify-center">
                    No Posts
                  </h1>
                )}
              </>
            )}
          </div>
          {suggestions && showSuggestions && (
            <Suggestions suggestions={suggestions as userDetails[]} />
          )}
        </div>
      </div>
    </>
  );
}
export default Feed;
