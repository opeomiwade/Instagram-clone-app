import { ChannelListMessengerProps, useChatContext } from "stream-chat-react";
import React, { Key, useEffect, useState } from "react";
import { motion } from "framer-motion";
import NewChatIcon from "./NewChatIcon";
import NewMessageModal from "./NewMessageModal";
import { useSelector } from "react-redux";
import { userDetails } from "../types/types";

const Chats: React.FC<ChannelListMessengerProps> = ({ loadedChannels }) => {
  const [open, setOpen] = useState<boolean>();
  const { channel: activeChannel, setActiveChannel } = useChatContext();
  const { client } = useChatContext();

  const currentUser = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData.username
  );

  function showModal(value: boolean) {
    setOpen(value);
  }
  useEffect(() => {

  })

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
        className=" h-full w-[400px] z-10 bg-white border-x-[1px] shadow-lg border-gray-300"
      >
        <div className="flex flex-col gap-8 p-4">
          <div className="flex justify-between w-full">
            <h2 className="font-bold text-xl">{"ope123"}</h2>
            <button onClick={() => setOpen(true)}>
              <NewChatIcon />
            </button>
          </div>
          <h2 className="font-bold text-md">Messages</h2>
        </div>
        <div className="bg-white mt-4 overflow-y-auto">
          {loadedChannels?.map((loadedChannel) => {
            const [partner] = Object.values(loadedChannel.state.members).filter(
              (member) => member.user_id != currentUser
            );
            const isActive = loadedChannel == activeChannel;
            const lastMessage = loadedChannel.lastMessage();
            return (
              <button
                key={loadedChannel.data!.cid as Key}
                disabled={isActive}
                onClick={() => {
                  setActiveChannel(loadedChannel);
                }}
                className={`flex flex-start items-center justify-between gap-4 p-2 h-[80px] text-black hover:bg-gray-200 w-full ${
                  isActive ? "bg-gray-200" : ""
                }`}
              >
                <div className="flex flex-row gap-2 items-center">
                  <img
                    src={partner.user?.image}
                    className="rounded-full w-[50px] h-[50px]"
                  />
                  <div className="flex flex-col items-start">
                    <h4 className="font-bold text-md">{partner.user_id}</h4>
                    <p className="text-gray-500 text-sm truncate">
                      {lastMessage && lastMessage.text}
                    </p>
                  </div>
                </div>
                {/* <CircleIcon
                  style={{
                    fontSize: "10px",
                    color: "#3797f0",
                  }}
                /> */}
              </button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default Chats;
