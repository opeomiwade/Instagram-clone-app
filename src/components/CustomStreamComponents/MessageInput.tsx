import {
  CloseIcon,
  useChannelActionContext,
  useChannelStateContext,
  useMessageInputContext,
} from "stream-chat-react";
import EmojiSVG from "../EmojiSVG";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useState, useRef } from "react";
import ImageIcon from "@mui/icons-material/Image";
import CancelIcon from "@mui/icons-material/Cancel";

const MessageInput: React.FC = () => {
  const [openPicker, setOpen] = useState<boolean>();
  const {
    handleSubmit,
    setText,
    text,
    uploadNewFiles,
    imageUploads,
    removeImage,
  } = useMessageInputContext();
  const { quotedMessage } = useChannelStateContext();
  const { setQuotedMessage } = useChannelActionContext();
  const fileInputRef = useRef<HTMLInputElement>();

  function emojiClickHandler(emojiObj: EmojiClickData) {
    setText(text + " " + emojiObj.emoji);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.currentTarget.files;
    if (files && files.length > 0) {
      uploadNewFiles(files);
    }
    fileInputRef.current!.value = "";
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleSubmit(event);
  }

  return (
    <>
      {quotedMessage && (
        <div className="bg-gray-100 p-2 rounded-lg w-[30%] mx-auto mb-2 flex flex-row justify-between items-center">
          <hr />
          <div>
            <p className="font-bold text-sm">Reply To Message</p>
            <p>{quotedMessage.text}</p>
          </div>
          <button onClick={() => setQuotedMessage(undefined)}>
            <CloseIcon />
          </button>
        </div>
      )}
      <div
        className={`flex flex-col z-20 border-[1px] border-gray-300 mb-4 ${
          Object.values(imageUploads).length > 0 ? "rounded-md" : "rounded-full"
        } w-[95%] mx-auto p-2`}
      >
        <div className="flex">
          {Object.values(imageUploads).length > 0 &&
            Object.values(imageUploads).map((image) => {
              console.log(image);
              return (
                <div className="relative hover:cursor-pointer">
                  <div
                    className="absolute"
                    onClick={() => {
                      removeImage(image.id);
                      fileInputRef.current!.value = "";
                    }}
                  >
                    <CancelIcon style={{ fill: "gray", fontSize: "20px" }} />
                  </div>
                  <img
                    key={image.id}
                    src={image.url}
                    className="m-2 w-[50px] h-[50px] rounded-sm"
                  />
                </div>
              );
            })}
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="flex items-center justify-center gap-2 relative w-full"
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
                  emojiClickHandler(emojiObj);
                }}
              />
            </div>
          )}
          <input
            ref={fileInputRef as React.Ref<HTMLInputElement>}
            hidden
            type="file"
            accept="/imageFile/png imageFile/jpeg imageFile/jpg "
            onChange={handleChange}
          />
          <input
            value={text}
            className="focus: outline-none h-10 w-full"
            placeholder="Message..."
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setText(event.target.value);
            }}
          />
          {text.length > 0 || Object.values(imageUploads).length > 0 ? (
            <button
              className="font-bold absolute right-4 text-blue-500"
              type="submit"
            >
              Send
            </button>
          ) : (
            <button
              className="absolute right-8"
              onClick={() => {
                fileInputRef.current?.click();
              }}
              type="button"
            >
              <ImageIcon
                style={{
                  fill: "white",
                  stroke: "black",
                  fontSize: "2rem",
                  strokeWidth: "2px",
                }}
              />
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default MessageInput;
