import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
        <ApperIcon name="AlertTriangle" size={32} className="text-error" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-display text-gray-800">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 max-w-sm">
          {message}
        </p>
      </div>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          <span>Try Again</span>
        </Button>
      )}
    </motion.div>
  );
};

export default Error;