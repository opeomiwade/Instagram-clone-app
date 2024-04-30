import { ChannelListMessengerProps, useChatContext } from "stream-chat-react";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { motion } from "framer-motion";
import NewChatIcon from "../NewChatIcon";
import NewMessageModal from "../Modals/NewMessageModal";
import { useSelector } from "react-redux";
import { userDetails } from "../../types/types";

const Chats: React.FC<PropsWithChildren<ChannelListMessengerProps>> = ({
  children,
}) => {
  const [open, setOpen] = useState<boolean>();
  const { setActiveChannel } = useChatContext();
  const { client } = useChatContext();
  const [smallScreen, setSmallScreen] = useState<boolean>();
  const [sidebarHeight, setHeight] = useState<number | undefined>();

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 768) {
          setSmallScreen(true);
          setHeight(document.querySelector("aside")?.offsetHeight);
        } else {
          setSmallScreen(false);
          setHeight(document.querySelector("aside")?.offsetHeight);
        }
      }
    });
    resizeObserver.observe(document.documentElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const currentUser = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData.username
  );

  function showModal(value: boolean) {
    setOpen(value);
  }

  async function chatClickHandler(selectedUsers: userDetails[]) {
    try {
      const channel = client.channel("messaging", {
        members: [selectedUsers[0].username, currentUser],
      });
      await channel.watch();
      setActiveChannel(channel);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <NewMessageModal
        open={open!}
        showNewMessageModal={showModal}
        chatClickHandler={chatClickHandler}
      />

      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -200, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeIn" }}
        className={`${
          smallScreen ? `h-[calc(100vh-${sidebarHeight}px)]` : "h-full"
        } md:w-[400px] w-full z-10 bg-white border-x-[1px] shadow-lg border-gray-30`}
      >
        <div className="flex flex-col gap-8 p-4">
          <div className="flex justify-between w-full">
            {!smallScreen && (
              <h2 className="font-bold text-xl">{currentUser.username}</h2>
            )}
            <button onClick={() => setOpen(true)}>
              <NewChatIcon />
            </button>
          </div>
          {!smallScreen && <h2 className="font-bold text-md">Messages</h2>}
        </div>
        <div className="bg-white mt-4 overflow-y-auto">{children}</div>
      </motion.div>
    </>
  );
};

export default Chats;
