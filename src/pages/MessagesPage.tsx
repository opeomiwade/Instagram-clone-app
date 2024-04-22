import { useEffect } from "react";
import Message from "../components/MessageView";
import axios from "axios";
import { useDispatch } from "react-redux";
import { currentUserActions, sidebarActions } from "../store/redux-store";
import { useLoaderData, redirect } from "react-router";
import { StreamChat } from "stream-chat";

function MessagesPage() {
  const { userData, chatClient } = useLoaderData() as { [key: string]: any };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(currentUserActions.setCurrentUser(userData));
    dispatch(sidebarActions.updateSidebarState("messages"));
  }, []);

  return <Message client={chatClient!} />;
}

export default MessagesPage;

export async function loader() {
  if (localStorage.getItem("accessToken")) {
    try {
      const response = await axios.get("http://localhost:3000/user-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const { userData } = response.data;
      // set up streamchat
      const chatClient = new StreamChat(import.meta.env.VITE_STREAM_API_KEY);

      // if both these things are true then do nothing, so the same user is not connected twice.
      if (
        chatClient.tokenManager.token ==
          localStorage.getItem("streamAccessToken") &&
        chatClient.userID == userData.username
      ) {
        console.log("same user");
        return;
      }

      // ensnure userData is not undefined before trying to connect streamchat user.
      chatClient
        .connectUser(
          {
            id: userData.username,
            name: userData.name,
            image: userData.profilePic,
          },
          localStorage.getItem("streamAccessToken")
        )
        .then(() => {
          // ensures user is not connnected is useEffect is reinvoked before process finishes
        })
        .catch((error) => console.log(error));
      return { userData: response.data, chatClient };
    } catch (error) {
      console.log(error);
    }
  } else {
    return redirect("/home");
  }
}
