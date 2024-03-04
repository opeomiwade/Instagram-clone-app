import { useDispatch } from "react-redux";
import { postDetails } from "../types/types";
import { currentPostActions } from "../store/redux-store";

const Content:React.FC<{posts: postDetails[]}> = ({posts}) => {
    const dispatch = useDispatch()
  return (
    <div className="h-full mx-auto grid grid-cols-3 gap-4 p-2">
      {posts.map((post: postDetails) => {
        return (
          <div
            key={post.id}
            onClick={() => {
              dispatch(currentPostActions.setCurrentPost(post));
            }}
          >
            <img
              src={post.imageUrl}
              className="h-[300px] w-full hover:cursor-pointer"
            />
          </div>
        );
      })}
    </div>
  );
};

export default Content