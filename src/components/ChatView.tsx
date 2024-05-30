import { userDetails } from "../types/types";
import { StreamChat } from "stream-chat";
import CustomMessageInput from "./CustomStreamComponents/MessageInput";
import "../CSS/stream-chat-message.css";
import {
  Chat,
  Channel,
  ChannelList,
  Thread,
  Window,
  MessageList,
  MessageInput,
} from "stream-chat-react";
import ChannelHeader from "./CustomStreamComponents/ChannelHeader";
import "stream-chat-react/dist/css/index.css";
import "../CSS/stream-chat-message.css";
import CustomChannelList from "./CustomStreamComponents/CustomChannelList";
import CustomDateSeparator from "./CustomStreamComponents/CustomDateSeparator";
import CustomChannelPreview from "./CustomStreamComponents/CustomChannelPreview";
import { useDispatch } from "react-redux";
import { newMessageModalActions } from "../store/redux-store";

const ChatView: React.FC<{
  chatClient: StreamChat;
  userData: userDetails;
}> = ({ chatClient, userData }) => {
  const { username } = userData;
  const filters = { members: { $in: [username] }, type: "messaging" };
  const options = { presence: true, state: true };
  const dispatch = useDispatch();

  const emptyPlaceHolder = (
    <div className="h-full flex flex-col gap-4 items-center justify-center ">
      <h2 className="font-bold text-xl">Your Messages</h2>
      <p className="text-gray-400 text-xs">
        Send messages and pictures to friend{" "}
      </p>
      <button
        className="bg-blue-500 p-2 rounded-lg text-white font-semibold text-sm "
        onClick={() => {
          dispatch(newMessageModalActions.openModal());
        }}
      >
        Send a message
      </button>
    </div>
  );

  return (
    <div
      className="w-full"
    >
      <Chat client={chatClient} theme="">
        <ChannelList
          List={CustomChannelList}
          Preview={CustomChannelPreview}
          EmptyStateIndicator={() => <></>}
          filters={filters}
          options={options}
          sort={{ last_message_at: -1 }}
          setActiveChannelOnMount={false}
        />
        <Channel
          Avatar={() => <></>}
          DateSeparator={CustomDateSeparator}
          EmptyPlaceholder={emptyPlaceHolder}
        >
          <Window>
            <ChannelHeader currentUser={userData.username} />
            <MessageList
              closeReactionSelectorOnClick={true}
              messageActions={["delete", "quote", "react"]}
              hideDeletedMessages
            />
            <MessageInput noFiles Input={CustomMessageInput} />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatView;
