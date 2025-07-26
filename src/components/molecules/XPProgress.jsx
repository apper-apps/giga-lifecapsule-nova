import { motion } from "framer-motion";

const XPProgress = ({ xpPoints, currentLevel }) => {
  const xpForNextLevel = (currentLevel + 1) * 100;
  const currentLevelXP = currentLevel * 100;
  const progressXP = xpPoints - currentLevelXP;
  const progressPercent = (progressXP / 100) * 100;

  return (
    <div className="bg-surface rounded-2xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-display gradient-text">
          Level {currentLevel}
        </div>
        <div className="text-sm text-gray-600">
          {progressXP}/100 XP
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      
      <div className="text-xs text-gray-500 mt-1 text-center">
        {100 - progressXP} XP to next level
      </div>
    </div>
  );
};

export default XPProgress;