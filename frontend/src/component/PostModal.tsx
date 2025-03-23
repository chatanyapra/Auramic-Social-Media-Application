const PostModal = ({ post, onClose }: { post: any; onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-dark2 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Post</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-center">
                        <img
                            src={post.file[0].url}
                            alt="Post"
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Comments</h3>
                        {/* {post.comments.length > 100 ? (
                            <div className="space-y-2">
                                {post.comments.map((comment: any) => (
                                    <div key={comment._id} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                                        <p className="text-sm">{comment.text}</p>
                                        <p className="text-xs text-gray-500">By: {comment.user?.username}</p>
                                    </div>
                                ))}
                            </div>
                        ) : ( */}
                            <p className="text-gray-500">No comments yet.</p>
                        {/* )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostModal
