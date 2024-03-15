import classes from "../CSS/Modal.module.css";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { postDetails } from "../types/types";
import CloseIcon from "@mui/icons-material/Close";
import { currentPostActions } from "../store/redux-store";

const ArchivePostsModal: React.FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const userData = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );
  const dispatch = useDispatch();

  return createPortal(
    <dialog className={`${classes.modal}`} open>
      <button
        onClick={() => {
          closeModal();
        }}
        className="z-30"
      >
        <CloseIcon
          style={{
            fill: "white",
            fontSize: "30px",
            position: "absolute",
            right: 0,
            margin: "10px",
          }}
          className="hover:cursor-pointer"
        />
      </button>
      <div className="bg-white rounded-lg overflow-y-auto h-[90%] w-[70%] mx-auto mt-10 ">
        <h1 className="font-bold text-center p-2 text-xl">Archived Posts</h1>
        <hr />
        <div className="grid grid-cols-3 gap-4 p-2">
          {userData.archivedPosts.map((post: postDetails) => {
            return (
              <img
                key={post.id}
                src={post.imageUrl}
                className="h-[300px] w-full hover:cursor-pointer"
                onClick={() => {
                  closeModal();
                  dispatch(currentPostActions.setCurrentPost(post));
                }}
              />
            );
          })}
        </div>
      </div>
    </dialog>,
    document.getElementById("modal")!
  );
};

export default ArchivePostsModal;
