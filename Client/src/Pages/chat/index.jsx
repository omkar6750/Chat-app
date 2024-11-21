import { useAppStore } from '@/store';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner';
import ChatContainer from './components/chat-container';
import ConatactsContainer from './components/contacts-container';
import EmptyChatContainer from './components/empty-chat-container';

const Chat = () => {
  const navigate = useNavigate();
  const {userInfo} = useAppStore();

  useEffect(() => {
    if(!userInfo.profileSetup){
      toast("Please setup profile to continue.");
      navigate("/profile");
    };

  }, [userInfo, navigate])

  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      <ConatactsContainer></ConatactsContainer>
      {/* <EmptyChatContainer></EmptyChatContainer> */}
      {/* <ChatContainer></ChatContainer> */}
    </div>
  )
};

export default Chat