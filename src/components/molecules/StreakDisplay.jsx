import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const StreakDisplay = ({ streakCount }) => {
  return (
    <div className="flex items-center justify-center space-x-3 p-6 bg-gradient-to-r from-accent/20 to-warning/20 rounded-2xl">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="relative"
      >
        <ApperIcon 
          name="Flame" 
          size={32} 
          className="text-accent drop-shadow-lg"
        />
        {streakCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-gradient-to-r from-accent to-warning text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
          >
            {streakCount}
          </motion.div>
        )}
      </motion.div>
      
      <div className="text-center">
        <div className="text-2xl font-display gradient-text">
          {streakCount} Day{streakCount !== 1 ? "s" : ""}
        </div>
        <div className="text-sm text-gray-600">
          Keep the streak alive!
        </div>
      </div>
    </div>
  );
};

export default StreakDisplay;