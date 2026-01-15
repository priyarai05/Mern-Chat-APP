import React, { useState } from 'react'
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();
    const { setUser } = ChatState();

    function handleClick(){
        setShow(!show)
    }

    function postDetails(pics){
        setLoading(true)
        if(pic===undefined){
            toast({
                title: 'Please select an Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        if(pics.type==="image/jpeg" || pics.type==="image/png"){
            const data = new FormData();
            data.append("file",pics);
            data.append("upload_preset","talk-a-tive");
            data.append("cloud_name","dziowgnur");
            fetch("https://api.cloudinary.com/v1_1/dziowgnur/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
            .then((data) => {
                setPic(data.url.toString());
                // console.log(data.url.toString());
                setLoading(false);
            })
        }else{
            toast({
                title: 'Please select an Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
    }

    const submitHandler = async() => {
        setLoading(true)
        if(!name || !email || !password || !confirmPassword){
            toast({
                title: "Enter all the required fields",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
        if(password !== confirmPassword){
            toast({
                title: "Passwords do not Match",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            }
            const {data} = await axios.post("/api/user",{name,email,password,pic},config);
            toast({
                title: "Registration Successful",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setUser(data);
            localStorage.setItem("userInfo",JSON.stringify(data))
            setLoading(false);
            history.push('/chats')
        } catch (error) {
            toast({
                title: "Error Occured, please try again!",
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    }

  return (
    <VStack spacing="5px">
        <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Enter Full Name" onChange={(e)=>setName(e.target.value)} />
        </FormControl>
        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input type={show ? "text" :"password"} placeholder="Enter Password" onChange={(e)=>setPassword(e.target.value)} />
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>{show ? 'hide' : 'show'}</Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="confirm-password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
            <Input type={show ? "text" :"password"} placeholder="Enter Password" onChange={(e)=> setConfirmPassword(e.target.value)} />
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm'>{show ? 'hide' : 'show'}</Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="pic">
            <FormLabel>Upload your picture</FormLabel>
            <Input
            type="file"
            p={1.5}
            accept='images/*'
            onChange={(e) => postDetails(e.target.files[0])} />
        </FormControl>
        <Button 
            colorScheme="blue"
            w='100%' mt={15} 
            onClick={submitHandler}
            isLoading={loading}
         >Sign Up</Button>
    </VStack>
  )
}

export default Signup