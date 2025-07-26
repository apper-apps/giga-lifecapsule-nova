import NavigationItem from "@/components/molecules/NavigationItem";

const BottomNavigation = ({ chatCount, memoriesCount }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-primary/10 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <NavigationItem to="/" icon="Home" label="Home" />
        <NavigationItem to="/memories" icon="BookOpen" label="Memories" badge={memoriesCount} />
        <NavigationItem to="/chat" icon="MessageCircle" label="AI Chat" badge={chatCount} />
        <NavigationItem to="/capsules" icon="Clock" label="Capsules" />
        <NavigationItem to="/profile" icon="User" label="Profile" />
      </div>
    </div>
  );
};

export default BottomNavigation;