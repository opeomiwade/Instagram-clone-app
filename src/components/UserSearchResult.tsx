import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { userDetails } from "../types/types";

const UserSearchResult: React.FC<{
  user: userDetails;
  clickHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
}> = ({ user, clickHandler }) => {
  const currentUser = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );
  const [mutualFollowers, setMutuals] = useState<string[]>([]);

  useEffect(() => {
    setMutuals(() => {
      const mutuals = currentUser.following.filter((following: string) =>
        user.followers.includes(following)
      );
      return mutuals;
    });
  }, [currentUser.following, user.followers]);

  return (
    <div
      id={user.username}
      key={user.username}
      className="flex justify-between mt-2 items-center w-full hover:cursor-pointer hover:bg-gray-200 p-2"
      onClick={clickHandler}
    >
      <div className="flex gap-4 items-center">
        <img src={user.profilePic} className="rounded-full w-[40px] h-[40px]" />
        <div className="flex flex-col items-start">
          <h3 className="font-bold text-left text-sm">{user.username}</h3>
          <div className="flex items-center">
            <p className="text-gray-500 text-left">{user.name}</p>
            {mutualFollowers.length > 0 && (
              <>
                <CircleIcon style={{ fontSize: "5px", fill: "gray" }} />
                <p className="text-sm text-gray-500 truncate">
                  Followed by {mutualFollowers}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearchResult;
