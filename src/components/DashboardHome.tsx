import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  FileCheck,
  CheckSquare,
  BookOpen,
  Award,
  ChevronRight,
  Plus,
  X,
  Target,
  Sparkles
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface DashboardHomeProps {
  user: any;
  onUpdateProfile: (bio: string, targetRole: string, completedCourses: string[], skills: string[]) => Promise<void>;
  onNavigateToTab: (tab: string) => void;
  token: string;
}

export default function DashboardHome({
  user,
  onUpdateProfile,
  onNavigateToTab,
  token
}: DashboardHomeProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [newSkill, setNewSkill] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [bio, setBio] = useState(user?.profile?.bio || "");
  const [targetRole, setTargetRole] = useState(user?.profile?.targetRole || "");
  const [completedCourses, setCompletedCourses] = useState<string[]>(user?.profile?.completedCourses || []);
  const [skills, setSkills] = useState<string[]>(user?.profile?.skills || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [user, token]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics metrics:", error);
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourse.trim() && !completedCourses.includes(newCourse.trim())) {
      setCompletedCourses([...completedCourses, newCourse.trim()]);
      setNewCourse("");
    }
  };

  const handleRemoveCourse = (course: string) => {
    setCompletedCourses(completedCourses.filter((c) => c !== course));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await onUpdateProfile(bio, targetRole, completedCourses, skills);
      fetchAnalytics();
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6" id="dashboard-home-view">
      {/* Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-[#1F2833] to-[#0B0C10] border border-[#45A29E]/30 text-white rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 scale-150">
          <Sparkles className="w-96 h-96" />
        </div>
        <div className="relative z-10">
          <span className="text-xs font-semibold uppercase tracking-wider bg-[#66FCF1]/10 text-[#66FCF1] border border-[#66FCF1]/20 px-2.5 py-1 rounded-full">
            Student Career Preparation Desk
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-2" id="welcome-banner-title">
            Keep Building, {user?.name}!
          </h2>
          <p className="text-sm text-[#C5C6C7] mt-1 max-w-xl">
            Convert your courses into solid internship placements, map your custom AI roadmap, and analyze technical skill gaps.
          </p>
        </div>
      </div>

      {/* Numerical Analytics widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        <div className="p-5 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#C5C6C7]/60 uppercase tracking-wider">Career Readiness</span>
            <span className="p-1.5 bg-emerald-950/20 text-emerald-400 border border-emerald-500/10 rounded-lg"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white" id="readiness-score-display">
              {analytics?.careerReadinessScore || 40}%
            </span>
          </div>
          <p className="text-[10px] text-[#C5C6C7]/60 mt-1">Based on course mapping & projects</p>
        </div>

        <div className="p-5 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#C5C6C7]/60 uppercase tracking-wider">Saved Internships</span>
            <span className="p-1.5 bg-[#66FCF1]/10 text-[#66FCF1] border border-[#66FCF1]/20 rounded-lg"><FileCheck className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{analytics?.internshipsSaved || 0}</span>
          </div>
          <p className="text-[10px] text-[#C5C6C7]/60 mt-1">Pending application submittals</p>
        </div>

        <div className="p-5 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#C5C6C7]/60 uppercase tracking-wider">AI Projects suggested</span>
            <span className="p-1.5 bg-blue-950/20 text-blue-400 border border-blue-500/10 rounded-lg"><CheckSquare className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{analytics?.projectsCompleted || 0}</span>
          </div>
          <p className="text-[10px] text-[#C5C6C7]/60 mt-1">Sandbox and Advanced stages</p>
        </div>

        <div className="p-5 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#C5C6C7]/60 uppercase tracking-wider">Active Core Skills</span>
            <span className="p-1.5 bg-amber-950/20 text-amber-400 border border-amber-500/10 rounded-lg"><Award className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{skills.length}</span>
          </div>
          <p className="text-[10px] text-[#C5C6C7]/60 mt-1">Verified on student resume</p>
        </div>
      </div>

      {/* Main visual charting grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts chart */}
        <div className="lg:col-span-2 p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Career Preparation Velocity</h3>
            <p className="text-xs text-[#C5C6C7]/80">Track of readiness improvements and study times weekly.</p>
          </div>
          <div className="h-64 mt-4 w-full">
            {analytics?.weeklyProgress ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.weeklyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#45A29E" strokeOpacity={0.1} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#C5C6C7" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#C5C6C7" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1F2833", borderRadius: "12px", border: "1px solid rgba(69, 162, 158, 0.3)", fontSize: "12px", color: "#FFFFFF" }} />
                  <Line type="monotone" dataKey="score" stroke="#66FCF1" strokeWidth={3} dot={{ fill: "#66FCF1", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="learningHours" stroke="#45A29E" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#C5C6C7]/50">Loading progress data...</div>
            )}
          </div>
          <div className="flex gap-4 items-center justify-center mt-3 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-[#66FCF1] rounded"></div><span className="text-[#C5C6C7]">Readiness score (%)</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-1 border-t-2 border-dashed border-[#45A29E]"></div><span className="text-[#C5C6C7]">Weekly Learning Hours</span></div>
          </div>
        </div>

        {/* Action Board */}
        <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Interactive AI Actions</h3>
            <p className="text-xs text-[#C5C6C7]/80 mb-4">Jump-start your recruitment preparations directly.</p>
          </div>
          <div className="space-y-2.5">
            <button
              onClick={() => onNavigateToTab("roadmap")}
              className="w-full flex items-center justify-between p-3.5 bg-[#0B0C10] hover:bg-[#45A29E]/10 hover:text-[#66FCF1] border border-[#45A29E]/20 hover:border-[#66FCF1]/40 rounded-xl transition-all text-xs font-semibold text-[#C5C6C7] text-left"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-[#66FCF1] shrink-0" />
                <span>Map Course-to-Career Pathway</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#45A29E]" />
            </button>

            <button
              onClick={() => onNavigateToTab("gap")}
              className="w-full flex items-center justify-between p-3.5 bg-[#0B0C10] hover:bg-[#45A29E]/10 hover:text-[#66FCF1] border border-[#45A29E]/20 hover:border-[#66FCF1]/40 rounded-xl transition-all text-xs font-semibold text-[#C5C6C7] text-left"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[#66FCF1] shrink-0" />
                <span>Execute Skills Gap Recruiter Analysis</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#45A29E]" />
            </button>

            <button
              onClick={() => onNavigateToTab("projects")}
              className="w-full flex items-center justify-between p-3.5 bg-[#0B0C10] hover:bg-[#45A29E]/10 hover:text-[#66FCF1] border border-[#45A29E]/20 hover:border-[#66FCF1]/40 rounded-xl transition-all text-xs font-semibold text-[#C5C6C7] text-left"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-[#66FCF1] shrink-0" />
                <span>Build Ported Capstone Project</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#45A29E]" />
            </button>
          </div>
          <div className="mt-4 p-3 bg-[#0B0C10] border border-[#45A29E]/20 rounded-xl text-center">
            <p className="text-[11px] text-[#66FCF1] font-medium leading-relaxed">
              💡 Tip: Generate a Skill Gap analysis first to find missing skills, then run the Project Builder.
            </p>
          </div>
        </div>
      </div>

      {/* Course & Skill input panels */}
      <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Student Profile & Skill Inventory</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Bio & Target Role */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#C5C6C7] uppercase tracking-wider mb-1">Professional Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, Data Architect"
                className="w-full px-3.5 py-2 bg-[#0B0C10] border border-[#45A29E]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/20 focus:border-[#66FCF1] text-white transition-colors placeholder-[#C5C6C7]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#C5C6C7] uppercase tracking-wider mb-1">Short Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your learning objectives and goals..."
                rows={3}
                className="w-full px-3.5 py-2 bg-[#0B0C10] border border-[#45A29E]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/20 focus:border-[#66FCF1] text-white transition-colors resize-none placeholder-[#C5C6C7]/30"
              />
            </div>
          </div>

          {/* Right: Enrolled Courses & Skills Lists */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#C5C6C7] uppercase tracking-wider mb-1.5">Completed Courses / Topic Studied</label>
              <form onSubmit={handleAddCourse} className="flex gap-2">
                <input
                  type="text"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  placeholder="Data Science, Cybersecurity..."
                  className="flex-1 px-3.5 py-2 bg-[#0B0C10] border border-[#45A29E]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/20 focus:border-[#66FCF1] text-white transition-colors placeholder-[#C5C6C7]/30"
                />
                <button type="submit" className="p-2.5 bg-[#66FCF1] hover:bg-[#45A29E] text-[#0B0C10] rounded-xl text-sm transition-colors">
                  <Plus className="w-4.5 h-4.5" />
                </button>
              </form>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {completedCourses.map((course) => (
                  <span key={course} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#45A29E]/10 text-[#66FCF1] border border-[#45A29E]/20 text-xs font-medium rounded-lg">
                    <span>{course}</span>
                    <button type="button" onClick={() => handleRemoveCourse(course)} className="hover:text-red-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#C5C6C7] uppercase tracking-wider mb-1.5">My Tech Stack Skills</label>
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="React, AWS, Python..."
                  className="flex-1 px-3.5 py-2 bg-[#0B0C10] border border-[#45A29E]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/20 focus:border-[#66FCF1] text-white transition-colors placeholder-[#C5C6C7]/30"
                />
                <button type="submit" className="p-2.5 bg-[#66FCF1] hover:bg-[#45A29E] text-[#0B0C10] rounded-xl text-sm transition-colors">
                  <Plus className="w-4.5 h-4.5" />
                </button>
              </form>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium rounded-lg">
                    <span>{skill}</span>
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#45A29E]/20 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-5 py-2.5 bg-[#66FCF1] hover:bg-[#45A29E] disabled:bg-[#45A29E]/40 text-[#0B0C10] font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
          >
            {saving ? "Saving Changes..." : "Update Student Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
