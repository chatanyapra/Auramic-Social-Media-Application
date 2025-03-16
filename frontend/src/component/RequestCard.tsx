import { Link } from "react-router-dom";
import { useFollowAcceptUser, useFollowRejectUser } from "../hooks/useSearchHook";
import { RequestCardProps } from "../types/types";

const RequestCard: React.FC<RequestCardProps> = ({ userImage, userName, fullName, userId, onConfirm }) => {
    const { followAcceptUser } = useFollowAcceptUser();
    const { followDeleteUser } = useFollowRejectUser();

    const handleConfirm = async () => {
        const success = await followAcceptUser(userId);
        if (success) {

            // console.log(`Follow request accepted for user with ID: ${userId}`);
            onConfirm(userId);
        }
    };
    const handleDelete = async () => {
        const success = await followDeleteUser(userId);
        if (success) {
            // console.log(`Follow request deleted for user with ID: ${userId}`);
            onConfirm(userId);
        }
    };
    return (
        <div className="flex-col width90 m-auto pt-2 border-2 border-gray-100 overflow-hidden pb-2 rounded-xl mb-2 dark:bg-gray-700 dark:text-white">
            <Link to={`profile/${userId}`} className="width90 m-auto flex items-start">
                <div className="rounded-full bg-gray-100 overflow-hidden w-14 h-14">
                    <img src={userImage} className='w-full h-full' alt="user" />
                </div>
                <span className="mt-3 ml-3">
                    <p className="font-bold	text-sm pl-3 capitalize">{fullName}</p>
                    <p className="font-medium text-xs pl-3 text-gray-500">@{userName}</p>
                </span>
            </Link>
            <div className="width90 m-auto mt-3 flex justify-start">
                <button className="w-24 shadow-button mr-6 bg-blue-500 font-bold text-gray-100" onClick={handleConfirm}>Confirm</button>
                <button className="w-24 shadow-button bg-gray-200	font-bold text-gray-700" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}
export default RequestCard;
