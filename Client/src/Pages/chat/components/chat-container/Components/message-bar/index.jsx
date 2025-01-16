import { useSocket } from '@/Context/SocketContext';
import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import { UPLOAD_FILE_ROUTE } from '@/Utils/constants';
import EmojiPicker from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react'
import {GrAttachment} from 'react-icons/gr'
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from "react-icons/ri";
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';

const MessageBar = () => {

  const emojiRef = useRef();
  const fileInputRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress } = useAppStore();
  const [message, setMessage] = useState("")
  const [emoiPickerOpen, setEmojiPickerOpen] = useState(false);
  const socket = useSocket();

  const handleSendMessage = async() =>{
    if(selectedChatType === "dm" && message.length > 0){
      await socket.emit("sendMessage", {
        sender: userInfo.id,
        recipient: selectedChatData._id,
        messageType:"text",
        content: message,
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel" && message.length > 0){
      await socket.emit("sendChannelMessage", {
        sender: userInfo.id,
        channelId: selectedChatData._id,
        messageType: "text",
        content: message,
        fileUrl: undefined,
      })
    }
    setMessage("")    
  }

  const handleAttactmentClick = () => {
    if(fileInputRef.current){
      fileInputRef.current.click();
    }
  }

  const handleAttatchmentChange = async(event) => { 
    try {
    const file = event.target.files[0];
    if(file) {
      const formData = new FormData();
      formData.append("file", file);
      setIsUploading(true)
      const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, 
        {withCredentials:true, 
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total))
          }
        }
      );

      if(response.status === 200){
        setIsUploading(false);
        if(selectedChatType === "dm"){
          socket.emit("sendMessage", {
            sender: userInfo.id,
            recipient: selectedChatData._id,
            messageType: "file",
            content: undefined,
            fileUrl: response.data.filePath,
          });
        }
        else if(selectedChatType === "channel" ){
          socket.emit("sendChannelMessage", {
            sender: userInfo.id,
            channelId: selectedChatData._id,
            messageType: "file",
            content: "",
            fileUrl: response.data.filePath ,
          });
        }
      }
    }

      
    } catch (error) {
      if(error.response.data.error){
        toast.error("File size too large")
      }
      setIsUploading(false)
      console.log("Error uploading file:", error);
    }
  }

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  } 

  const handleEnterKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleSendMessage(); 
    }
  };

  useEffect(() => {
    function handleClickOutside (event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)){
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [emojiRef])

  return (
    <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-4 gap-6 border-t-2 border-[#2f303b]'>
      <div className="flex-1 flex bg-[#2a2b33] rounded-lg items-center gap-5 pr-5 mt-4">
        <input type="text" 
        className='flex-1 p-4 bg-transparent rounded-md focus:border-none focus:outline-none'  placeholder='Enter message here'
        value={message}
        onChange={(e)=>setMessage(e.target.value)}
        onKeyDown={handleEnterKeyDown}
        />
        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all '
        onClick={handleAttactmentClick}
        >
          <GrAttachment className='text-2xl'/>
          
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className='hidden' 
          onChange={handleAttatchmentChange}
          onClick={() =>toast("Max file size: 10mb")}
        />
        <div className="relative">
          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all '
          onClick={() => setEmojiPickerOpen(true)}>
            <RiEmojiStickerLine className='text-2xl' />
          </button>
          <div className='absolute bottom-16 right-0' ref={emojiRef}>
            <EmojiPicker 
            open={emoiPickerOpen} 
            theme='dark'
            onEmojiClick={handleAddEmoji}
            autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button className='bg-[#8417ff] rounded-md mt-5 flex items-center justify-center p-4 hover:bg-[#8417ff]/80 focus:border-none focus:bg-[#8417ff]/70 focus:outline-none focus:text-white duration-300 transition-all'
      onClick={handleSendMessage}
      >
          <IoSend className='text-2xl' />
      </button>
    
    </div>
  )
}

export default MessageBar;