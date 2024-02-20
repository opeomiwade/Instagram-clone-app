import React, { useState, useEffect } from "react";
import image from "../assets/account circle.jpeg";
import Footer from "./Footer";
import ProfileTabs from "./ProfileTabs";
import { useSelector } from "react-redux";
import ProfileImageModal from "./ProfileImageModal";
import NoPosts from "./NoPosts";
import PostModal from "./PostModal";
import TabContent from "./ProfileTabContent";
import { postDetails } from "../types/types";

const Profile: React.FC = () => {
  const [selectedType, setType] = useState<string>("posts");
  const [hideFooter, setHidden] = useState<boolean>(false);
  const [imageModal, setModal] = useState<boolean>(false);

  const userData = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );
  const allPosts = useSelector(
    (state: { allPosts: { posts: postDetails[] } }) => state.allPosts.posts
  );

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
  }, []);

  function selectedTypeHandler(tabName: string) {
    setType(tabName);
  }

  return (
    <>
      {
        <ProfileImageModal
          onClose={() => setModal(!imageModal)}
          open={imageModal}
        />
      }
      <PostModal />
      <div className={`container w-[85%] ${hideFooter && "absolute right-0"}`}>
        <section className="h-screen">
          <div className="h-[100vh] mx-auto">
            <header className="flex  justify-center p-6 gap-[100px]">
              <img
                onClick={() => setModal(!imageModal)}
                src={userData.profilePic || image}
                className="rounded-full flex shrink max-w-[150px] max-h-[150px] hover:cursor-pointer"
              />
              <div className="flex flex-col justify-center gap-[25px]">
                <div className="flex gap-[15px] items-center">
                  <h2 className="font-bold text-xl">{userData.username}</h2>
                  <button className="bg-gray-200 text-black text-sm font-semibold rounded-md w-[7rem] p-2">
                    Edit Profile
                  </button>
                  <button className="bg-gray-200 text-red-500 text-sm font-semibold rounded-md p-2 w-[7rem]">
                    Log Out
                  </button>
                </div>

                <div className="flex justify-between ">
                  <h3 className="font-bold">{`${userData.posts.length} posts`}</h3>
                  <h3 className="font-bold">{`${userData.followers.length} followers`}</h3>
                  <h3 className="font-bold">{`${userData.following.length} following`}</h3>
                </div>
                <h4 className="font-semibold text-sm">
                  Followed by kingjames, espn, kai_cenat
                </h4>
              </div>
            </header>
            <section
              className={`h-[60%] max-w-[80%] mx-auto ${
                userData.posts.length < 1 ? "flex flex-col" : ""
              }`}
            >
              <ProfileTabs
                selectedType={selectedType}
                onSelectType={selectedTypeHandler}
              />
              {userData.posts.length < 1 && (
                <NoPosts selectedTab={selectedType} />
              )}
              {selectedType === "posts" && userData.posts.length > 0 ? (
                <TabContent posts={userData.posts} />
              ) : (
                <TabContent
                  posts={allPosts.filter((post: postDetails) =>  userData.savedPosts.includes(post.id))}
                />
              )}
            </section>
            {hideFooter && <Footer />}
          </div>
        </section>
      </div>
    </>
  );
};

export default Profile;
