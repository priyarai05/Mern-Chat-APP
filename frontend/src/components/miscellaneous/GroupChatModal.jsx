import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../user/UserListItem';
import UserBadgeItem from '../user/UserBadgeItem';

function GroupChatModal({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState();
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);

    const toast = useToast();

    const {user, chats, setChats} = ChatState()

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
            const { data } = await axios.get(`/api/user?search=${query}`, config);
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

    const handleGroupMember = (userToAdd) => {
        if(selectedUser.includes(userToAdd)){
            toast({
                title: "User already added",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        setSelectedUser([...selectedUser ,userToAdd]);
    }

    const handleDelete = (delUser) => {
        const selection = selectedUser.filter(user => user._id !== delUser._id)
        setSelectedUser(selection)
    }

    const handleSubmit = async() => {
        if(!groupChatName || !selectedUser){
            toast({
                title: "Please fill all the Fields",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top"
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
            const {data} = await axios.post("/api/chat/group",{
                name: groupChatName,
                users: JSON.stringify(selectedUser.map(u => u._id))},config);
            toast({
                title: "New Group Created",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setChats([data, ...chats]);
            onClose();
            setSelectedUser([])
            setGroupChatName("")
        } catch (error) {
            toast({
                title: "Failed to create Group Chat",
                description: error.response.data,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    }
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work sans" 
          display="flex" justifyContent="center">Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
                <Input placeholder='Group Name' 
                mb={3} 
                onChange={(e) => setGroupChatName(e.target.value)} />
            </FormControl>
            <FormControl>
                <Input placeholder='Add users' mb={1} 
                onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
            {selectedUser.map((user) => (
                <UserBadgeItem key={user._id} user={user} 
                handleFunction={() => handleDelete(user)} />
            ))}
            {loading ? 
            <div>
                <Spinner />
            </div>
            : (
                searchResult.length > 0 && searchResult?.slice(0,4).map((user) => (
                    <UserListItem key={user._id} user={user} 
                    handleFunction={() => handleGroupMember(user)} />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal