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
    <>
    <ChatContainer></ChatContainer>
    <ConatactsContainer></ConatactsContainer>
    <EmptyChatContainer></EmptyChatContainer></>
  )
};

export default Chat