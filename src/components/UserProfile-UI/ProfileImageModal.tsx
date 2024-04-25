import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import uploadImage from "../../util/uploadImage";
import { useDispatch } from "react-redux";
import { currentUserActions } from "../../store/redux-store";
import { updateDoc, updateStreamChatProfilePic } from "../../util/http";
import { userDetails } from "../../types/types";
import queryClient from "../../util/http";

const ProfileImageModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const dilaogRef = useRef<HTMLDialogElement>();
  const inputRef = useRef<HTMLInputElement>();
  const userData = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      dilaogRef.current?.showModal();
    }
  }, [open]);

  async function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    dilaogRef.current?.close();
    const imageUpload = event.target.files![0];
    const url = await uploadImage(
      imageUpload,
      userData.username,
      "profile-pictures/"
    );
    dispatch(
      currentUserActions.updateUserData({ userData: { profilePic: url } })
    );
    dispatch(
      currentUserActions.updateUserData({
        type: "profilepic-posts",
        profilePic: url,
      })
    );
    updateDoc(localStorage.getItem("accessToken")!, {
      profilePic: url,
      username: userData.username,
    });
    updateStreamChatProfilePic(userData as userDetails);
    inputRef.current!.value = "";
    // refetch posts as profilePic of user has been updated, therefore profilePic in post object is updated as well
    queryClient.invalidateQueries({ queryKey: ["all-posts"] });
  }

  async function removeCurrentPhoto() {
    dilaogRef.current?.close();
    const defaultImage =
      "https://firebasestorage.googleapis.com/v0/b/instagram-clone-5b47d.appspot.com/o/account%20circle.jpeg?alt=media&token=ec3c29d8-5b89-447b-ac2e-651af9e4e394";
    dispatch(
      currentUserActions.updateUserData({
        userData: { profilePic: defaultImage },
      })
    );
    dispatch(
      currentUserActions.updateUserData({
        type: "profilepic-posts",
        profilePic: "",
      })
    );
    updateDoc(localStorage.getItem("accessToken")!, {
      profilePic: defaultImage,
      username: userData.username,
    });
    // refetch posts as profilePic of user has been updated, therefore profilePic in post object is updated as well
    queryClient.invalidateQueries({ queryKey: ["all-posts"] });
  }

  return createPortal(
    <dialog
      onClose={async () => {
        onClose();
      }}
      ref={dilaogRef as React.Ref<HTMLDialogElement>}
      className={`hover:cursor-pointer z-50 fixed w-full h-full backdrop-brightness-50 backdrop: bg-gray-600/50 ${
        open && "flex items-center justify-center"
      }`}
    >
      <div className=" bg-white rounded-lg text-center hover:cursor-pointer">
        <h1 className="text-[20px] p-4 w-[400px]">Change Profile Photo</h1>
        <hr />
        <input
          name="profilepic"
          type="file"
          accept="/imageFile/png imageFile/jpeg imageFile/jpg "
          hidden
          ref={inputRef as React.Ref<HTMLInputElement>}
          onChange={changeHandler}
        />
        <button
          className="text-blue-500 p-2 font-semibold w-full"
          onClick={() => inputRef.current?.click()}
        >
          Upload Photo
        </button>
        <hr />
        <button
          className="text-red-500 p-2 font-semibold w-full"
          onClick={removeCurrentPhoto}
        >
          Remove Current Photo
        </button>
        <hr />
        <button
          className="p-2 w-full"
          onClick={() => dilaogRef.current?.close()}
        >
          Cancel
        </button>
      </div>
    </dialog>,
    document.getElementById("modal")!
  );
};

export default ProfileImageModal;
