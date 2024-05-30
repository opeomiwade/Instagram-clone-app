import { ChannelListMessengerProps, useChatContext } from "stream-chat-react";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NewChatIcon from "../NewChatIcon";
import NewMessageModal from "../Modals/NewMessageModal";
import { userDetails } from "../../types/types";
import { useDispatch, useSelector } from "react-redux";
import { newMessageModalActions } from "../../store/redux-store";

const Chats: React.FC<PropsWithChildren<ChannelListMessengerProps>> = ({
  children,
}) => {
  const { setActiveChannel } = useChatContext();
  const { client, channel } = useChatContext();
  const [smallScreen, setSmallScreen] = useState<boolean>();
  const [sidebarHeight, setHeight] = useState<number | undefined>();
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (smallScreen) {
      document
        .querySelector(
          ".str-chat.str-chat-channel.str-chat__channel > .str-chat__container"
        )
        ?.classList.add("smallChatView");
    } else {
      document
        .querySelector(
          ".str-chat.str-chat-channel.str-chat__channel > .str-chat__container"
        )
        ?.classList.remove("smallChatView");
    }
  }, [smallScreen, channel]);

  const currentUser = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData.username
  );

  function closeModal() {
    dispatch(newMessageModalActions.closeModal());
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
        closeNewMessageModal={closeModal}
        chatClickHandler={chatClickHandler}
      />
      <AnimatePresence>
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
              <button
                onClick={() => dispatch(newMessageModalActions.openModal())}
              >
                <NewChatIcon />
              </button>
            </div>
            {!smallScreen && <h2 className="font-bold text-md">Messages</h2>}
          </div>
          <div className="bg-white mt-4 overflow-y-auto">{children}</div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Chats;
