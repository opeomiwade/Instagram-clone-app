import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatView from "./ChatView";
import { userDetails } from "../types/types";
import { StreamChat } from "stream-chat";

const Message: React.FC<{ client: StreamChat }> = ({ client }) => {
  const [smallScreen, setsmallScreen] = useState<boolean | undefined>();
  const [sidebarHeight, setHeight] = useState<number | undefined>();

  const userData = useSelector(
    (state: { currentUser: { userData: userDetails } }) =>
      state.currentUser.userData
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 768) {
          setsmallScreen(true);
          setHeight(document.querySelector("aside")?.offsetHeight);
        } else {
          setsmallScreen(false);
          setHeight(document.querySelector("aside")?.offsetHeight);
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
        smallScreen ? `flex-col ml-0 h-[calc(100vh-${sidebarHeight}px)]` : "ml-16 h-[100vh] "
      } flex w-full`}
    >
      <ChatView chatClient={client} userData={userData} />
    </div>
  );
};

export default Message;
