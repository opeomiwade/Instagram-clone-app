import { Key, useEffect } from "react";
import {
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import CircleIcon from "@mui/icons-material/Circle";
import { useSelector } from "react-redux";

const CustomChannelPreview: React.FC<ChannelPreviewUIComponentProps> = ({
  latestMessage,
  active,
  channel,
  unread,
}) => {
  const currentUser = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData.username
  );
  const { setActiveChannel } = useChatContext();

  const [partner] = Object.values(channel.state.members).filter(
    (member) => member.user_id != currentUser
  );

  return (
    <button
      key={channel.data!.cid as Key}
      disabled={active}
      onClick={() => {
        channel.state.unreadCount = 0;
        setActiveChannel(channel);
      }}
      className={`flex flex-start items-center justify-between gap-4 p-2 h-[80px] text-black hover:bg-gray-200 w-full ${
        active ? "bg-gray-200" : ""
      }`}
    >
      <div className="flex flex-row gap-2 items-center">
        <img
          src={partner.user?.image}
          className="rounded-full w-[50px] h-[50px]"
        />
        <div className="flex flex-col items-start">
          <h4 className="font-bold text-md">{partner.user_id}</h4>
          {unread && unread > 1 ? (
            <p className="font-semibold text-sm">{`${unread}+ messages`}</p>
          ) : (
            <p className="text-gray-500 text-sm truncate">{latestMessage}</p>
          )}
        </div>
      </div>
      {channel.state.unreadCount > 0 && (
        <CircleIcon
          style={{
            fontSize: "10px",
            color: "#3797f0",
          }}
        />
      )}
    </button>
  );
};

export default CustomChannelPreview;
