import { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, FormControl, IconButton, Input, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from "axios";
import ScrollableFeed from "react-scrollable-feed";
import Lottie from "react-lottie";
import animationData from '../animation/typing.json'

function AIChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { user, selectAIChatBot, setSelectAIChatBot } = ChatState();
  const [loading, setLoading] = useState(false);

  const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      renderSettings: {
          preserveAspectRation: "xMidyMid slice"
      }
  }

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages([...messages, userMsg]);
    setLoading(true);

    const config = {
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
    }

    const message = JSON.stringify({ message: input })
    setInput("");
    const { data } = await axios.post('/api/ai',{message}, config)

    setMessages(prev => [
      ...prev,
      { role: "bot", text: data.reply },
    ]);

    setLoading(false);
  };

  return (
    <Box
      display={{base: selectAIChatBot ? "flex" : 'none', md:"flex"}}
      flexDir="column"
      alignItems="center"
      bg="white"
      p={3}
      w={{base: "100%", md:"68%"}}
      h="100%"
      borderRadius="lg">
        <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center">
          <IconButton
                display={{ base: "flex", md: 'none'}}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectAIChatBot(false)} />
          AI Gemini
        </Text>
        <Box 
        display="flex"
        flexDir="column"
        justifyContent="flex-end"
        p={3}
        bg="#E8E8E8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden">
          <ScrollableFeed>
            {messages && messages.map((m,i) => (
                <div style={{ display: "flex"}} key={i}>
                    
                    <span style={{
                        background: `${m.role === 'user' ? "#BEE3F8" : "#B9F5D0"}`,
                        borderRadius: "20px",
                        padding: '5px 15px',
                        maxWidth: '75%',
                        marginLeft: m.role === 'user' ? 'auto' : '0px',
                    }}>{m.text}</span>
                </div>
            ))}
            {loading && 
            <div>
              <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} />
            </div>}
          </ScrollableFeed>
          <FormControl onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }} isRequired mt={3}>
            <Input variant="filled" 
            bg="#E0E0E0" 
            placeholder='Ask Anything' 
            value={input} onChange={e => setInput(e.target.value)} />
          </FormControl>
        </Box>
    </Box>
  );
}

export default AIChatBot