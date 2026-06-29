import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, ShieldCheck } from "lucide-react";
import AuthCard from "./components/AuthCard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DashboardHome from "./components/DashboardHome";
import RoadmapTab from "./components/RoadmapTab";
import SkillGapTab from "./components/SkillGapTab";
import InternshipFinderTab from "./components/InternshipFinderTab";
import ProjectGeneratorTab from "./components/ProjectGeneratorTab";
import PortfolioBuilderTab from "./components/PortfolioBuilderTab";
import ChatbotTab from "./components/ChatbotTab";
import AdminPanelTab from "./components/AdminPanelTab";
import { AppNotification } from "./types";

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("navigator_token"));
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [loadingUser, setLoadingUser] = useState(false);

  // Authenticate user profile on mount / token change
  useEffect(() => {
    if (token) {
      localStorage.setItem("navigator_token", token);
      fetchProfile();
      fetchNotifications();
    } else {
      localStorage.removeItem("navigator_token");
      setUser(null);
    }
  }, [token]);

  const fetchProfile = async () => {
    setLoadingUser(true);
    try {
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      } else {
        // Token stale
        setToken(null);
      }
    } catch (err) {
      console.error("Failed to authenticate session", err);
      setToken(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Failed to load alerts list", err);
    }
  };

  const handleUpdateProfile = async (bio: string, targetRole: string, completedCourses: string[], skills: string[]) => {
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bio, targetRole, completedCourses, skills })
      });
      const data = await res.json();
      if (res.ok) {
        setUser((prev: any) => ({ ...prev, profile: data.profile }));
      }
    } catch (error) {
      console.error("Failed to save student metrics", error);
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      const res = await fetch("/api/notifications/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notifId: id })
      });
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to update notification read status", error);
    }
  };

  const handleLoginSuccess = (token: string, userData: any) => {
    setUser(userData);
    setToken(token);
    setCurrentTab("dashboard");
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setCurrentTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] flex flex-col font-sans text-[#C5C6C7]" id="navigator-root-container">
      {!token ? (
        // Login/Signup Auth Screen
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0B0C10]">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#66FCF1] text-[#0B0C10] shadow-xl shadow-[#66FCF1]/10">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-4">AI Course-to-Career Navigator</h1>
            <p className="text-sm text-[#C5C6C7]/80 mt-1 max-w-sm">
              Convert your learning course paths into actionable professional career timelines, skill gap assessments, and verified portfolios.
            </p>
          </div>
          <AuthCard onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : loadingUser ? (
        // Profile Loader Screen
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0B0C10] space-y-4">
          <div className="w-12 h-12 border-4 border-[#1F2833] border-t-[#66FCF1] rounded-full animate-spin"></div>
          <p className="text-xs text-[#C5C6C7] font-medium animate-pulse">Validating active student profile...</p>
        </div>
      ) : (
        // Dashboard Main Application Frames
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Navbar */}
          <Navbar
            user={user}
            notifications={notifications}
            onMarkNotificationRead={handleMarkNotificationRead}
            onLogout={handleLogout}
            onNavigateToTab={setCurrentTab}
          />

          {/* Core Body: Sidebar + Main Content Viewport */}
          <div className="flex-1 flex overflow-hidden">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              isAdmin={user?.email === "demo@navigator.ai"}
            />

            <main className="flex-1 overflow-y-auto p-8 bg-[#0B0C10]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="max-w-6xl mx-auto h-full"
                >
                  {currentTab === "dashboard" && (
                    <DashboardHome
                      user={user}
                      onUpdateProfile={handleUpdateProfile}
                      onNavigateToTab={setCurrentTab}
                      token={token}
                    />
                  )}

                  {currentTab === "roadmap" && (
                    <RoadmapTab
                      token={token}
                      onNavigateToTab={setCurrentTab}
                    />
                  )}

                  {currentTab === "gap" && (
                    <SkillGapTab
                      user={user}
                      token={token}
                      onNavigateToTab={setCurrentTab}
                    />
                  )}

                  {currentTab === "internships" && (
                    <InternshipFinderTab
                      token={token}
                    />
                  )}

                  {currentTab === "projects" && (
                    <ProjectGeneratorTab
                      user={user}
                      token={token}
                    />
                  )}

                  {currentTab === "portfolio" && (
                    <PortfolioBuilderTab
                      user={user}
                      token={token}
                    />
                  )}

                  {currentTab === "chatbot" && (
                    <ChatbotTab
                      token={token}
                    />
                  )}

                  {currentTab === "admin" && (
                    <AdminPanelTab
                      token={token}
                      onBroadcastSuccess={fetchNotifications}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
