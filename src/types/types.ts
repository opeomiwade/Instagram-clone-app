export type InputProps = {
  name: string;
  id: string;
  placeholder: string;
  type?: string;
  className: string;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
};

export type postDetails = {
  id: number;
  username: string;
  imageUrl: string;
  comments: string[];
  likes: number;
  caption: string;
  profilePic: string;
};

export type PostState = {
  id: number;
  username: string;
  likes: number;
  comments: string[];
  imageUrl: string;
  caption: string;
};

export type TabProps = {
  isSelected: boolean;
  onSelect: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
};

export type handleFileChangeParameters = {
  event: React.ChangeEvent<HTMLInputElement>;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
};

export type CommentInputProps = {
  post: postDetails;
  addCommentClickHandler: () => void;
  emojiButtonHandler: () => void;
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEmojiClick: (emojiObj: {[key:string] : any}) => void
  comment:string
  showEmojiPicker:boolean
};
