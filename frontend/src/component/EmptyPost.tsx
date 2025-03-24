import { LuLayoutGrid } from 'react-icons/lu'

const EmptyPost = () => {
    return (
        <div className="flex justify-center items-center min-h-96">
            <div className="flex-col text-center">
                <div className="border-4 border-gray-500 rounded-full h-20 w-20 m-auto">
                    <LuLayoutGrid className="text-5xl text-gray-500 mt-3 m-auto" />
                </div>
                <h1 className="font-extrabold font-sans mt-2 text-2xl text-gray-500">Empty Posts!</h1>
                <h1 className="font-sans mt-2 text-sm text-gray-500">When you share photos, they will appear on your profile.</h1>
            </div>
        </div>
    )
}

export default EmptyPost
