import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"



import { FaPlus } from "react-icons/fa"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTE} from "@/Utils/constants"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store"
import MultipleSelector from "@/components/ui/MultipleSelector"



const CreateChannel = () => {
    const {addChannel, userInfo, setSelectedChatData, selectedChatData} = useAppStore();
    const [newChannelModal, setNewChannelModal] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("")


    useEffect(() => {
        const getData = async () =>{
            const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {withCredentials:true})
            setAllContacts(response.data.contacts)
            console.log("all contacts:",response.data.contacts)
        };
        getData();
    }, [])
    
    const createChannel = async() =>{
        try {
            if(channelName.length > 0 && selectedContacts.length >0){
            const response = await apiClient.post(CREATE_CHANNEL_ROUTE, {
                name: channelName,
                members: selectedContacts.map((contact) => contact.value)
            }, {withCredentials:true} );
            if(response.status === 201) {
                setChannelName("");
                setSelectedContacts([]);
                setNewChannelModal(false);
                addChannel(response.data.channel);
                setSelectedChatData(response.data.channel)
            }
        }
        
        } catch (error) {
            console.log({error});
        }
    }

  return (
    <>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                    onClick={()=>setNewChannelModal(true)}
                    />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] border-red-100 mb-2 p-3 text-white">
                    Create New Channel
                </TooltipContent>

            </Tooltip>
        </TooltipProvider>
        <Dialog 
        open={newChannelModal}
        onOpenChange={setNewChannelModal}
        >
            <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col ">
                <DialogHeader>
                    <DialogTitle>Please Fill Up The Details For New Channel</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <input type="text" placeholder="Channel Name" className="w-[350px] rounded-lg p-3 bg-[#2c2e3b] border-none "
                    onChange={(e)=> setChannelName(e.target.value)}
                    value={channelName} />
                </div>
                <div>
                    <MultipleSelector
                    className=" z-1000 rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                    defaultOptions={allContacts}
                    placeholder="Search Contacts"
                    value={selectedContacts}
                    onChange={setSelectedContacts}
                    emptyIndicator= {
                        <p className="text-center text-lg leading-10 text-gray-600">No results found</p>
                    }
                    />
                </div>
                <div>
                    <Button className='w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300'
                    onClick={createChannel}
                    > Create Channel</Button>
                </div>
                
            </DialogContent>
        </Dialog>
    </>
  )
}

export default CreateChannel