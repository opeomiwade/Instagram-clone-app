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
  comments: { [key: string]: any }[];
  likes: number;
  caption: string;
  profilePic: string;
};

export type PostState = {
  id: number;
  username: string;
  likes: number;
  comments: { [key: string]: any }[];
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
  dialog?: boolean;
  post: postDetails;
  addCommentClickHandler: () => void;
  emojiButtonHandler: () => void;
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEmojiClick: (emojiObj: { [key: string]: any }) => void;
  comment: string;
  showEmojiPicker: boolean;
};

export type userDetails = {
  email: string,
  followers: string[],
  following: string[],
  likedPosts: [],
  savedPosts: [],
  profilePic: string,
  username: string,
  posts: [],
  name: string
  // messages:[]
}
