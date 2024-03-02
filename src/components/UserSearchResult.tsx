import { useSelector } from "react-redux";

const UserSearchResult: React.FC<{
  username: string;
  clickHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
  profilePic: string;
  name: string
}> = ({ username, profilePic, clickHandler, name }) => {
  const userData = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData
  );
  return (
    <div
      id={username}
      key={username}
      className="flex justify-between mt-2 items-center w-full hover:cursor-pointer hover:bg-gray-200 p-2"
      onClick={clickHandler}
    >
      <div className="flex gap-4 items-center">
        <img src={profilePic} className="rounded-full w-[40px] h-[40px]" />
        <div className="flex flex-col items-start">
          <h3 className="font-bold text-left text-sm">{username}</h3>
          <p className="text-gray-500 text-left">{`${name} ${
            userData.following.includes(username) ? ".following" : ""
          }`}</p>
        </div>
      </div>
    </div>
  );
};

export default UserSearchResult;
