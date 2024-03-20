import { useEffect, useState } from "react";
import { ChannelMemberResponse } from "stream-chat";
import { useChannelStateContext } from "stream-chat-react";

const ChannelHeader: React.FC<{ currentUser: string }> = ({ currentUser }) => {
  const { channel } = useChannelStateContext();
  const [chatPartner, setPartner] = useState<ChannelMemberResponse>();
  const [image, setChannelImage] = useState<string>();
  useEffect(() => {
    const [chatPartner] = Object.values(channel.state.members).filter(
      (member) => member.user_id != currentUser
    );
    setChannelImage(chatPartner.user?.image)
    setPartner(chatPartner);
  }, []);
  return (
    <>
      <div className="flex gap-2 p-2 m-2 text-lg items-center bg-white">
        <img src={image} className="rounded-full w-[40px] h-[40px]" />
        <h2 className="font-bold">{chatPartner?.user_id}</h2>
      </div>
      <hr />
    </>
  );
};

export default ChannelHeader;
