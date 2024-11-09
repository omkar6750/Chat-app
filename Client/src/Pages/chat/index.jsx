import { useAppStore } from '@/store';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner';

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
    <div>Chat</div>
  )
};

export default Chat