export type InputProps = {
  name: string;
  id: string;
  placeholder: string;
  type?: string;
  className: string;
  value?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export type postDetails = {
  id: string;
  username: string;
  imageUrl: string;
  comments: { [key: string]: any }[];
  likes: number;
  caption: string;
  profilePic: string;
};

export type PostState = {
  id: string;
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
  email: string;
  followers: string[];
  following: string[];
  likedPosts: [];
  savedPosts: [];
  profilePic: string;
  username: string;
  posts: [];
  name: string;
  password: string;
  archivedPosts: postDetails[];
  // messages:[]
};

export type HeaderProps = {
  userData: { [key: string]: any };
  isCurrentUser: boolean;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  currentUser: { [key: string]: any };
  openArchiveModal: () => void
  openProfileImageModal: () => void
};
