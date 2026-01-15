import React, { useEffect } from 'react'
import { Container, Box, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useHistory } from 'react-router-dom'

function HomePage() {
    const history = useHistory()

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userInfo"))

      if(user){
        history.push('/chats')
      }
    }, [history])
  return (
    <Container maxW="xl" centerContent>
        <Box display="flex" 
            justifyContent="center"
            p={3} w='100%'
            bg="white" 
            m="40px 0 15px 0"
            borderRadius="lg"
            borderWidth="1px">
            <Text fontSize="4xl" fontFamily="Work Sans">Talk-a-Tive</Text>
        </Box>
        <Box w='100%' bg="white" borderRadius="lg" p={4} borderWidth="1px">
            <Tabs variant='soft-rounded'>
                <TabList m='1em'>
                    <Tab w="50%">Login</Tab>
                    <Tab w="50%">Sign up</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel><Login /></TabPanel>
                    <TabPanel><Signup /></TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Container>
  )
}

export default HomePage