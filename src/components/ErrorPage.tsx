import { useRouteError } from "react-router";
import background from "../assets/404 background.jpeg";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const ErrorPage = () => {
  const error = useRouteError() as { [key: string]: any };
  const navigate = useNavigate();
  const username = useSelector(
    (state: { currentUser: { userData: { [key: string]: any } } }) =>
      state.currentUser.userData.username
  );


  return (
    <div className="h-full mb-[20px] p-4">
      <img src={background} />
      <div className="flex flex-col items-center">
        <button
          className="rounded-md bg-blue-500 p-2 text-lg w-[7rem] font-bold hover:cursor-pointer"
          onClick={() => navigate(username || "/home")}
        >
          {Object.keys(error.data).length < 1 ? "Go to Profile" : "Go to Feed"}
        </button>
        <h1 className="font-bold text-[6rem] text-center text-blue-500">
          {error.data.message || "Page Not Found"}
        </h1>
      </div>
    </div>
  );
};

export default ErrorPage;
