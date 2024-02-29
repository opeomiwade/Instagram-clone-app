const Comment: React.FC<{ comment: { [key: string]: any } }> = ({
  comment,
}) => {
  return (
    <div className="w-full flex items-center gap-[20px] mt-4">
      <div className="rounded-full border-2 border-amber-200 p-[2px]">
        <img
          src={comment.profilePic}
          className="rounded-full w-[30px] h-[30px]"
        />
      </div>
      <h3 className="font-bold">
        {`${comment.username} `}
        <span className="font-normal">{comment.comment}</span>
      </h3>
    </div>
  );
};

export default Comment;
