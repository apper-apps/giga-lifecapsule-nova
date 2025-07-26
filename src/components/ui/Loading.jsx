import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading memories..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center"
      >
        <ApperIcon name="Heart" size={24} className="text-white" />
      </motion.div>
      
      <div className="space-y-2 text-center">
        <div className="text-lg font-display gradient-text">
          {message}
        </div>
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
    </div>
  );
};

export default Loading;