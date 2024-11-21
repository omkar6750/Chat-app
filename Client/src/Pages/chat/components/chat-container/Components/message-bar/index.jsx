import EmojiPicker from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react'
import {GrAttachment} from 'react-icons/gr'
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {

  const emojiRef = useRef();

  const [message, setMessage] = useState("")
  const [emoiPickerOpen, setEmojiPickerOpen] = useState(false)
  const handlSendMessage = async() =>{};
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  } 

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
    <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6'>
      <div className="flex-1 flex bg-[#2a2b33] rounded-lg items-center gap-5 pr-5">
        <input type="text" 
        className='flex-1 p-4 bg-transparent rounded-md focus:border-none focus:outline-none'  placeholder='Enter message here'
        value={message}
        onChange={(e)=>setMessage(e.target.value)} />
        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all '
        // onClick={}
        >
          <GrAttachment className='text-2xl'/>
          
        </button>
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
      <button className='bg-[#8471ff] rounded-md  flex items-center justify-center p-4 hover:bg-[#741bda] focus:border-none focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all'
      onClick={handlSendMessage}
      >
          <IoSend className='text-2xl' />
      </button>
    
    </div>
  )
}

export default MessageBar