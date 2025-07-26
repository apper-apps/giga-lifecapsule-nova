import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const MemoryForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    text: "",
    mood: "",
    tags: []
  });
  const [tagInput, setTagInput] = useState("");

  const moods = [
    { id: "happy", label: "Happy", icon: "Smile", color: "text-yellow-500" },
    { id: "sad", label: "Sad", icon: "Frown", color: "text-blue-500" },
    { id: "excited", label: "Excited", icon: "Zap", color: "text-purple-500" },
    { id: "calm", label: "Calm", icon: "Leaf", color: "text-green-500" },
    { id: "grateful", label: "Grateful", icon: "Heart", color: "text-pink-500" },
    { id: "proud", label: "Proud", icon: "Star", color: "text-orange-500" }
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) {
      toast.error("Please write your memory!");
      return;
    }

    onSubmit({
      text: formData.text.trim(),
      mood: formData.mood,
      tags: formData.tags,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-surface rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display gradient-text">Capture Memory</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ApperIcon name="X" size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What happened today?
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Share your thoughts and feelings..."
              className="w-full h-32 p-4 border border-primary/20 rounded-xl resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How are you feeling?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    mood: prev.mood === mood.id ? "" : mood.id 
                  }))}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${
                    formData.mood === mood.id
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-primary/40"
                  }`}
                >
                  <ApperIcon name={mood.icon} size={20} className={mood.color} />
                  <span className="text-xs mt-1">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-3">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="secondary"
                size="sm"
                className="px-4"
              >
                Add
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="default"
                    className="cursor-pointer hover:bg-primary/20 flex items-center space-x-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <span>{tag}</span>
                    <ApperIcon name="X" size={12} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Save Memory
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default MemoryForm;