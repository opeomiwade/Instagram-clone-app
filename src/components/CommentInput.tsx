import EmojiPicker from "emoji-picker-react";
import EmojiSVG from "./EmojiSVG";
import { useRef } from "react";
import { CommentInputProps } from "../types/types";

const CommentInput: React.FC<CommentInputProps> = ({
  comment,
  showEmojiPicker,
  addCommentClickHandler,
  emojiButtonHandler,
  changeHandler,
  onEmojiClick,
  dialog,
}) => {
  const inputRef = useRef<HTMLInputElement>();
  return (
    <div className="flex w-full justify-between py-2">
      <input
        name="comment"
        className="text-[13px] w-full hover: cursor-text p-2 focus: outline-none placeholder:text-[15px] h-[2rem]"
        placeholder="Add a Comment..."
        ref={inputRef as React.Ref<HTMLInputElement>}
        value={comment}
        onChange={(event) => changeHandler(event)}
      />
      {comment && comment.length > 0 && (
        <button
          className={`text-blue-500 font-bold hover:cursor-pointer ${
            comment.trim().length > 0 ? "visible" : "invisible"
          }`}
          onClick={() => {
            addCommentClickHandler();
          }}
        >
          Post
        </button>
      )}

      <div className="hover:cursor-pointer my-auto p-2 relative">
        <button onClick={() => emojiButtonHandler()}>
          <EmojiSVG />
        </button>
        {showEmojiPicker && (
          <div className={`absolute bottom-[100%] min-h-[200px] min-w-[100px] ${dialog! ? "right-0" : "" }`}>
            <EmojiPicker
              style={{ height: "400px", width: "300px" }}
              onEmojiClick={(emojiObj) => onEmojiClick(emojiObj)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentInput;
