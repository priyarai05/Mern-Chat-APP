import React from 'react'
import { useState, useEffect } from 'react';
import { ChatState } from "../context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'
import axios from 'axios';
import ChatLoading from './ChatLoading';
import { getSender } from "../config/ChatLogics";
import GroupChatModal from './miscellaneous/GroupChatModal';

function MyChats({fetchAgain}) {
  const { user, selectedChat, setSelectedChat, chats, setChats, selectAIChatBot, setSelectAIChatBot } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();

  const fetchChat = async() => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const {data} = await axios.get('/api/chat' ,config);
      setChats(data)
    } catch (error) {
      toast({
        title: "Failed to Load Chat!",
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      });
    }
  }
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChat()
  }, [fetchAgain])
  
  return (
    <Box
      display={{ base: (selectedChat || selectAIChatBot) ? "none" : "flex", md: "flex"}}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{base: "100%", md: "31%"}}
      borderRadius="lg"
      borderWidth="1px" >
        <Box
          pb={3}
          px={3}
          display="flex"
          w="100%"
          alignItems="center"
          justifyContent="space-between"
          fontSize={{base: "28px", md:"30px"}}
          fontFamily="Work sans">
          My Chats
          <GroupChatModal>
            <Button 
              display="flex"
              fontSize={{base: "17px", md:"10px", lg:"17px"}}
              rightIcon={<AddIcon />}
              >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          display="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          <Box
            onClick={() => {
              setSelectAIChatBot(true);
              setSelectedChat("");
            }}
            cursor="pointer"
            bg={selectAIChatBot ? "#38B2AC" : "#E8E8E8"}
            color={selectAIChatBot ? "white" : "black"}
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
          >
            <Text>
              {"AI BOT"}
            </Text>  
          </Box>
          {chats ? (
            <Stack overflowY="scroll">
              {chats?.map((chat) => (
                <Box
                  onClick={() => {
                    setSelectedChat(chat)
                    setSelectAIChatBot(false)
                  }}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat 
                    ? getSender(loggedUser, chat.users) 
                    : chat.chatName
                    }
                  </Text>  
                </Box>
              ))}
            </Stack>
          ) :(
            <ChatLoading />
          )
          }
        </Box>
    </Box>
  )
}

export default MyChats