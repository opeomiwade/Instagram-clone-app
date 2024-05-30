import { redirect } from "react-router";
import Feed from "../components/Feed";
import axios from "axios";
import { useLoaderData } from "react-router";
import { useDispatch } from "react-redux";
import { currentUserActions, sidebarActions } from "../store/redux-store";
import { useEffect } from "react";
import { PostContextProvider } from "../context/PostContext";
import { SearchContextProvider } from "../context/SearchContext";

function Home() {
  const currentUserData = useLoaderData() as {
    userData: { [key: string]: any };
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUserActions.setCurrentUser(currentUserData));
    dispatch(sidebarActions.updateSidebarState("home"));
  }, []);

  return (
    <PostContextProvider>
      <SearchContextProvider>
        <Feed />
      </SearchContextProvider>
    </PostContextProvider>
  );
}

export async function loader() {
  if (!localStorage.getItem("accessToken")) {
    return redirect("/");
  } else {
    try {
      const response = await axios.get(
        "https://instagram-clone-app-server.onrender.com/user-data",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  return null;
}

export default Home;
