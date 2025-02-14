import { useAppStore } from '@/store'
import { HOST } from '@/Utils/constants';
import { Avatar } from '@radix-ui/react-avatar';
import React from 'react'
import { AvatarImage } from './avatar';
import { getColor } from '@/lib/utils';

const ContactList = ({contacts, isChannel}) => {

    const {
        selectedChatData, 
        setSelectedChatData, 
        setSelectedChatType, 
        setSelectedChatMessages,
        } = useAppStore();
        

    const handleClick = (contact) => {
        if(isChannel) setSelectedChatType("channel"); 
        else setSelectedChatType("dm");
        setSelectedChatData(contact);
        if(selectedChatData && selectedChatData._id !== contact._id){
            setSelectedChatMessages([]);
        }
         

    } 
    return (
    <div className='mt-5'>{
        contacts.map((contact) => (
            <div key={contact._id} 
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id  === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]/80 ":"hover:bg-[#f1f1f111]"}`}
            onClick={() => handleClick(contact)}
            >
            <div className="flex gap-5 items-center justify-start text-neutral-300  ">
                {
                !isChannel && 
                    (<div className="flex gap-3 items-center justify-center">
                        <div className="w-12 h-12 relative">
                            <Avatar className=' h-10 w-10  rounded-full overflow-hidden'>
                            {
                                contact.image ? (
                                <AvatarImage
                                src={`${HOST}/${contact.image}`}
                                alt='profile'
                                className='object-cover rounded-full bg-black w-full h-full'/>
                                ) : (
                                <div
                                    className={`uppercase h-10 w-10  text-xl border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                    {contact.firstName?
                                    contact.firstName.split("").shift() : contact.email.split("").shift() }
                                </div>
                                )
                            }
                            </Avatar>
                        </div>
                    </div>
                  )
                
                }
                {
                    isChannel && (
                        <div
                                className={`uppercase h-10 w-10  text-xl border-[1px] flex items-center justify-center rounded-full ${getColor(1)}`}>
                                {contact.name.split("").shift() }
                                {/* <p>#</p> */}
                        </div>
                )
                }
                {
                    isChannel ? (
                        <span>{contact.name}</span>
                    ):(
                        <span>{`${contact.firstName} ${contact.lastName}`}</span>
                    )
                }
            </div>
            
        </div>))
    }</div>
  )
}

export default ContactList;