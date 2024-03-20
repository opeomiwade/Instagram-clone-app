import React, { useState, useEffect } from "react";
import ProfileTabs from "./ProfileTabs";
import { useSelector } from "react-redux";
import ProfileImageModal from "./ProfileImageModal";
import NoPosts from "./NoPosts";
import PostModal from "./PostModal";
import TabContent from "./ProfileTabContent";
import { postDetails, userDetails } from "../types/types";
import { updateDoc } from "../util/http";
import ListModal from "../components/FollowingFollowerModal";
import ProfileHeader from "./ProfileHeader";
import ArchivePostsModal from "./ArchivePostsModal";

const Profile: React.FC<{ userData: { [key: string]: any } }> = ({
  userData,
}) => {
  const [selectedType, setType] = useState<string>("posts");
  const [hideFooter, setHidden] = useState<boolean>(false);
  const [imageModal, setModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [viewArchive, setView] = useState<boolean>();

  const allPosts = useSelector(
    (state: { allPosts: { posts: postDetails[] } }) => state.allPosts.posts
  );

  const currentUser = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );
  let isCurrentUser = currentUser.username === userData.username;
  isCurrentUser ? (userData = currentUser) : userData;

  function closeListModal() {
    setTitle("");
  }

  function closeArchiveModal() {
    setView(false);
  }

  function openArchiveModal() {
    setView(true);
  }

  function openImageModal(){
    setModal(true)
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 920) {
          setHidden(false);
        } else {
          setHidden(true);
        }
      }
    });
    resizeObserver.observe(document.documentElement);
    if (Object.keys(currentUser).length > 0) {
      updateDoc(localStorage.getItem("accessToken") as string, currentUser);
    }
    if (!isCurrentUser) {
      updateDoc(localStorage.getItem("accessToken") as string, userData);
    }
  }, [
    currentUser.following,
    userData.followers,
    currentUser.posts,
    currentUser.archivedPosts,
  ]);

  function selectedTypeHandler(tabName: string) {
    setType(tabName);
  }

  return (
    <>
      <ProfileImageModal
        onClose={() => setModal(!imageModal)}
        open={imageModal}
      />
      {viewArchive && <ArchivePostsModal closeModal={closeArchiveModal} />}
      <PostModal isCurrentUser={isCurrentUser} />
      <ListModal
        title={title}
        closeModal={closeListModal}
        userInfo={userData as userDetails}
        isCurrentUser={isCurrentUser}
      />
      <div className={`container w-[85%] ${hideFooter && "absolute right-0"}`}>
        <ProfileHeader
          currentUser={currentUser}
          isCurrentUser={isCurrentUser}
          setTitle={setTitle}
          userData={userData}
          openProfileImageModal={openImageModal}
          openArchiveModal={openArchiveModal}
        />
        <section
          className={`h-[60%] max-w-[80%] mx-auto ${
            userData.posts.length < 1 ? "flex flex-col" : ""
          }`}
        >
          <ProfileTabs
            selectedType={selectedType}
            onSelectType={selectedTypeHandler}
            currentUser={currentUser.username === userData.username}
          />
          {userData.posts.length < 1 && selectedType === "posts" && (
            <NoPosts selectedTab={selectedType} />
          )}
          {userData.savedPosts.length < 1 && selectedType === "saved" && (
            <NoPosts selectedTab={selectedType} />
          )}
          {selectedType === "posts" && userData.posts.length > 0 && (
            <TabContent posts={userData.posts} />
          )}
          {selectedType === "saved" && userData.savedPosts.length > 0 && (
            <TabContent
              posts={allPosts.filter((post) =>
                userData.savedPosts.includes(post.id)
              )}
            />
          )}
        </section>
      </div>
    </>
  );
};

export default Profile;
