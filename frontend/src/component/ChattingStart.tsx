import logoImage from "../assets/auramicimage.png";
import { useAuthContext } from "../context/AuthContext";
import AiLoader from "./AiLoader";
// import {MyComponentProps} from "../types/types"

const ChattingStart = () => {
  const { authUser } = useAuthContext();
  return (
    <div className={`w-full shadow-md bg-white overflow-hidden max-md:mt-20 max-md:hidden`}>
      <div className="w-full flex justify-between align-middle p-2">
        <div className="flex">
          <img src={authUser.profilePic} className="w-14 h-14 rounded-full" alt="" />
          <div className="flex flex-col">
            <h4 className="pt-2 pl-3 font-semibold">{authUser.fullname}</h4>
            <small className="pt-0 pl-3 font-medium">@{authUser.username}</small>
          </div>
        </div>
        <div>
          <AiLoader/>
        </div>
      </div>
      <div>
        <div className="py-5 text-center text-sm lg:pt-8 h-auto overflow-hidden collapsibleDiv collapsedDiv" >
          <img src={authUser.profilePic} className="w-24 h-24 rounded-full mx-auto mb-3" alt="" />
          <div className="mt-8">
            <h2 className="md:text-xl text-base font-medium   text-green-500">Welcome </h2>
            <div className="md:text-xl text-base font-medium text-black ">{authUser.fullname} </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        <div className="flex flex-col m-auto w-40 h-40 text-center">
          <img src={logoImage} alt="" />
          <div className="font-bold font-sans text-gray-400">Auramic Website</div>
          <small className="font-semibold font-sans text-gray-400">Send and receive message from friends.</small>
        </div>
      </div>
    </div>
  )
}

export default ChattingStart
