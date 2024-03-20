import {
  useMessageInputContext,
} from "stream-chat-react";
import EmojiSVG from "./EmojiSVG";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useState } from "react";

const MessageInput = () => {
  const [openPicker, setOpen] = useState<boolean>();
  const { handleSubmit, setText, text } = useMessageInputContext();

  function emojiClickHandler(emojiObj: EmojiClickData) {
    console.log(text);
    setText(text + " " + emojiObj.emoji);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex z-20 border-[1px] border-gray-300 items-center justify-center mb-4 p-2 w-[95%] mx-auto rounded-full gap-2 relative"
    >
      <span
        className="hover:cursor-pointer"
        onClick={() => setOpen(!openPicker)}
      >
        <EmojiSVG />
      </span>
      {openPicker && (
        <div className="absolute left-[0px] bottom-[100%] min-h-[200px] min-w-[100px]">
          <EmojiPicker
            onEmojiClick={(emojiObj) => {
              console.log("clicked");
              emojiClickHandler(emojiObj);
            }}
          />
        </div>
      )}
      <input
        value={text}
        className="focus: outline-none h-10 w-full "
        placeholder="Message..."
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setText(event.target.value);
        }}
      />
      <button
        className={`font-bold absolute right-4 ${
          text.length > 0 ? "text-blue-500" : "text-blue-300"
        }`}
        type="submit"
        disabled={text.length < 1}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
