interface AddStoryCardProps {
    width ?: string;
    backVideo : string;
    userImage : string;
}
  const AddStoryCard: React.FC<AddStoryCardProps> = ({ width, backVideo, userImage }) => {
    return (
        <div className="relative overflow-hidden flex dark:text-white items-end px-0 justify-center mx-2 rounded-lg" style={{ width, height: "100%" }}>
            <img className="h-auto max-w-full rounded-lg" src={backVideo} alt="" />
            <div className="text-center mb-4 flex-col justify-center absolute">
                <div className="story-shadow-all mb-1 mx-auto w-14 bg-white h-14 rounded-full flex justify-center items-center text-center overflow-hidden shadow-md border-2 border-white">
                    <img className="h-full w-full rounded-lg" src={userImage} alt="" />
                </div>
                <b style={{ fontSize: '12px' }} className="text-gray-50">Add Story</b>
            </div>
        </div>
    )
}
export default AddStoryCard;
