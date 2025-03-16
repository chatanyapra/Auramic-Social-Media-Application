import { LuChevronsRight, LuFlipVertical, LuFlipVertical2 } from "react-icons/lu";
import { Link } from "react-router-dom";
import { CollapsibleSectionProps } from "../types/types";

// Reusable CollapsibleSection Component
  
export  const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    isOpen,
    onToggle,
    textColor,
    children,
  }) => {
    return (
      <div
        className="flex-col items-start justify-center bg-white dark:bg-black dark:text-white story-shadow-all overflow-y-auto scroll-none rounded-2xl transition-max-height duration-300 ease-in-out"
        style={{ height: isOpen ? "450px" : "88px" }}
      >
        <div className="text-sm font-bold my-6 mx-5 flex justify-between">
          <span>{title}</span>
          <div className="flex">
            <Link
              to="message"
              className={`button-press-shadow flex leading-5 cursor-pointer w-10 h-10 rounded-full bg-white dark:bg-gray-700 story-shadow-all justify-center items-center ${
                textColor || "text-blue-500"
              }`}
            >
              <LuChevronsRight className="text-2xl" />
            </Link>
            <button
              onClick={onToggle}
              className={`button-press-shadow flex leading-5 cursor-pointer w-10 h-10 rounded-full bg-white dark:bg-gray-700 story-shadow-all justify-center items-center ml-2 ${
                textColor || "text-blue-500"
              }`}
            >
              {isOpen ? (
                <LuFlipVertical2 className="text-2xl" />
              ) : (
                <LuFlipVertical className="text-2xl" />
              )}
            </button>
          </div>
        </div>
        {children}
      </div>
    );
  };