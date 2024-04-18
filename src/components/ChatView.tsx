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
import emptyPlaceHolder from "./CustomStreamComponents/EmptyPlaceHolder";
import CustomDateSeparator from "./CustomStreamComponents/CustomDateSeparator";
import CustomChannelPreview from "./CustomStreamComponents/CustomChannelPreview";

const ChatView: React.FC<{
  chatClient: StreamChat;
  userData: userDetails;
}> = ({ chatClient, userData }) => {
  const { username } = userData;
  const filters = { members: { $in: [username] }, type: "messaging" };
  const options = { presence: true, state: true };

  return (
    <div className="w-full">
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
          // Input={CustomMessageInput}
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
