import {
  LayoutDashboard,
  TrendingUp,
  Award,
  Briefcase,
  Terminal,
  FolderCode,
  MessageSquare,
  ShieldCheck
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isAdmin: boolean;
}

export default function Sidebar({ currentTab, onSelectTab, isAdmin }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", name: "Analytics Desk", icon: LayoutDashboard },
    { id: "roadmap", name: "Career Roadmap", icon: TrendingUp },
    { id: "gap", name: "Skill Gap Analyzer", icon: Award },
    { id: "internships", name: "Internship Finder", icon: Briefcase },
    { id: "projects", name: "AI Project Builder", icon: Terminal },
    { id: "portfolio", name: "Portfolio & Resume", icon: FolderCode },
    { id: "chatbot", name: "AI Career Chat", icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-[#1F2833] border-r border-[#45A29E]/20 flex flex-col shrink-0" id="main-sidebar">
      {/* Target Role Indicator */}
      <div className="p-4 border-b border-[#45A29E]/20 bg-[#0B0C10]/40">
        <div className="text-[10px] font-bold text-[#66FCF1] uppercase tracking-widest mb-1">
          Active Student Tracker
        </div>
        <div className="text-xs font-semibold text-[#C5C6C7]">
          Tracking career preparation pathways in real-time.
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all focus:outline-none ${
                isActive
                  ? "bg-[#0B0C10] text-[#66FCF1] border-l-2 border-[#66FCF1] shadow-sm shadow-[#66FCF1]/10 font-semibold"
                  : "text-[#C5C6C7] hover:text-[#66FCF1] hover:bg-[#0B0C10]/20"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#66FCF1]" : "text-[#45A29E]"}`} />
              <span>{item.name}</span>
            </button>
          );
        })}

        {/* Admin toggle visual portal */}
        {isAdmin && (
          <button
            onClick={() => onSelectTab("admin")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all focus:outline-none border border-dashed ${
              currentTab === "admin"
                ? "bg-amber-500 text-[#0B0C10] border-amber-500 font-bold shadow-md"
                : "text-amber-400 border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/40"
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Admin Console</span>
          </button>
        )}
      </nav>

      {/* Footer Branding */}
      <div className="p-4 border-t border-[#45A29E]/20 text-center">
        <p className="text-[10px] text-[#45A29E] font-medium">Powered by Gemini &bull; AI Navigator</p>
      </div>
    </aside>
  );
}
