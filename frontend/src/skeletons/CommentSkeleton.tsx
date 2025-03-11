const CommentSkeleton = () => {
    return (
        <div className="bg-white w-full max-w-2xl mx-auto rounded-lg shadow-lg p-6">
            {/* <!-- Comment Section --> */}
            <div className="space-y-4">
                {/* <!-- Skeleton Comment --> */}
                <div className="flex items-center space-x-3">
                    {/* <!-- Profile Picture Skeleton --> */}
                    <div className="w-8 h-8 rounded-full skeleton"></div>
                    {/* <!-- Username and Date Skeleton --> */}
                    <div className="flex-1">
                        <div className="w-24 h-4 skeleton mb-1"></div>
                        <div className="w-16 h-3 skeleton"></div>
                    </div>
                </div>
                {/* <!-- Comment Text Skeleton --> */}
                <div className="w-full h-4 skeleton mt-2"></div>
                <div className="w-3/4 h-4 skeleton mt-1"></div>
            </div>
        </div>
    )
}

export default CommentSkeleton
