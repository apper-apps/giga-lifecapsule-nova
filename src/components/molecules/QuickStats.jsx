import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const QuickStats = ({ totalMemories, chatCount, level, badges }) => {
  const stats = [
    {
      label: "Memories",
      value: totalMemories,
      icon: "BookOpen",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      label: "AI Chats",
      value: chatCount,
      icon: "MessageCircle",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      label: "Level",
      value: level,
      icon: "Trophy",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      label: "Badges",
      value: badges?.length || 0,
      icon: "Award",
      color: "text-success",
      bgColor: "bg-success/10"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-surface rounded-2xl p-4 shadow-md text-center"
        >
          <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}>
            <ApperIcon name={stat.icon} size={20} className={stat.color} />
          </div>
          <div className="text-2xl font-display gradient-text">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;