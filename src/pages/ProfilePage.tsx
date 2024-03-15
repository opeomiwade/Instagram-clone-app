import UserProfile from "../components/UserProfile";
import getUserDoc from "../util/getUserDoc";
import { useLoaderData, json } from "react-router";
import { useEffect } from "react";
import { sidebarActions, currentUserActions } from "../store/redux-store";
import { useDispatch } from "react-redux";
import axios from "axios";
import { PostContextProvider } from "../context/PostContext";

function ProfilePage() {
  const dispatch = useDispatch();
  const [userData, currentUserData] = useLoaderData() as [
    { [key: string]: any },
    { [key: string]: any }
  ];
  useEffect(() => {
    dispatch(sidebarActions.updateSidebarState("profile"));
    dispatch(currentUserActions.setCurrentUser({ userData: currentUserData }));
  });
  return (
    <PostContextProvider>
      <UserProfile userData={userData as {}} />
    </PostContextProvider>
  );
}

export async function loader({ request }: { request: Request }) {
  const urlPathName = new URL(request.url).pathname;
  const segments = urlPathName.split("/");
  const username = segments[segments.length - 1];
  const userData = await getUserDoc(username);
  let response;
  try {
    response = await axios.get("http://localhost:3000/user-data", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  } catch (error) {
    console.log(error);
  }
  if (!userData) {
    throw json({ message: "User Not Found", statusCode: 404 });
  }
  return [userData, response?.data.userData];
}

export default ProfilePage;
