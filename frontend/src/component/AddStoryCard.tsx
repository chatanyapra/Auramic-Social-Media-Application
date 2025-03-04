interface AddStoryCardProps {
    width ?: string;
    backVideo : string;
    userImage : string;
    username : string;
}
  const AddStoryCard: React.FC<AddStoryCardProps> = ({ width, backVideo, userImage, username }) => {
    return (
        <div className="relative overflow-hidden flex dark:text-white items-end px-0 justify-center mx-2 rounded-lg" style={{ width, height: "100%" }}>
            <img className="h-full w-full object-cover" src={backVideo} alt="" />
            <div className="text-center mb-4 flex-col justify-center absolute">
                <div className="story-shadow-all mb-1 mx-auto w-14 bg-white h-14 rounded-full flex justify-center items-center text-center overflow-hidden shadow-md border-2 border-white">
                    <img className="h-full w-full object-cover rounded-full" src={userImage} alt="" />
                </div>
                <b style={{ fontSize: '12px' }} className="text-gray-800 dark:text-gray-50 bg-gray-400 rounded-lg px-1"><span className="text-blue-700 font-extrabold">@</span>{username.substring(0, 13)}</b>
            </div>
        </div>
    )
}
export default AddStoryCard;
