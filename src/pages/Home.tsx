import { redirect } from "react-router";
import Feed from "../components/Feed";
import axios from "axios";
import { useLoaderData } from "react-router";
import { useDispatch } from "react-redux";
import { currentUserActions, sidebarActions } from "../store/redux-store";
import { useEffect } from "react";
import { PostContextProvider } from "../context/PostContext";

function Home() {
  const currentUserData = useLoaderData();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      currentUserActions.setCurrentUser(
        currentUserData as { userData: { [key: string]: any } }
      )
    );
    dispatch(sidebarActions.updateSidebarState("home"));
  }, []);

  return (
    <PostContextProvider>
      <Feed />
    </PostContextProvider>
  );
}

export async function loader() {
  if (!localStorage.getItem("accessToken")) {
    return redirect("/");
  } else {
    try {
      const response = await axios.get("https://instagram-clone-app-server.onrender.com/user-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  return null;
}

export default Home;
