import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import classes from "../CSS/Modal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import queryClient from "../util/http";
import getUserDoc, { getAllUsers } from "../util/getUserDoc";
import { userDetails } from "../types/types";
import UserSearchResult from "./UserSearchResult";

const NewMessageModal: React.FC<{
  open: boolean;
  showNewMessageModal: (value: boolean) => void;
  chatClickHandler: (selectedUsers: userDetails[]) => void;
}> = ({ open, showNewMessageModal, chatClickHandler }) => {
  const dialogRef = useRef<HTMLDialogElement>();
  const inputRef = useRef<HTMLInputElement>();
  const [searchResults, setResults] = useState<userDetails[]>();
  const [selectedUsers, setSelectedUsers] = useState<userDetails[]>([]);
  const [disabled, setDisabled] = useState<boolean>(true);

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
    setDisabled(false);
    const clickedUser = await getUserDoc(event.currentTarget.id);
    setSelectedUsers((prevState: userDetails[]) => {
      return [...prevState, clickedUser as userDetails];
    });
    inputRef.current!.value = "";
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
      className={`${classes.modal} ${open && "flex"}`}
      ref={dialogRef as React.Ref<HTMLDialogElement>}
      onClose={() => {
        inputRef.current!.value = "";
        setResults([]);
        setSelectedUsers([]);
      }}
    >
      <div className="bg-white rounded-md h-[500px] w-[600px]">
        <div className="flex m-4 items-center justify-end gap-52">
          <h2 className="font-bold w-fit">New Message</h2>
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
        </div>
        <div className="h-[60%] w-full overflow-y-auto">
          {searchResults && searchResults.length > 0 ? (
            searchResults?.map((user) => (
              <UserSearchResult
                key={user.username}
                name={user.name}
                username={user.username}
                profilePic={user.profilePic}
                clickHandler={searchResultClickHandler}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm p-2">No accounts found.</p>
          )}
        </div>
        <button
          className={`w-[90%] ml-8 rounded-lg  p-2 text-sm text-white font-semibold hover:cursor-pointer ${
            disabled ? "bg-blue-300" : "bg-blue-500"
          }`}
          disabled={disabled}
          onClick={() => {
            chatClickHandler(selectedUsers);
            dialogRef.current?.close();
            showNewMessageModal(false);
          }}
        >
          Chat
        </button>
      </div>
    </dialog>,
    document.getElementById("modal")!
  );
};

export default NewMessageModal;
