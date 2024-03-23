import { useEffect, useState } from "react";

function CustomTimeStamp() {
  const [date, setDate] = useState<string>();
  useEffect(() => {
    const today = new Date();

    const fullDate = today.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour clock
    });
    setDate(fullDate);
  }, []);

  return (
    <div className="flex text-xs text-gray-400 w-full justify-center items-center">
      {date}
    </div>
  );
}

export default CustomTimeStamp;
