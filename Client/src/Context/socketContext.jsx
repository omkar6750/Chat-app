
import { useAppStore } from '@/store';
import { HOST } from '@/Utils/constants';
import {createContext, useContext, useEffect, useRef} from 'react'
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({children}) => {
    const {userInfo} = useAppStore();
    const socket = useRef(null);

    useEffect(() => {
        if(userInfo){ 
            socket.current = io(HOST, 
                {withCredentials:true, query:{userId:userInfo.id},});

            socket.current.on("connect", () => {
                console.log("connected to socket server")
            });

            socket.current.on("error", (errorMessage) => {
                if(errorMessage === "max-user-limit-reached"){
                    toast.error("Max user limit reached try again after later");
                }
                if(errorMessage === "message-limit-exceeded"){
                    toast.error("Max Number of messages reached.");
                }
            });

            const handleReceiveMessage = (message) => {
                const {selectedChatData, selectedChatType, addMessage, addContactsInDMContacts} = useAppStore.getState();
                if(selectedChatType === "dm" && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)){
                    addMessage(message);
                }
                addContactsInDMContacts(message)
            }

            const handleReceiveChannelMessage = ( message) => {
                const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList,} = useAppStore.getState();
                if(selectedChatType === "channel" && (selectedChatData._id === message.channelId)){
                    addMessage(message);
                }
                addChannelInChannelList(message);
            }

            socket.current.on("receiveMessage", handleReceiveMessage);
            socket.current.on("receiveChannelMessage", handleReceiveChannelMessage);

            return () => {
                socket.current.disconnect();
            }
        }    
    }, [userInfo]);

   
    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}