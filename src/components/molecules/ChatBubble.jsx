import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const ChatBubble = ({ message, isUser, timestamp }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} items-end space-x-2 max-w-[80%]`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? "ml-2" : "mr-2"}`}>
          {isUser ? (
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
          ) : (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 bg-gradient-to-r from-accent to-warning rounded-full flex items-center justify-center"
            >
              <ApperIcon name="Bot" size={16} className="text-white" />
            </motion.div>
          )}
        </div>
        
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-gradient-to-r from-primary to-secondary text-white rounded-br-md"
              : "bg-surface text-gray-800 border border-primary/10 rounded-bl-md"
          }`}
        >
          <div className="text-sm leading-relaxed">{message}</div>
          {timestamp && (
            <div className={`text-xs mt-1 ${isUser ? "text-white/70" : "text-gray-400"}`}>
              {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;