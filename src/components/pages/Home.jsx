import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { userService } from "@/services/api/userService";
import { chatService } from "@/services/api/chatService";
import { memoryService } from "@/services/api/memoryService";
import ApperIcon from "@/components/ApperIcon";
import QuickStats from "@/components/molecules/QuickStats";
import StreakDisplay from "@/components/molecules/StreakDisplay";
import XPProgress from "@/components/molecules/XPProgress";
import MemoryForm from "@/components/organisms/MemoryForm";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [dailyPrompt, setDailyPrompt] = useState("");

  const dailyPrompts = [
    "What made you smile today? 😊",
    "What are you grateful for right now? 🙏",
    "Describe a moment that surprised you today 🌟",
    "What's something you learned today? 📚",
    "Who made your day better? ❤️",
    "What challenged you today and how did you handle it? 💪",
    "What's a small victory you had today? 🎉",
    "What made you feel proud today? 🏆"
  ];

  useEffect(() => {
    loadData();
    setDailyPrompt(dailyPrompts[new Date().getDay()]);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [user, memories, chats] = await Promise.all([
        userService.getProfile(),
        memoryService.getAll(),
        chatService.getAll()
      ]);
      
      setUserData(user);
      setStats({
        totalMemories: memories.length,
        chatCount: chats.length,
        level: user.currentLevel,
        badges: user.badges
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMemory = async (memoryData) => {
    try {
      await memoryService.create(memoryData);
      
      // Update streak and XP
      const updatedUser = await userService.updateStreak();
      setUserData(updatedUser);
      
      // Refresh stats
      const memories = await memoryService.getAll();
      setStats(prev => ({
        ...prev,
        totalMemories: memories.length
      }));
      
      setShowMemoryForm(false);
      toast.success("Memory captured! +20 XP earned! 🎉");
    } catch (err) {
      toast.error("Failed to save memory");
    }
  };

  if (loading) return <Loading message="Loading your dashboard..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-background">
      <Header title="LifeCapsule AI" />
      
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
<h2 className="text-2xl font-display gradient-text mb-2">
            Welcome back, {userData?.Name || user?.firstName || 'User'}! 👋
          </h2>
          <p className="text-gray-600">
            Ready to capture some memories today?
          </p>
        </motion.div>

        {/* Streak Display */}
        <StreakDisplay streakCount={userData?.streakCount || 0} />

        {/* XP Progress */}
        <XPProgress 
          xpPoints={userData?.xpPoints || 0} 
          currentLevel={userData?.currentLevel || 1} 
        />

        {/* Daily Prompt */}
        <Card className="bg-gradient-to-r from-secondary/10 to-primary/10">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-warning rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Lightbulb" size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg gradient-text mb-2">
                Daily Reflection
              </h3>
              <p className="text-gray-700 mb-4">
                {dailyPrompt}
              </p>
              <Button
                onClick={() => setShowMemoryForm(true)}
                variant="primary"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Plus" size={16} />
                <span>Capture Memory</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div>
          <h3 className="text-lg font-display gradient-text mb-4">
            Your Journey
          </h3>
          <QuickStats {...stats} />
        </div>

        {/* Quick Actions */}
        <Card>
          <h3 className="font-display text-lg gradient-text mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              className="flex flex-col items-center space-y-2 h-20"
              onClick={() => setShowMemoryForm(true)}
            >
              <ApperIcon name="Plus" size={20} />
              <span className="text-sm">Add Memory</span>
            </Button>
            <Button
              variant="secondary"
              className="flex flex-col items-center space-y-2 h-20"
            >
              <ApperIcon name="MessageCircle" size={20} />
              <span className="text-sm">Chat with AI</span>
            </Button>
          </div>
        </Card>

        {/* Subscription Status */}
        {userData?.subscriptionStatus === "free" && (
          <Card className="bg-gradient-to-r from-accent/10 to-warning/10 border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg gradient-text">
                  Unlock Premium ✨
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Unlimited memories, AI chats, and more!
                </p>
                <p className="text-xs text-gray-500">
                  Daily chats: {userData?.dailyChatCount || 0}/10
                </p>
              </div>
              <Button variant="accent" size="sm">
                Upgrade
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Memory Form Modal */}
      {showMemoryForm && (
        <MemoryForm
          onSubmit={handleCreateMemory}
          onCancel={() => setShowMemoryForm(false)}
        />
      )}
    </div>
  );
};

export default Home;