import { userDetails } from "../types/types";
import { StreamChat } from "stream-chat";
import CustomMessageInput from "./MessageInput";
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
import ChannelHeader from "./ChannelHeader";
import "stream-chat-react/dist/css/index.css";
import "../CSS/stream-chat-message.css";
import CustomChannelList from "./CustomChannelList";
import emptyPlaceHolder from "./EmptyPlaceHolder";
import CustomDateSeparator from "./CustomDateSeparator";

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
          sendChannelsToList
          filters={filters}
          options={options}
          sort={{ last_message_at: -1 }}
          setActiveChannelOnMount={false}
        />
        <Channel
          Avatar={() => <></>}
          DateSeparator={CustomDateSeparator}
          Input={CustomMessageInput}
          EmptyPlaceholder={emptyPlaceHolder}
        >
          <Window>
            <ChannelHeader currentUser={userData.username} />
            <MessageList
              messageActions={["edit", "delete", "react", "reply"]}
              hideDeletedMessages
            />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatView;
