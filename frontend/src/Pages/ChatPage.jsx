import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '../context/ChatProvider'
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import { Box } from '@chakra-ui/react';
import AIChatBot from '../components/AIChatBot';

function ChatPage() {
    const { user, selectAIChatBot } = ChatState();
    const [fetchAgain, setFetchAgain] = useState();
    
  return (
    <div style={{ width: "100%"}}>
        {user && <SideDrawer />}
        <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && !selectAIChatBot && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
          {user && selectAIChatBot && <AIChatBot />}
        </Box>
    </div>
  )
}

export default ChatPage