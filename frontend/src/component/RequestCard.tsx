import { Link } from "react-router-dom";

interface RequestCardProps {
    userImage : string;
    userId : string;
    userName : string;
    fullName : string;
}

const RequestCard: React.FC<RequestCardProps> = ({ userImage, userName, fullName, userId }) => {
    return (
        <Link to={`profile/${userId}`} className="flex-col width90 m-auto pt-2 border-2 border-gray-100 overflow-hidden pb-2 rounded-xl mb-2 dark:bg-gray-700 dark:text-white">
            <div className="width90 m-auto flex items-start">
                <div className="rounded-full bg-gray-100 overflow-hidden w-14 h-14">
                    <img src={userImage} className='w-full h-full' alt="user" />
                </div>
                <span className="mt-3 ml-3">
                    <p className="font-bold	text-sm pl-3 capitalize">{fullName}</p>
                    <p className="font-medium text-xs pl-3 text-gray-500">@{userName}</p>
                </span>
            </div>
            <div className="width90 m-auto mt-3 flex justify-start">
                <button className="w-24 shadow-button mr-6 bg-blue-500 font-bold text-gray-100">Confirm</button>
                <button className="w-24 shadow-button bg-gray-200	font-bold text-gray-700">Delete</button>
            </div>
        </Link>
    )
}
export default RequestCard;
