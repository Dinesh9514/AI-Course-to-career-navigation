import { useState } from "react";
import { Bell, LogOut, Sparkles, User, Calendar, Check } from "lucide-react";
import { AppNotification } from "../types";

interface NavbarProps {
  user: any;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onLogout: () => void;
  onNavigateToTab: (tab: string) => void;
}

export default function Navbar({
  user,
  notifications,
  onMarkNotificationRead,
  onLogout,
  onNavigateToTab
}: NavbarProps) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-[#1F2833] border-b border-[#45A29E]/20 shadow-lg" id="main-header">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#66FCF1] text-[#0B0C10] shadow-md shadow-[#66FCF1]/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight" id="logo-text">Course-to-Career</h1>
          <span className="text-[10px] font-medium text-[#66FCF1] bg-[#45A29E]/20 px-1.5 py-0.5 rounded uppercase tracking-wider">AI Platform</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Real-time indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0C10] border border-[#45A29E]/20 rounded-lg text-xs text-[#C5C6C7] font-mono">
          <Calendar className="w-3.5 h-3.5 text-[#45A29E]" />
          <span>UTC: 2026-06-28</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            id="notif-bell-btn"
            className="relative p-2 text-[#C5C6C7] hover:text-[#66FCF1] bg-[#0B0C10] hover:bg-[#1F2833] border border-[#45A29E]/20 rounded-xl transition-colors focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span id="notif-badge" className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-[10px] font-bold text-white bg-red-500 border-2 border-[#1F2833] rounded-full animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div
              id="notif-dropdown-panel"
              className="absolute right-0 mt-2 w-80 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#45A29E]/10 bg-[#0B0C10]/50">
                <span className="text-xs font-bold text-white">Recent System Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-semibold text-[#66FCF1] bg-[#45A29E]/20 px-2 py-0.5 rounded-full">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#45A29E]/10">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#C5C6C7]/50">No recent alerts.</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 text-xs transition-colors ${notif.isRead ? "bg-[#1F2833]" : "bg-[#0B0C10]/40"}`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className={`font-semibold ${notif.isRead ? "text-[#C5C6C7]" : "text-[#66FCF1]"}`}>
                          {notif.title}
                        </span>
                        {!notif.isRead && (
                          <button
                            onClick={() => {
                              onMarkNotificationRead(notif.id);
                              setShowNotifDropdown(false);
                            }}
                            title="Mark as read"
                            className="p-0.5 text-[#66FCF1] hover:bg-[#45A29E]/20 rounded cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-[#C5C6C7]/80 leading-relaxed mb-1.5">{notif.message}</p>
                      <div className="flex items-center justify-between text-[10px] text-[#45A29E]">
                        <span>{new Date(notif.date).toLocaleDateString()}</span>
                        {notif.link && (
                          <button
                            onClick={() => {
                              setShowNotifDropdown(false);
                              onMarkNotificationRead(notif.id);
                              if (notif.link === "#internships") onNavigateToTab("internships");
                              if (notif.link === "#certifications") onNavigateToTab("roadmap");
                              if (notif.link === "#hackathons") onNavigateToTab("dashboard");
                            }}
                            className="text-[#66FCF1] font-medium hover:underline cursor-pointer"
                          >
                            Explore &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account Info */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#45A29E]/20">
          <div className="w-9 h-9 rounded-xl bg-[#0B0C10] border border-[#45A29E]/20 flex items-center justify-center text-[#66FCF1] shadow-sm">
            <User className="w-4.5 h-4.5" />
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-white">{user?.name}</div>
            <div className="text-[10px] font-medium text-[#C5C6C7]">{user?.email}</div>
          </div>
          <button
            onClick={onLogout}
            id="logout-btn"
            title="Log out of system"
            className="p-2 text-[#C5C6C7] hover:text-red-400 bg-[#0B0C10] hover:bg-red-950/20 hover:border-red-500/30 border border-[#45A29E]/20 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
