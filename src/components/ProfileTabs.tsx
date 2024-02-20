import React from "react";
import { motion } from "framer-motion";
import { TabProps } from "../types/types.ts";
import BookmarkOutlined from "@mui/icons-material/BookmarkOutlined";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";

const Tab: React.FC<TabProps> = ({ isSelected, onSelect, children }) => {
  return (
    <li>
      {isSelected && (
        <motion.div
          layoutId="active-tab"
          className="border-t-2 border-black rounded-lg"
        />
      )}
      <button
        className={isSelected ? "text-black" : "text-gray-400"}
        onClick={onSelect}
      >
        {children}
      </button>
    </li>
  );
};

const ProfileTabs: React.FC<{
  selectedType: string;
  onSelectType: (tabName: string) => void;
}> = ({ selectedType, onSelectType }) => {
  return (
    <menu className="flex justify-center gap-[4rem] mt-4 border-t-[1px] border-gray-200 ">
      <Tab
        isSelected={selectedType === "posts"}
        onSelect={() => onSelectType("posts")}
      >
        <ViewCompactIcon />
        Post
      </Tab>
      <Tab
        isSelected={selectedType === "saved"}
        onSelect={() => onSelectType("saved")}
      >
        <BookmarkOutlined />
        Saved
      </Tab>
    </menu>
  );
};

export default ProfileTabs;
