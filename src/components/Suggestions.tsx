import { userDetails } from "../types/types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateDoc } from "../util/http";
import { useDispatch, useSelector } from "react-redux";
import { currentUserActions } from "../store/redux-store";

const Suggestions: React.FC<{
  suggestions: userDetails[];
}> = ({ suggestions }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );

  useEffect(() => {
    if (currentUser.following !== undefined) {
      updateDoc(localStorage.getItem("accessToken") as string, currentUser);
    }
  }, [currentUser.following]);

  function followButtonHandler(userData: userDetails) {
    let isCurrentUser = currentUser.username === userData.username;
    if (!isCurrentUser) {
      //Update following of account
      dispatch(
        currentUserActions.updateUserData({
          userData: {
            following: [...currentUser.following, userData.username],
          },
        })
      );
      userData = {
        ...userData,
        followers: [...userData.followers, currentUser.username],
      };
      updateDoc(localStorage.getItem("accessToken") as string, userData);
    }
  }

  return (
    <div className="flex flex-col gap-5 my-[60px] absolute right-10 w-[20%] max-h-[365px]">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <img
            src={currentUser.profilePic}
            className="rounded-full w-[2rem] h-[2rem]"
          />
          <p className="text-sm font-bold">{currentUser.username}</p>
        </div>
        <button
          className="text-xs font-bold text-blue-500 hover:text-blue-600 cursor-pointer"
          onClick={() => navigate(`${currentUser.username}`)}
        >
          Go to Profile
        </button>
      </div>
      <div className="flex flex-col truncate gap-2">
        <h4 className="text-sm text-gray-500 font-semibold mb-4">
          Suggested For You
        </h4>
        {suggestions.map((suggestion, index) => {
          return (
            <div
              key={index}
              className="flex gap-4 items-center justify-between"
            >
              <div className="flex gap-2">
                <img
                  src={suggestion.profilePic}
                  className="rounded-full w-[40px] h-[40px]"
                />
                <div className="flex flex-col items-start">
                  <h3 className="font-bold text-left text-sm">
                    {suggestion.username}
                  </h3>
                  <p className="text-xs text-gray-500">Suggested for you</p>
                </div>
              </div>
              <button
                className="text-xs font-bold text-blue-500 hover:text-blue-600 cursor-pointer"
                onClick={() => followButtonHandler(suggestion)}
              >
                Follow
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Suggestions;
