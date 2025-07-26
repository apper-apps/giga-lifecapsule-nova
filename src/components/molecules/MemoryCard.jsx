import { format } from "date-fns";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const MemoryCard = ({ memory, onClick }) => {
  const getMoodIcon = (mood) => {
    const moodIcons = {
      happy: "Smile",
      sad: "Frown",
      excited: "Zap",
      calm: "Leaf",
      grateful: "Heart",
      proud: "Star"
    };
    return moodIcons[mood] || "Circle";
  };

  const getMoodColor = (mood) => {
    const moodColors = {
      happy: "text-yellow-500",
      sad: "text-blue-500",
      excited: "text-purple-500",
      calm: "text-green-500",
      grateful: "text-pink-500",
      proud: "text-orange-500"
    };
    return moodColors[mood] || "text-gray-500";
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="memory-card cursor-pointer"
      onClick={() => onClick && onClick(memory)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm text-gray-500">
          {format(new Date(memory.timestamp), "MMM dd, yyyy 'at' h:mm a")}
        </div>
        {memory.mood && (
          <ApperIcon
            name={getMoodIcon(memory.mood)}
            size={20}
            className={getMoodColor(memory.mood)}
          />
        )}
      </div>
      
      <div className="text-gray-800 mb-3 line-clamp-3">
        {memory.text}
      </div>
      
      {memory.tags && memory.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {memory.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="default" className="text-xs">
              {tag}
            </Badge>
          ))}
          {memory.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{memory.tags.length - 3} more
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MemoryCard;