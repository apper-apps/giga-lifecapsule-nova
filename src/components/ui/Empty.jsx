import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No memories yet", 
  message = "Start capturing your precious moments today!", 
  actionLabel = "Create Memory",
  onAction,
  icon = "BookOpen"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
    >
      <motion.div
        animate={{ bounce: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-20 h-20 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center"
      >
        <ApperIcon name={icon} size={40} className="text-primary" />
      </motion.div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-display gradient-text">
          {title}
        </h3>
        <p className="text-gray-600 max-w-sm">
          {message}
        </p>
      </div>
      
      {onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>{actionLabel}</span>
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;