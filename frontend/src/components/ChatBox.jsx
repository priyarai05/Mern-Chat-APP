import React from 'react'
import { ChatState } from "../context/ChatProvider";
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

function ChatBox({ fetchAgain, setFetchAgain}) {
  const { selectedChat } = ChatState();
  return (
    <Box
    display={{base: selectedChat ? "flex" : 'none', md:"flex"}}
    flexDir="column"
    alignItems="center"
    bg="white"
    p={3}
    w={{base: "100%", md:"68%"}}
    borderRadius="lg"
    borderWidth="1px">
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox