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

function Login() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [show, setShow] = useState(false);
      const [loading, setLoading] = useState(false);
      const toast = useToast();
      const history = useHistory();
      const { setUser } = ChatState();
  
      function handleClick(){
          setShow(!show)
      }
  
      const submitHandler = async() => {
        setLoading(true);
        if(!email || !password){
            toast({
                title: "Enter the required fields",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false);
            return;
        }
        try {
            const {data} = await axios.post("/api/user/login",{email,password});
            toast({
                title: "Logged in Successful",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setUser(data);
            localStorage.setItem("userInfo",JSON.stringify(data));
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
          <FormControl id="login-email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input value={email} placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)} />
          </FormControl>
          <FormControl id="login-password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
              <Input type={show ? "text" :"password"} value={password} placeholder="Enter Password" onChange={(e)=>setPassword(e.target.value)} />
              <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleClick}>{show ? 'hide' : 'show'}</Button>
              </InputRightElement>
              </InputGroup>
          </FormControl>
          <Button colorScheme="blue" 
          w='100%' 
          mt={15} 
          onClick={submitHandler}
          isLoading={loading}
          >Login</Button>
          <Button colorScheme="red" w='100%' onClick={() => {
            setEmail("guest@example.com");
            setPassword("12345678")
          }}>
            Get Guest User Credentials
          </Button>

      </VStack>
    )
  }

export default Login