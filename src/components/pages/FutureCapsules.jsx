import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { futureCapsuleService } from "@/services/api/futureCapsuleService";
import { userService } from "@/services/api/userService";
import { toast } from "react-toastify";

const FutureCapsules = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    message: "",
    unlockDate: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [capsulesData, user] = await Promise.all([
        futureCapsuleService.getAll(),
        userService.getProfile()
      ]);
      setCapsules(capsulesData);
      setUserData(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCapsule = async (e) => {
    e.preventDefault();
    
    if (!formData.message.trim() || !formData.unlockDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const selectedDate = new Date(formData.unlockDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      toast.error("Please select a future date");
      return;
    }

    try {
      await futureCapsuleService.create({
        message: formData.message.trim(),
        unlockDate: formData.unlockDate,
        isUnlocked: false
      });

      await loadData();
      setShowForm(false);
      setFormData({ message: "", unlockDate: "" });
      toast.success("Future capsule created! 🕰️ +15 XP earned!");
    } catch (err) {
      toast.error("Failed to create capsule");
    }
  };

  const handleUnlockCapsule = async (capsuleId) => {
    try {
      await futureCapsuleService.unlock(capsuleId);
      await loadData();
      toast.success("Capsule unlocked! What a wonderful memory! 🎉");
    } catch (err) {
      toast.error("Failed to unlock capsule");
    }
  };

  const getDaysUntilUnlock = (unlockDate) => {
    const today = new Date();
    const unlock = new Date(unlockDate);
    const diffTime = unlock - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (loading) return <Loading message="Loading your future capsules..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Future Capsules" 
        rightAction={
          <Button
            onClick={() => setShowForm(true)}
            variant="primary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Clock" size={16} />
            <span>Create</span>
          </Button>
        }
      />

      <div className="p-4 space-y-6">
        {/* Info Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Clock" size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-display text-lg gradient-text mb-2">
                Messages to Future You
              </h3>
              <p className="text-gray-700 text-sm">
                Write messages to your future self or loved ones. They'll be unlocked on the date you choose!
              </p>
            </div>
          </div>
        </Card>

        {/* Capsules List */}
        {capsules.length === 0 ? (
          <Empty
            title="No capsules yet"
            message="Create your first message to the future!"
            actionLabel="Create Capsule"
            onAction={() => setShowForm(true)}
            icon="Clock"
          />
        ) : (
          <div className="space-y-4">
            {capsules.map((capsule, index) => {
              const daysUntil = getDaysUntilUnlock(capsule.unlockDate);
              const canUnlock = daysUntil <= 0 && !capsule.isUnlocked;
              
              return (
                <motion.div
                  key={capsule.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`${capsule.isUnlocked ? "border-success/30 bg-success/5" : canUnlock ? "border-accent/30 bg-accent/5" : ""}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <ApperIcon 
                          name={capsule.isUnlocked ? "Unlock" : canUnlock ? "Clock" : "Lock"} 
                          size={20} 
                          className={capsule.isUnlocked ? "text-success" : canUnlock ? "text-accent" : "text-gray-400"} 
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-700">
                            {format(new Date(capsule.unlockDate), "MMM dd, yyyy")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {capsule.isUnlocked ? "Unlocked" : 
                             canUnlock ? "Ready to unlock!" : 
                             `${daysUntil} day${daysUntil !== 1 ? "s" : ""} remaining`}
                          </div>
                        </div>
                      </div>
                      
                      <Badge 
                        variant={capsule.isUnlocked ? "success" : canUnlock ? "accent" : "default"}
                        className="text-xs"
                      >
                        {capsule.isUnlocked ? "Unlocked" : canUnlock ? "Ready" : "Locked"}
                      </Badge>
                    </div>

                    {capsule.isUnlocked ? (
                      <div className="p-4 bg-success/10 rounded-xl border border-success/20">
                        <p className="text-gray-800">{capsule.message}</p>
                      </div>
                    ) : canUnlock ? (
                      <div className="space-y-3">
                        <p className="text-gray-600 italic">
                          A message is waiting for you...
                        </p>
                        <Button
                          onClick={() => handleUnlockCapsule(capsule.Id)}
                          variant="accent"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <ApperIcon name="Unlock" size={16} />
                          <span>Unlock Message</span>
                        </Button>
                      </div>
                    ) : (
                      <p className="text-gray-600 italic">
                        This message will unlock in {daysUntil} day{daysUntil !== 1 ? "s" : ""}...
                      </p>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Capsule Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display gradient-text">Create Future Capsule</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateCapsule} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Future You
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Write a message to your future self..."
                  className="w-full h-32 p-4 border border-primary/20 rounded-xl resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unlock Date
                </label>
                <Input
                  type="date"
                  value={formData.unlockDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, unlockDate: e.target.value }))}
                  min={getMinDate()}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  Create Capsule
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FutureCapsules;