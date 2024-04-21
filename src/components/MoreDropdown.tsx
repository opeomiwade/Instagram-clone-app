import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router";
import { postDetails } from "../types/types";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { useContext } from "react";
import PostContext from "../context/PostContext";
import ArchiveIcon from "@mui/icons-material/Archive";
import Cancel from "@mui/icons-material/Cancel";

const DropdownMenu: React.FC<{
  post: postDetails;
  isCurrentUser?: boolean;
  close: () => void;
}> = ({ post, isCurrentUser, close }) => {
  const navigate = useNavigate();
  const sidebarSelection = useSelector(
    (state: { sidebar: { sidebarSelection: string } }) =>
      state.sidebar.sidebarSelection
  );
  const userData = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );

  const ctx = useContext(PostContext);
  
  return (
    <div className="absolute top-[100%] bg-white rounded-md z-50 border-2 w-[150px]">
      <button
        className="flex w-full justify-center p-2"
        onClick={() => navigate(post.username)}
      >
        <PersonIcon /> View Profile
      </button>
      <hr />
      {sidebarSelection === "profile" && isCurrentUser && (
        <button
          className="flex justify-center w-full text-center text-red-500 p-2"
          onClick={() => {
            ctx.deletePostHandler(post.id);
            close();
          }}
        >
          <DeleteIcon />
          Delete
        </button>
      )}
      <hr />
      <button
        className="flex w-full justify-center p-2"
        onClick={() => {
          if (
            userData.archivedPosts.some(
              (archivedPost: postDetails) => archivedPost.id === post.id
            )
          ) {
            ctx.unArchivePostHandler(post)
          } else {
            ctx.archivePostHandler(post)
          }
          close();
        }}
      >
        <ArchiveIcon />
        {userData.archivedPosts.some(
          (archivedPost: postDetails) => archivedPost.id === post.id
        )
          ? "Unarchive"
          : "Archive"}
      </button>
      <hr />
      <button className="flex justify-center p-2 text-center w-full">
        <Cancel /> Cancel
      </button>
    </div>
  );
};

export default DropdownMenu;
