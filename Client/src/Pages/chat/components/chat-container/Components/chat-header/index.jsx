import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getColor } from '@/lib/utils'
import { useAppStore } from '@/store'
import { HOST } from '@/Utils/constants'
import React from 'react'
import { RiCloseFill } from 'react-icons/ri'

const ChatHeader = () => {
  const {closeChat, selectedChatData, selectedChatType} = useAppStore()
  
  return (
    <div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-8 w-full '>
      <div className='flex w-full items-center justify-between'>
          <div className='flex gap-3 items-center justify-start'>
            <div className='w-12 h-12 relative'>

              {
                selectedChatType === 'dm'
                ?<Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                  {
                    selectedChatData.image ? (
                      <AvatarImage
                        src={`${HOST}/${selectedChatData.image}`}
                        alt='profile'
                        className='object-cover bg-black w-full h-full'
                      />
                    ) : (
                      <div
                        className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}
                      >
                        {selectedChatData.firstName ? selectedChatData.firstName.split('').shift() : selectedChatData.email.split('').shift()}
                      </div>
                    )
                  }
                </Avatar>: 
                <div  className="flex gap-5 items-center justify-start text-neutral-300  ">
                  <div
                          className={`uppercase h-10 w-10  text-xl border-[1px] flex items-center justify-center rounded-full ${getColor(0)}`}>
                          {/* {contact.name.split("").shift() } */}
                          <p>#</p>
                  </div>
                  
                </div>
              }
            </div>
            <div className='text-center'>
            {
              selectedChatType === 'channel'
                ? selectedChatData?.name || "Unknown Channel"
                : selectedChatType === "dm"
                ? selectedChatData?.firstName && selectedChatData?.lastName
                  ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                  : selectedChatData?.email || "Unknown User"
               : null
            }

            </div>
          </div>
         <div className='flex items-center justify-center gap-5'>
              <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all '>
                <RiCloseFill className='text-3xl' onClick={closeChat}/>
              </button>
         </div>
      </div>
    </div>
  )
}

export default ChatHeader