import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getColor } from '@/lib/utils';
import { useAppStore } from "@/store"
import { HOST, LOGOUT_ROUTE } from "@/Utils/constants";
import {  IoPowerSharp } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";


const ProfileInfo = () => {
  const {userInfo, setUserInfo} = useAppStore();
  const navigate = useNavigate();
  
  const logOut= async() =>{
    try {
      const response = await apiClient.post(LOGOUT_ROUTE, {}, {withCredentials:true}        
      );
      if (response.status === 200) {
        navigate('/auth');
        console.log("logout successful")
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 bg-[#2a2b33] w-full ">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className=' h-12 w-12 rounded-full overflow-hidden'>
            {
              userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt='profile'
                className='object-cover bg-black w-full h-full'/>
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:h-48 md:w-48 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                    {userInfo.firstName?
                    userInfo.firstName.split("").shift() : userInfo.email.split("").shift() }
                </div>
              )
            }
          </Avatar>
        </div>
        <div>
          {
            userInfo.firstName && userInfo.lastName ? 
            `${userInfo.firstName} ${userInfo.lastName}` : ""
          }
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2  className="text-purple-500 text-xl font-medium"
              onClick={()=> navigate('/profile')}/>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp  className="text-red-400 text-xl font-medium"
              onClick={logOut}/>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Log Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      </div>
    </div>
  )
}

export default ProfileInfo