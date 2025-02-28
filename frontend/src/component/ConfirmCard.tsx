import { LuChevronRight } from "react-icons/lu";

interface ConfirmCardProps {
  userImage : string;
  userName : string;
}

const ConfirmCard: React.FC<ConfirmCardProps> = ({ userImage , userName}) => {
  return (
    <div className="flex width90 m-auto pt-2 border-2 bg-gray-50 border-gray-100 overflow-hidden pb-2 rounded-xl mb-2 dark:bg-gray-700 dark:text-white">
        <div className="w-4/5 m-auto flex items-start">
            <div className="rounded-full bg-gray-100 overflow-hidden w-14 h-14">
                <img src={userImage} className='w-full h-full' alt="user" />
            </div>
            <span className="mt-3 ml-3">
                <p className="font-bold	text-sm pl-3">{userName}</p>
                <p className="font-medium text-xs pl-3 text-gray-500">12 mutual friends</p>
            </span>
        </div>
            <div className="w-10 h-10 rounded-full bg-white story-shadow-all flex justify-center items-center mr-4 mt-2 dark:bg-gray-800"><LuChevronRight/></div>
    </div>
  )
}
export default ConfirmCard;

