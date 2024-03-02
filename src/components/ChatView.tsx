import React, { useState } from "react";
import { userDetails } from "../types/types";
import EmojiPicker from "emoji-picker-react";
import EmojiSVG from "./EmojiSVG";

const ChatView: React.FC<{ selectedUsers: userDetails[] }> = ({
  selectedUsers,
}) => {
  const [openPicker, setOpen] = useState<boolean>();
  const [inputText, setText] = useState<string>("");

  function emojiClickHandler(emojiObj: { [key: string]: any }) {
    setText((prevText) => prevText + " " + emojiObj.emoji);
  }

  return (
    <div className="w-full">
      <div className="flex gap-2 p-2 m-2 text-lg items-center">
        <img
          src={selectedUsers && selectedUsers[0].profilePic}
          className="rounded-full w-[40px] h-[40px]"
        />
        <h2 className="font-bold">
          {selectedUsers && selectedUsers[0].username}
        </h2>
      </div>
      <hr />
      <div className="h-[80%] w-full"></div>
      <div className="flex z-20 border-[1px] border-gray-300 items-center p-2 w-[95%] mx-auto rounded-full gap-2 relative">
        <button
          className="hover:cursor-pointer"
          onClick={() => setOpen(!openPicker)}
        >
          <EmojiSVG />
        </button>
        {openPicker && (
          <div className="absolute bottom-[100%] min-h-[200px] min-w-[100px]">
            <EmojiPicker
              onEmojiClick={(emojiObj) => emojiClickHandler(emojiObj)}
            />
          </div>
        )}
        <input
          value={inputText}
          className="focus: outline-none"
          placeholder="Message..."
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setText(event.target.value)
          }
        />
        <button
          className={`font-bold absolute right-4 ${
            inputText.length < 1 ? "text-blue-300" : "text-blue-500"
          }`}
          disabled={inputText.length < 1}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatView;
