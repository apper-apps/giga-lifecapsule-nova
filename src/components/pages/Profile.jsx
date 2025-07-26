import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { userService } from "@/services/api/userService";
import { memoryService } from "@/services/api/memoryService";
import { chatService } from "@/services/api/chatService";
import { futureCapsuleService } from "@/services/api/futureCapsuleService";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [user, memories, chats, capsules] = await Promise.all([
        userService.getProfile(),
        memoryService.getAll(),
        chatService.getAll(),
        futureCapsuleService.getAll()
      ]);
      
      setUserData(user);
      setStats({
        totalMemories: memories.length,
        totalChats: chats.length,
        totalCapsules: capsules.length,
        unlockedCapsules: capsules.filter(c => c.isUnlocked).length
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badgeType) => {
    const badgeIcons = {
      "First Memory": "BookOpen",
      "Memory Keeper": "Heart",
      "Week Warrior": "Flame",
      "Month Master": "Crown",
      "Chat Champion": "MessageCircle",
      "Future Thinker": "Clock",
      "Level Up": "Trophy"
    };
    return badgeIcons[badgeType] || "Award";
  };

  const getLevelTitle = (level) => {
    if (level >= 20) return "Memory Master";
    if (level >= 15) return "Life Explorer";
    if (level >= 10) return "Memory Keeper";
    if (level >= 5) return "Reflection Warrior";
    return "Memory Newbie";
  };

  if (loading) return <Loading message="Loading your profile..." />;
  if (error) return <Error message={error} onRetry={loadProfile} />;

  return (
    <div className="min-h-screen bg-background">
      <Header title="Profile" />

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="User" size={32} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-display gradient-text mb-2">
            {userData?.name}
          </h2>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Badge variant="accent" className="flex items-center space-x-1">
              <ApperIcon name="Crown" size={14} />
              <span>Level {userData?.currentLevel}</span>
            </Badge>
            <Badge variant="secondary">
              {getLevelTitle(userData?.currentLevel)}
            </Badge>
          </div>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Flame" size={16} className="text-accent" />
              <span>{userData?.streakCount} day streak</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Star" size={16} className="text-primary" />
              <span>{userData?.xpPoints} XP</span>
            </div>
          </div>
        </Card>

        {/* Subscription Status */}
        <Card className={userData?.subscriptionStatus === "premium" ? "bg-gradient-to-r from-accent/10 to-warning/10 border-accent/20" : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg gradient-text flex items-center space-x-2">
                <ApperIcon 
                  name={userData?.subscriptionStatus === "premium" ? "Crown" : "User"} 
                  size={20} 
                  className={userData?.subscriptionStatus === "premium" ? "text-accent" : "text-gray-500"} 
                />
                <span>{userData?.subscriptionStatus === "premium" ? "Premium" : "Free"} Plan</span>
              </h3>
              {userData?.subscriptionStatus === "free" && (
                <p className="text-sm text-gray-600 mt-1">
                  Daily chats: {userData?.dailyChatCount || 0}/10
                </p>
              )}
            </div>
            {userData?.subscriptionStatus === "free" && (
              <Button variant="accent" size="sm">
                Upgrade
              </Button>
            )}
          </div>
        </Card>

        {/* Statistics */}
        <Card>
          <h3 className="font-display text-lg gradient-text mb-4">Your Journey</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-xl">
              <div className="text-2xl font-display text-primary mb-1">
                {stats?.totalMemories || 0}
              </div>
              <div className="text-sm text-gray-600">Memories</div>
            </div>
            
            <div className="text-center p-4 bg-secondary/5 rounded-xl">
              <div className="text-2xl font-display text-secondary mb-1">
                {stats?.totalChats || 0}
              </div>
              <div className="text-sm text-gray-600">AI Chats</div>
            </div>
            
            <div className="text-center p-4 bg-accent/5 rounded-xl">
              <div className="text-2xl font-display text-accent mb-1">
                {stats?.totalCapsules || 0}
              </div>
              <div className="text-sm text-gray-600">Capsules</div>
            </div>
            
            <div className="text-center p-4 bg-success/5 rounded-xl">
              <div className="text-2xl font-display text-success mb-1">
                {stats?.unlockedCapsules || 0}
              </div>
              <div className="text-sm text-gray-600">Unlocked</div>
            </div>
          </div>
        </Card>

        {/* Badges */}
        <Card>
          <h3 className="font-display text-lg gradient-text mb-4">Achievements</h3>
          
          {userData?.badges && userData.badges.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {userData.badges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name={getBadgeIcon(badge)} size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-800">{badge}</div>
                    <div className="text-xs text-gray-500">Achievement unlocked!</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="Award" size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No badges earned yet</p>
              <p className="text-sm text-gray-400">Keep using the app to unlock achievements!</p>
            </div>
          )}
        </Card>

        {/* Settings */}
        <Card>
          <h3 className="font-display text-lg gradient-text mb-4">Settings</h3>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Bell" size={20} className="text-gray-500" />
                <span className="text-gray-700">Notifications</span>
              </div>
              <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Palette" size={20} className="text-gray-500" />
                <span className="text-gray-700">Theme</span>
              </div>
              <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Download" size={20} className="text-gray-500" />
                <span className="text-gray-700">Export Data</span>
              </div>
              <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <ApperIcon name="HelpCircle" size={20} className="text-gray-500" />
                <span className="text-gray-700">Help & Support</span>
              </div>
              <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            </button>
          </div>
        </Card>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">LifeCapsule AI v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">Made with ❤️ for preserving memories</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;