import { useAppStore } from '@/store';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { colors, getColor } from '@/lib/utils';
import {FaPlus, FaTrash} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { ADD_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTES, HOST, REMOVE_PROFILE_IMAGE_ROUTE } from '@/Utils/constants';

const Profile = () => {
  const navigate = useNavigate();
  const {userInfo, setUserInfo} = useAppStore();
  const [ firstName, setFirstName ] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColour, setSelectedColour] = useState(0);
  const fileInputRef = useRef(null);
   
  useEffect(() => {
    if(userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColour(userInfo.color);
    }
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`);
     
    }
  }, [ userInfo ])

  const validateProfile = () => {
    if(!firstName){
      toast.error("Fist name is reqiured");
      return false;
    }
    if(!lastName){
      toast.error("Last name is required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if(validateProfile()){
      try {
        const response = await apiClient.post(UPDATE_PROFILE_ROUTES, 
          {firstName, lastName, color: selectedColour},
          {withCredentials:true}
        );
        if(response.status === 200 && response.data) {
          setUserInfo({...response.data});
          toast.success("Profile data updated succesfully.");
          navigate("/chat");
        }
      } catch (error) {
        
      }
    }

  };

  const handleNavigate = async () => {
    if(userInfo.profileSetup){
      navigate("/chat");
    }else{
      toast.error("Plaese setup profile")
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async(event) => {
    const file = event.target.files[0];
    
    if(file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      console.log("this is file", file)
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData, {withCredentials:true})
      if(response.status === 200 && response.data.image){
        setUserInfo({...userInfo, image: response.data.image});
        toast.success("Image uploaded successfully")
        console.log(response.data.image)
      }
      
    };
  }

//   const handleImageChange = async (event) => {
//     const files = event.target.files;
    
//     if (files && files.length > 0) {
//         const file = files[0];
//         const formData = new FormData();
//         formData.append("profile-image", file);
        
//         try {
//             const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true });
//             console.log(response.data.image)
//             if (response.status === 200 && response.data.image) {
//                 setUserInfo({ ...userInfo, image: response.data.image });
//                 toast.success("Image uploaded successfully");
//                 setImage(response.data.image);
//                 console.log({image})
//             }
//         } catch (error) {
//             console.error('Error uploading image:', error);
//             toast.error("Failed to upload image");
//         }
//     } else {
//         console.error('No file selected');
//         toast.error("No file selected");
//     }
// };


  const handleDeleteImage = async() => {
      try {
        const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,{withCredentials:true})
        if(response.status === 200){
           setUserInfo({...userInfo, image:null});
           toast.success("Image removed successfully.")
           setImage(null); 
        }
      } catch (error) {
        if (error.response) {
          // Server responded with error
          const errorMessage = error.response.data?.message || 'Failed to remove image';
          toast.error(errorMessage);
      } else if (error.request) {
          // Request made but no response received
          toast.error('No response from server. Please check your connection.');
      } else {
          // Error in request setup
          toast.error('An error occurred while removing the image');
      }

      console.error('Error removing profile image:', error);
        
      }
  };

  return (
    <div className='bg-[#1b1c24] h-[100vh] flex items-center justify-center gap-10 flex-col'>
      <div className="flex flex-col gap-16 w-[80vw] md:w-max">
        <div onClick={() => {handleNavigate()}}>
          <IoArrowBack className='text-4xl text-white/90 lg:text-6xl cursor-pointer'/>
        </div>
        <div className='grid grid-cols-2'>
          <div 
            className='h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center'
            onMouseEnter={() => {setHovered(true)}}
            onMouseLeave={()=> {setHovered(false)}}
          >
            <Avatar className=' h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden'>
              {
                image ? (
                <AvatarImage 
                  src={image} 
                  alt='profile' 
                  className='object-cover bg-black w-full h-full'/>) : 
                (<div 
                  className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColour)}`}>
                    {firstName? 
                    firstName.split("").shift() : userInfo.email.split("").shift() }
                </div>)
              }
            </Avatar>
            {
              hovered && (
                <div className='flex items-center justify-center absolute inset-0 bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer'
                onClick={image? handleDeleteImage: handleFileInputClick}>
                  {
                    image ? <FaTrash className='text-white text-3xl cursor-pointer'
                    /> : 
                    <FaPlus className='text-white text-3xl cursor-pointer'
                    onClick={handleImageChange}/>
                  }
                </div>    
              )
            }
            <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleImageChange} 
            name="profile-image" 
            accept='.png,.jpg,.jpeg,.svg,.webp'/>
          </div>
          

          <div className='flex flex-col items-center justify-center gap-5 min-w-32 md:min-w-64 text-white'>
            <div className='w-full'>
              <input 
                    placeholder='Email' 
                    type="email" 
                    disabled value={userInfo.email} 
                    className='rounded-lg p-6 bg-[#2c2e3b] border-none' />
            </div>
            <div className='w-full'>
              <input 
                    placeholder='First Name' 
                    type="text"  
                    value={firstName} 
                    onChange={(e) => {setFirstName(e.target.value)} } className='rounded-lg p-6 bg-[#2c2e3b] border-none' />
            </div>
            <div className='w-full'>
              <input 
                    placeholder='Last Name' 
                    type="text"  
                    value={lastName} 
                    onChange={(e) => {setLastName(e.target.value)} } className='rounded-lg p-6 bg-[#2c2e3b] border-none' />
            </div>
            <div className='w-full flex gap-5'>
              {
                colors.map((color, index) => (
                <div 
                  className={`${color} h-8 w-8 rounded-full cursor-pointer duration-300 transition-all ${selectedColour===index? "outline outline-white/50 outline-1": ""  }`} 
                  key={index}
                  onClick={() => {setSelectedColour(index)}}
                > 
                </div>
                ))
              }
            </div>
          </div>
        </div>
        <div 
          className='w-full'>
            <Button 
              className="h-16 w-full bg-purple-700 hover:bg-purple-900 translate-all duration-300"
              onClick={() => {saveChanges()}}
            >
              Save Changes
            </Button>
        </div>
      </div>
    </div>

  );
};
export default Profile