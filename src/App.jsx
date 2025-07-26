import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Home from "@/components/pages/Home";
import Memories from "@/components/pages/Memories";
import AIChat from "@/components/pages/AIChat";
import FutureCapsules from "@/components/pages/FutureCapsules";
import Profile from "@/components/pages/Profile";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="memories" element={<Memories />} />
            <Route path="chat" element={<AIChat />} />
            <Route path="capsules" element={<FutureCapsules />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="!rounded-xl !shadow-xl"
        />
      </div>
    </Router>
  );
}

export default App;