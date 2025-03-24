import { LuBookmark } from 'react-icons/lu'

const EmptySaved = () => {
    return (
        <div className="flex justify-center items-center min-h-96">
            <div className="flex-col text-center">
                <div className="border-4 border-gray-500 rounded-full h-20 w-20 m-auto">
                    <LuBookmark className="text-5xl text-gray-500 mt-3 m-auto" />
                </div>
                <h1 className="font-extrabold font-sans mt-2 text-2xl text-gray-500">Empty Saved!</h1>
                <h1 className="font-sans mt-2 text-sm text-gray-500">When you save photos, they will appear here.</h1>
            </div>
        </div>
    )
}

export default EmptySaved
