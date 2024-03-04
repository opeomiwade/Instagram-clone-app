import { motion } from "framer-motion";
import { useState } from "react";
import { useSelector } from "react-redux";
import NewChatIcon from "./NewChatIcon";
import { useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NewMessageModal from "./NewMessageModal";
import ChatView from "./ChatView";
import { userDetails } from "../types/types";
import queryClient from "../util/http";
import { getAllUsers } from "../util/getUserDoc";

function Message() {
  const [openModal, setOpen] = useState<boolean>();

  const userData = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );
  const [smallScreen, setsmallScreen] = useState<boolean | undefined>();
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
  }, []);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [chatUsers, setUser] = useState<userDetails[]>();

  function showModal(value: boolean) {
    setOpen(value);
  }

  async function chatClickHandler(selectedUsers: string[]) {
    let allUsers = await queryClient.fetchQuery({
      queryKey: ["all-users"],
      queryFn: getAllUsers,
    });
    setUser(() => {
      return allUsers.filter((user) => user.username === selectedUsers[0]);
    });
    setShowChat(true)
  }

  return (
    <div
      className={`${
        smallScreen ? "flex-col ml-0" : ""
      } flex ml-16  h-[100vh] w-full`}
    >
      <NewMessageModal
        open={openModal!}
        showModal={showModal}
        chatClickHandler={chatClickHandler}
      />
      {!smallScreen && (
        <>
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeIn" }}
            className=" h-full border-r-2 w-[400px] p-4 z-10 shadow-sm bg-white"
          >
            <div className="flex flex-col gap-8">
              <div className="flex justify-between w-full">
                <h2 className="font-bold text-xl">{userData.username}</h2>
                <button onClick={() => setOpen(true)}>
                  <NewChatIcon />
                </button>
              </div>
              <h2 className="font-bold text-md">Messages</h2>
            </div>
            <div className="bg-black mt-4 overflow-y-auto"></div>
          </motion.div>
          {showChat ? (
            <ChatView selectedUsers={chatUsers!} />
          ) : (
            <div className="h-full w-full flex flex-col gap-4 items-center justify-center ">
              <h2 className="font-bold text-xl">Your Messages</h2>
              <p className="text-gray-400 text-xs">
                Send messages and pictures to friend{" "}
              </p>
              <button
                className="bg-blue-500 p-2 rounded-lg text-white font-semibold text-sm "
                onClick={() => setOpen(true)}
              >
                Send a message
              </button>
            </div>
          )}
        </>
      )}
      {smallScreen && (
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
      )}
    </div>
  );
}

export default Message;
