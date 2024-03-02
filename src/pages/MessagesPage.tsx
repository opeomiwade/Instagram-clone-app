import { useEffect } from "react";
import Message from "../components/Message";
import axios from "axios";
import { useDispatch } from "react-redux";
import { currentUserActions, sidebarActions } from "../store/redux-store";
import { useLoaderData } from "react-router";

function MessagesPage() {
  const currentUserData = useLoaderData();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      currentUserActions.setCurrentUser(
        currentUserData as { userData: { [key: string]: any } }
      )
    );
    dispatch(sidebarActions.updateSidebarState("messages"))
  }, []);
  return <Message />;
}

export default MessagesPage;

export async function loader() {
  try {
    const response = await axios.get("http://localhost:3000/user-data", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}