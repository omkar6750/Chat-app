
import { useAppStore } from '@/store';
import { HOST } from '@/Utils/constants';
import {createContext, useContext, useEffect, useRef} from 'react'
import { io } from 'socket.io-client';

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

            const handleReceiveMessage = (message) => {
                const {selectedChatData, selectedChatType, addMessage} = useAppStore.getState();
                if(selectedChatType === "dm" && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)){
                    addMessage(message);
                    console.log("message received", message);
                }
            }

            socket.current.on("receiveMessage", handleReceiveMessage);
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