import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const NavigationItem = ({ to, icon, label, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 relative ${
          isActive
            ? "text-primary bg-primary/10"
            : "text-gray-600 hover:text-primary hover:bg-primary/5"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="relative">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <ApperIcon name={icon} size={20} />
              {badge && badge > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-accent to-warning text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                >
                  {badge > 99 ? "99+" : badge}
                </motion.div>
              )}
            </motion.div>
          </div>
          <span className="text-xs mt-1 font-medium">{label}</span>
          {isActive && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-1/2 w-1 h-1 bg-primary rounded-full"
              style={{ transform: "translateX(-50%)" }}
            />
          )}
        </>
      )}
    </NavLink>
  );
};

export default NavigationItem;