import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ChatBubble from "@/components/molecules/ChatBubble";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { chatService } from "@/services/api/chatService";
import { userService } from "@/services/api/userService";
import { aiService } from "@/services/api/aiService";
import { toast } from "react-toastify";

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userData, setUserData] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [chatHistory, user] = await Promise.all([
        chatService.getAll(),
        userService.getProfile()
      ]);
      setMessages(chatHistory);
      setUserData(user);

      // Show welcome message if first time
      if (chatHistory.length === 0) {
        const welcomeMessage = {
          Id: Date.now(),
          message: `Hey ${user.name}! 🌟 I'm your AI companion here to listen, chat, and help you reflect on your memories. How are you feeling today?`,
          response: "",
          timestamp: new Date().toISOString(),
          isUser: false
        };
        setMessages([welcomeMessage]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Check daily limit for free users
    if (userData?.subscriptionStatus === "free" && userData?.dailyChatCount >= 10) {
      toast.error("Daily chat limit reached! Upgrade to Premium for unlimited chats 🚀");
      return;
    }

    const userMessage = {
      Id: Date.now(),
      message: inputValue.trim(),
      timestamp: new Date().toISOString(),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await aiService.getChatResponse(inputValue.trim(), userData?.name);
      
      const aiMessage = {
        Id: Date.now() + 1,
        message: aiResponse,
        timestamp: new Date().toISOString(),
        isUser: false
      };

      // Save chat to service
      await chatService.create({
        message: userMessage.message,
        response: aiResponse,
        timestamp: userMessage.timestamp
      });

      // Update daily chat count
      await userService.incrementChatCount();

      setMessages(prev => [...prev, aiMessage]);
      
      // Award XP for chatting
      toast.success("Great conversation! +5 XP earned! 💬");
      
    } catch (err) {
      toast.error("Failed to get AI response");
      // Remove user message if AI response failed
      setMessages(prev => prev.filter(msg => msg.Id !== userMessage.Id));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) return <Loading message="Loading your AI companion..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header title="AI Companion" />
      
      {/* Chat Limit Indicator */}
      {userData?.subscriptionStatus === "free" && (
        <div className="bg-accent/10 border-b border-accent/20 px-4 py-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Daily chats: {userData?.dailyChatCount || 0}/10
            </p>
            {userData?.dailyChatCount >= 10 && (
              <Button variant="accent" size="sm">
                Upgrade Now
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <Empty
            title="Start a conversation"
            message="Your AI companion is here to listen and chat with you!"
            actionLabel="Say Hello"
            onAction={() => setInputValue("Hello! How are you today?")}
            icon="MessageCircle"
          />
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble
                key={message.Id}
                message={message.message}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-center space-x-2 bg-surface rounded-2xl px-4 py-3 border border-primary/10">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-8 h-8 bg-gradient-to-r from-accent to-warning rounded-full flex items-center justify-center"
                  >
                    <ApperIcon name="Bot" size={16} className="text-white" />
                  </motion.div>
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-primary/10 bg-surface/90 backdrop-blur-sm p-4">
        <div className="flex items-center space-x-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Share your thoughts..."
            className="flex-1"
            disabled={isTyping || (userData?.subscriptionStatus === "free" && userData?.dailyChatCount >= 10)}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping || (userData?.subscriptionStatus === "free" && userData?.dailyChatCount >= 10)}
            variant="primary"
            className="px-4 py-3"
          >
            <ApperIcon name="Send" size={16} />
          </Button>
        </div>
        
        {userData?.subscriptionStatus === "free" && userData?.dailyChatCount >= 8 && (
          <div className="text-xs text-gray-500 mt-2 text-center">
            {10 - userData.dailyChatCount} chats remaining today
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChat;