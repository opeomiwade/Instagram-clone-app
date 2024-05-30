import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ChatView from "./ChatView";
import { userDetails } from "../types/types";
import { StreamChat } from "stream-chat";
import { AnimatePresence, motion } from "framer-motion";

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
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`${
          smallScreen
            ? `  h-[calc(100vh-${sidebarHeight}px)] flex-col ml-0 `
            : "ml-16 h-[100vh] "
        } flex w-full `}
      >
        <ChatView chatClient={client} userData={userData} />
      </motion.div>
    </AnimatePresence>
  );
};

export default Message;
