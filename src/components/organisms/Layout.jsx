import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import { memoryService } from "@/services/api/memoryService";
import { chatService } from "@/services/api/chatService";

const Layout = () => {
  const [memoriesCount, setMemoriesCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const memories = await memoryService.getAll();
        const chats = await chatService.getAll();
        setMemoriesCount(memories.length);
        setChatCount(chats.length);
      } catch (error) {
        console.error("Error loading counts:", error);
      }
    };

    loadCounts();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="h-full">
        <Outlet />
      </main>
      <BottomNavigation 
        memoriesCount={memoriesCount} 
        chatCount={chatCount} 
      />
    </div>
  );
};

export default Layout;