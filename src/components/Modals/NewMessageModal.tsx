import React, { useRef, useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import classes from "../../CSS/Modal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import queryClient from "../../util/http";
import getUserDoc, { getAllUsers } from "../../util/getUserDoc";
import { userDetails } from "../../types/types";
import UserSearchResult from "../UserSearchResult";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { postDetails } from "../../types/types";
import { sharePost } from "../../util/http";
import PostContext from "../../context/PostContext";

const NewMessageModal: React.FC<{
  open: boolean;
  modalTitle?: string;
  showNewMessageModal: (value: boolean) => void;
  chatClickHandler?: (selectedUsers: userDetails[]) => void;
}> = ({ open, showNewMessageModal, chatClickHandler, modalTitle }) => {
  const dialogRef = useRef<HTMLDialogElement>();
  const inputRef = useRef<HTMLInputElement>();
  const [searchResults, setResults] = useState<userDetails[]>();
  const [selectedUsers, setSelectedUsers] = useState<userDetails[]>([]);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [showErrorDiv, setShow] = useState<boolean>();
  const userData = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );
  const { postToShare, setPostToShare } = useContext(PostContext);

  const messageInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (selectedUsers.length < 1) {
      // disable chat button if no user was selcted for a chat
      setDisabled(true);
    }
  }, [selectedUsers]);

  async function inputChangeHandler(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    let users = await queryClient.fetchQuery({
      queryKey: ["all-users"],
      queryFn: getAllUsers,
    });
    if (event.target.value.trim() !== "") {
      let result = users?.filter(
        (user) =>
          user.username
            .toLowerCase()
            .includes(event.target.value.trim().toLowerCase()) ||
          user.name
            .toLowerCase()
            .includes(event.target.value.trim().toLowerCase())
      );
      setResults(result);
    } else {
      setResults([]);
    }
  }

  async function searchResultClickHandler(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    if (event.currentTarget?.id !== userData.username) {
      setShow(false);
      setDisabled(false);
      const clickedUser = (await getUserDoc(
        event.currentTarget.id
      )) as userDetails;
      setSelectedUsers((prevState: userDetails[]) => {
        // checks if array contains object
        if (
          selectedUsers.some(
            (selectedUser) => selectedUser.username == clickedUser.username
          )
        ) {
          return selectedUsers.filter(
            (selectedUser) => selectedUser.username != clickedUser.username
          );
        }
        return [...prevState, clickedUser];
      });
      inputRef.current!.value = "";
    } else {
      setShow(true);
    }
  }

  function chatPartnerBubbleClickHandler(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    const clickedUsername = event.currentTarget.id;
    setSelectedUsers((state: userDetails[]) => {
      return state.filter(
        (selectedUser) => selectedUser.username != clickedUsername
      );
    });
    setResults([]);
  }

  return createPortal(
    <dialog
      open={open}
      className={`${classes.modal} ${open && "flex"} !z-50`}
      ref={dialogRef as React.Ref<HTMLDialogElement>}
      onClose={() => {
        messageInputRef.current!.value = "";
        inputRef.current!.value = "";
        setResults([]);
        setSelectedUsers([]);
      }}
    >
      <div className="relative bg-white rounded-md h-[500px] w-[600px]">
        <div className="flex m-4 items-center justify-end gap-52">
          <h2 className="font-bold w-fit">
            {modalTitle ? modalTitle : "New Message"}
          </h2>
          <button
            className="relative left-2 hover:cursor-pointer"
            onClick={() => {
              dialogRef.current?.close();
              showNewMessageModal(false);
            }}
          >
            <CloseIcon style={{ fontSize: "2rem" }} />
          </button>
        </div>

        <div className="flex items-center gap-2 p-2 border-y-[1px] border-gray-200">
          <h3 className="font-bold">To: </h3>
          {selectedUsers &&
            selectedUsers!.length > 0 &&
            selectedUsers.map((selectedUser) => (
              <div
                key={selectedUser.username}
                className="flex items-center bg-blue-50 text-blue-500 text-sm font-bold rounded-lg w-fit px-2 gap-2"
              >
                {selectedUser.username}
                <button
                  id={selectedUser.username}
                  onClick={chatPartnerBubbleClickHandler}
                >
                  <CloseIcon
                    style={{ fontSize: "1rem", fill: "(rgb(59 130 246)" }}
                  />
                </button>
              </div>
            ))}
          <input
            className="w-full hover:cursor-text focus: outline-none"
            placeholder="Search..."
            onChange={inputChangeHandler}
            ref={inputRef as React.Ref<HTMLInputElement>}
          />
          <AnimatePresence>
            {(inputRef.current && inputRef.current!.value.length < 1) ||
              (showErrorDiv && (
                <motion.div
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mx-auto text-red-500 bg-red-200 text-xs p-2 rounded-md w-[600px]"
                >
                  Cant chat with yourself, pick someone else
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
        <div className="h-auto w-full overflow-y-auto">
          {searchResults && searchResults.length > 0 ? (
            searchResults?.map((user) => (
              <UserSearchResult
                key={user.username}
                user={user}
                clickHandler={searchResultClickHandler}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm p-2">No accounts found.</p>
          )}
        </div>
        <div className="absolute bottom-4 w-full flex justify-center flex-col">
          <AnimatePresence>
            {selectedUsers.length > 0 && modalTitle === "Share" && (
              <motion.div
                initial={{ y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                exit={{ opacity: 0, y: 10 }}
                className="my-2"
              >
                <hr />
                <input
                  ref={messageInputRef as React.Ref<HTMLInputElement>}
                  placeholder="Write a Message.... "
                  className="mx-4 p-2 text-left rounded-lg focus:outline-none w-[80%]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className={`mx-4 rounded-lg p-2 text-sm text-white font-semibold bg-blue-500 hover:bg-blue-600`}
            disabled={disabled}
            onClick={() => {
              if (modalTitle === "Share") {
                sharePost(
                  postToShare,
                  [selectedUsers[0].username, userData.username],
                  `${window.location.origin}/p/${postToShare.id}`,
                  messageInputRef.current?.value
                );
                setPostToShare({} as postDetails);
                showNewMessageModal(false);
              } else {
                chatClickHandler && chatClickHandler(selectedUsers);
                setSelectedUsers([])
                setResults([])
                dialogRef.current?.close();
                showNewMessageModal(false);
              }
            }}
          >
            {modalTitle ? "Send" : "Chat"}
          </button>
        </div>
      </div>
    </dialog>,
    document.getElementById("modal")!
  );
};

export default NewMessageModal;
