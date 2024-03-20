import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatView from "./ChatView";
import { userDetails } from "../types/types";
import { StreamChat } from "stream-chat";

const Message: React.FC<{ client: StreamChat }> = ({ client }) => {
  const [smallScreen, setsmallScreen] = useState<boolean | undefined>();

  const userData = useSelector(
    (state: { currentUser: { userData: userDetails } }) =>
      state.currentUser.userData
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 650) {
          setsmallScreen(true);
        } else {
          setsmallScreen(false);
        }
      }
    });
    resizeObserver.observe(document.documentElement);
    return () => {
      // cleanup function
      resizeObserver.disconnect();
    };
  }, [userData]);

  return (
    <div
      className={`${
        smallScreen ? "flex-col ml-0" : ""
      } flex ml-16  h-[100vh] w-full`}
    >
      <ChatView chatClient={client} userData={userData} />

      {/* {smallScreen && (
        <div className="flex flex-col gap-8 m-4  justify-center">
          <div className="flex justify-between w-full">
            <ArrowBackIcon />
            <h2 className="font-bold text-lg">{userData.username}</h2>
            <button onClick={() => setOpen(true)}>
              <NewChatIcon />
            </button>
          </div>
          <h2 className="font-bold text-md text-center">Messages</h2>
        </div>
      )} */}
    </div>
  );
};

export default Message;
