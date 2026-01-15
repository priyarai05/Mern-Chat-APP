import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import UserBadgeItem from '../user/UserBadgeItem'
import UserListItem from '../user/UserListItem'
import axios from 'axios'

function UpdateGroupChatModal({ fetchAgain, setFetchAgain, fetchMessages}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {user, selectedChat, setSelectedChat} = ChatState()
    const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
    const [search, setSearch] = useState();
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);

    const toast = useToast();

    const handleAddUser = async (userToAdd) => {
        if(selectedChat.users.find((u) => u._id === userToAdd._id)){
            toast({
                title: "User already Exist",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only group admin can add member",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.put('/api/chat/groupAdd', {
                chatId: selectedChat._id,
                userId: userToAdd._id
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.message.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false)
        }
    }

    const handleRemove = async (userToRemove) => {
        if(selectedChat?.groupAdmin?._id !== user._id && user._id !== userToRemove._id){
            toast({
                title: "Only group admin can remove member",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.put('/api/chat/groupRemove', {
                chatId: selectedChat._id,
                userId: userToRemove._id
            }, config);
            // userToRemove._id === selectedChat.groupAdmin 
            user._id === userToRemove._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.message.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false)
        }
    }

    const handleRename = async() => {
        if(!groupChatName){
            return;
        }
        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.put('/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false)
            toast({
                title: "Group Name Updated Successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.message.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setRenameLoading(false)
        }
        setGroupChatName("")
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if(!query){
            setSearchResult([])
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to load the search result",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    }


  return (
    <>
      <IconButton display={{base: "flex"}} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" 
          fontFamily="Work Sans" 
          display="flex" 
          justifyContent="center">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flex="wrap">
                {selectedChat.users.map((u) => (
                    <UserBadgeItem key={u._id} 
                    user={u} 
                    handleFunction={() => handleRemove(u)} />
                ))}
            </Box>
            <FormControl display="flex">
                <Input placeholder="Chat Name" 
                value={groupChatName} 
                mb={3} 
                onChange={(e) => setGroupChatName(e.target.value)} />
                <Button ml={1} colorScheme='teal' 
                isLoading={renameLoading} 
                onClick={() => handleRename()}>
                    Update
                </Button>
            </FormControl>
            <FormControl>
                <Input placeholder='Add user to group' mb={1} 
                onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
            {loading ? 
            <div>
                <Spinner size="lg" />
            </div>
            : (
                searchResult.length > 0 && searchResult?.slice(0,4).map((user) => (
                    <UserListItem key={user._id} user={user} 
                    handleFunction={() => handleAddUser(user)} />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal