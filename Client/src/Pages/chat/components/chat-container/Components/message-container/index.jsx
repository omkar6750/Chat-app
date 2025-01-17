import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES, HOST } from '@/Utils/constants';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import {MdFolderZip} from 'react-icons/md'
import {IoMdArrowRoundDown } from 'react-icons/io'
import {IoCloseSharp } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';

const MessageContainer = () => {
  const { selectedChatType, selectedChatData, userInfo, selectedChatMessages, setSelectedChatMessages, setIsDownloading, setFileDownloadProgress } = useAppStore();
  const scrollRef = useRef();
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setimageUrl] = useState(null);

  useEffect(() => {
    const getMessages = async() => {
      try {
        const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE, 
          {id: selectedChatData._id},
          {withCredentials:true})


        if(response.data.messages){
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log("Error getting messages:", error);
      }
    }
    
    const getChannelMessages = async() => {
      try {
        const response = await apiClient.get(`${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`, 
          {withCredentials:true})
        if(response.data.messages){
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log("Error getting messages:", error);
      }
    };

    if(selectedChatData._id){
      if(selectedChatType === "dm") {
        getMessages()
      }else if(selectedChatType === "channel") {
        getChannelMessages();
      };
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages])
  
  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({behavior:"auto"});
    }
  }, [selectedChatMessages])

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpeg|jpg|gif|png|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  }

  const downloadFile = async(filePath) => {
    setIsDownloading(true)
    setFileDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${filePath}`,{responseType: "blob", 
      onDownloadProgress: (progressEvent) => {
        const {loaded, total} = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setFileDownloadProgress(percentCompleted);
      }
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', filePath.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    if(response.status === 200){
      setIsDownloading(false);
      setFileDownloadProgress(0);
    }
  }
  

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {
            showDate && 
            <div className='text-center text-gray-200 my-2'>
              {moment(message.timeStamp).format("LL")}
            </div>
          }
          {
            selectedChatType === "dm" && renderDMMessages(message)
          }
          {
            selectedChatType === "channel" && renderChannelMessages(message)
          }
        </div>
      )
    });
  }
  const renderDMMessages = (message) => {
    return(
      <div className={`${message.sender !== selectedChatData._id? "text-right":"text-left"}`}>
        
        {message.messageType === "text" && (
          <div className={`${message.sender !== selectedChatData._id? "bg-[#8417ff]/5 text-white/80 border-[#8417ff]/90":"bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20" } border inline-block p-4 rounded my-1 max-w-[50%] break-words `}>
          {message.content}
          </div>
        )
        }
        {
          message.messageType === "file" && (
            <div className={`${message.sender !== selectedChatData._id? "bg-[#8417ff]/5 text-white/80 border-[#8417ff]/90":"bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20" } border inline-block p-4 rounded my-1 max-w-[50%] break-words `}>
              {
                checkIfImage(message.fileUrl)
                ? <div className='cursor-pointer'
                  onClick={() => {setShowImage(true);
                    setimageUrl(message.fileUrl);
                  }}
                  >
                    <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} />
                </div>
                : <div className='flex items-center justify-center gap-4'>
                  <span className='text-white/8 text-3xl bg-black/20 rounded-full p-3 '>
                    <MdFolderZip />
                  </span>
                  <span>
                    {
                      message.fileUrl.split("/").pop()
                    }
                  </span>
                  <span className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer duration-300 transition-all'
                  onClick={() =>downloadFile(message.fileUrl)}
                  >
                    <IoMdArrowRoundDown />
                  </span>
                </div>
              }
            </div>
          )
        }
        <div className='text-xs text-gray-600'>
          {
            moment(message.timeStamp).format("LT") 
          }
        </div>
      </div>
    )
    
  }

  const renderChannelMessages = (message) => {
    return (
      <div className={`mt-5 ${message.sender._id === userInfo.id ? "text-right" : "text-left" } `}>
        {
          message.messageType === "text" && (
          <div className={`${message.sender._id === userInfo.id? "bg-[#8417ff]/5 text-white/80 border-[#8417ff]/90":"bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20" } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9 `}>
          {message.content}
          </div>
          )
        }
        {
          message.messageType === "file" && (
            <div className={`${message.sender._id === userInfo.id? "bg-[#8417ff]/5 text-white/80 border-[#8417ff]/90":"bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20" } border inline-block p-4 rounded my-1 max-w-[50%] break-words `}>
              {
                checkIfImage(message.fileUrl)
                ? <div className='cursor-pointer'
                  onClick={() => {setShowImage(true);
                    setimageUrl(message.fileUrl);
                  }}
                  >
                    <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} />
                </div>
                : <div className='flex items-center justify-center gap-4'>
                  <span className='text-white/8 text-3xl bg-black/20 rounded-full p-3 '>
                    <MdFolderZip />
                  </span>
                  <span>
                    {
                      message.fileUrl.split("/").pop()
                    }
                  </span>
                  <span className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer duration-300 transition-all'
                  onClick={() =>downloadFile(message.fileUrl)}
                  >
                    <IoMdArrowRoundDown />
                  </span>
                </div>
              }
            </div>
          )
        }
        {
          message.sender._id !== userInfo.id
          ? <div className='flex items-center justify-start gap-1'>
                  <Avatar className='h-8 w-8 rounded-full overflow-hidden'>
                    {
                      message.sender.image
                      ? (
                        <AvatarImage
                          src={`${HOST}/${message.sender.image}`}
                          alt='profile'
                          className='object-cover bg-black w-full h-full'
                        />
                      ) 
                      : (
                        <AvatarFallback
                          className={`uppercase h-8 w-8 text-xl flex items-center justify-center rounded-full ${getColor(message.sender.color)}`}
                        >
                          {message.sender.firstName 
                          ? message.sender.firstName.split('').shift() 
                          : message.sender.email.split('').shift()}
                        </AvatarFallback>
                      )
                    }
                  </Avatar>
                  <span className='text-sm text-white/60'>
                    {
                    message.sender.firstName && message.sender?.lastName
                    ? `${message.sender.firstName} ${message.sender.lastName}`
                    : message.sender?.email
                    }
                  </span>
              <span className='text-xs text-white/60'>
                {
                  moment(message.timeStamp).format("LT")
                }
              </span>
            </div>
          : (
            <div className='text-xs text-white/60'>
              {
                moment(message.timeStamp).format("LT")
              }
            </div>
            )
        }
      </div>
    )
  }
  return (
    <div style={{ background: 'linear-gradient(135deg, #221c3c, #1c1d25)', scrollbarWidth:'none'}} className='flex-1 overflow-y-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full bg-gradient-to-t'>
      {renderMessages()}
      <div ref={scrollRef}></div>
      {
        showImage && (<div className='fixed z-1000 top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center flex-col backdrop-blur-lg '>
          <div>
            <img src={`${HOST}/${imageUrl}`} className='h-[80vh] w-full bg-cover' />
          </div>
          <div className='flex gap-5 fixed top-0 mt-5'>
            <button className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer duration-300 transition-all'
              onClick={() =>downloadFile(imageUrl)}
             >
              <IoMdArrowRoundDown />
            </button>
            <button className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer duration-300 transition-all'
              onClick={() =>{
                setShowImage(false);
                setimageUrl(null);}
              }
             >
              <IoCloseSharp />
            </button>
          </div>
        </div>
        )
      }
    </div>
  )
}

export default MessageContainer;