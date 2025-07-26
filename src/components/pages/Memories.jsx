import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import MemoryCard from "@/components/molecules/MemoryCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import MemoryForm from "@/components/organisms/MemoryForm";
import { memoryService } from "@/services/api/memoryService";
import { toast } from "react-toastify";

const Memories = () => {
  const [memories, setMemories] = useState([]);
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [allTags, setAllTags] = useState([]);

  const moods = [
    { id: "happy", label: "Happy", icon: "Smile" },
    { id: "sad", label: "Sad", icon: "Frown" },
    { id: "excited", label: "Excited", icon: "Zap" },
    { id: "calm", label: "Calm", icon: "Leaf" },
    { id: "grateful", label: "Grateful", icon: "Heart" },
    { id: "proud", label: "Proud", icon: "Star" }
  ];

  useEffect(() => {
    loadMemories();
  }, []);

  useEffect(() => {
    filterMemories();
  }, [memories, searchTerm, selectedTags, selectedMood]);

  const loadMemories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await memoryService.getAll();
      setMemories(data);
      
      // Extract all unique tags
      const tags = [...new Set(data.flatMap(memory => memory.tags || []))];
      setAllTags(tags);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterMemories = () => {
    let filtered = memories;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(memory =>
        memory.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (memory.tags || []).some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(memory =>
        selectedTags.every(tag => 
          (memory.tags || []).includes(tag)
        )
      );
    }

    // Filter by mood
    if (selectedMood) {
      filtered = filtered.filter(memory => memory.mood === selectedMood);
    }

    // Sort by newest first
    filtered = filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setFilteredMemories(filtered);
  };

  const handleCreateMemory = async (memoryData) => {
    try {
      await memoryService.create(memoryData);
      await loadMemories();
      setShowMemoryForm(false);
      toast.success("Memory captured successfully! 🎉");
    } catch (err) {
      toast.error("Failed to save memory");
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setSelectedMood("");
  };

  if (loading) return <Loading message="Loading your memories..." />;
  if (error) return <Error message={error} onRetry={loadMemories} />;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Memory Timeline" 
        rightAction={
          <Button
            onClick={() => setShowMemoryForm(true)}
            variant="primary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add</span>
          </Button>
        }
      />

      <div className="p-4 space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search memories..."
            className="w-full"
          />

          {/* Mood Filter */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Filter by mood:</p>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(selectedMood === mood.id ? "" : mood.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
                    selectedMood === mood.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 hover:border-primary/40 text-gray-600"
                  }`}
                >
                  <ApperIcon name={mood.icon} size={16} />
                  <span className="text-sm">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Filter by tags:</p>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "accent" : "default"}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {(searchTerm || selectedTags.length > 0 || selectedMood) && (
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ApperIcon name="X" size={16} />
              <span>Clear Filters</span>
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredMemories.length} {filteredMemories.length === 1 ? "memory" : "memories"} found
          </p>
        </div>

        {/* Memory Timeline */}
        {filteredMemories.length === 0 ? (
          <Empty
            title="No memories found"
            message={searchTerm || selectedTags.length > 0 || selectedMood 
              ? "Try adjusting your filters or search terms"
              : "Start capturing your precious moments today!"
            }
            actionLabel="Create Memory"
            onAction={() => setShowMemoryForm(true)}
            icon="BookOpen"
          />
        ) : (
          <div className="space-y-4">
            {filteredMemories.map((memory, index) => (
              <motion.div
                key={memory.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MemoryCard memory={memory} />
              </motion.div>
            ))}
          </div>
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

export default Memories;