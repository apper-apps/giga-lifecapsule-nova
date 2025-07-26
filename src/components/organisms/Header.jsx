import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Header = ({ title, showBack, onBack, rightAction }) => {
  return (
    <div className="sticky top-0 bg-surface/90 backdrop-blur-md border-b border-primary/10 px-4 py-3 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 hover:bg-primary/10 rounded-xl transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={20} className="text-primary" />
            </motion.button>
          )}
          <h1 className="text-xl font-display gradient-text">
            {title}
          </h1>
        </div>
        
        {rightAction && (
          <div>{rightAction}</div>
        )}
      </div>
    </div>
  );
};

export default Header;