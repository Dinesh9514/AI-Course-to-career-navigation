import { useState } from "react";
import { Sparkles, ShieldAlert, Terminal, Clock, Award, HelpCircle, Code, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { ProjectSuggestion } from "../types";

interface ProjectGeneratorTabProps {
  user: any;
  token: string;
}

export default function ProjectGeneratorTab({ user, token }: ProjectGeneratorTabProps) {
  const [courseName, setCourseName] = useState(user?.profile?.completedCourses?.[0] || "");
  const [projects, setProjects] = useState<ProjectSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reassuringMsg, setReassuringMsg] = useState("");
  const [expandedProj, setExpandedProj] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const LOADING_MESSAGES = [
    "Spinning up senior product engineer services...",
    "Drafting functional system architectures...",
    "Compiling GitHub repository folder schemas...",
    "Simulating standard tech interview question pipelines..."
  ];

  const handleGenerate = async () => {
    if (!courseName.trim()) {
      setError("Please input or choose a course topic.");
      return;
    }

    setError("");
    setLoading(true);
    setProjects([]);
    setReassuringMsg(LOADING_MESSAGES[0]);

    // Interval
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setReassuringMsg(LOADING_MESSAGES[msgIndex]);
    }, 2500);

    try {
      const res = await fetch("/api/generate-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          courseName,
          currentSkills: user?.profile?.skills || []
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate projects");
      setProjects(data);
      if (data.length > 0) {
        setExpandedProj(data[0].id || "proj-beg");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during project building.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleCopyStructure = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-emerald-950/20 text-emerald-400 border-emerald-500/20";
      case "Intermediate":
        return "bg-[#66FCF1]/10 text-[#66FCF1] border-[#66FCF1]/20";
      default:
        return "bg-fuchsia-950/20 text-fuchsia-400 border-fuchsia-500/20";
    }
  };

  return (
    <div className="space-y-6" id="project-generator-tab-view">
      <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#66FCF1]" />
          AI Portfolio Project Generator
        </h3>
        <p className="text-xs text-[#C5C6C7]/80 mt-1 max-w-2xl">
          Create highly vetted, recruiter-appealing software portfolio projects tailored exactly to your active course context. We formulate a structured development guide spanning Beginner, Intermediate, and Advanced stages.
        </p>

        {error && (
          <div className="flex items-center gap-2 p-3 mt-4 rounded-lg bg-red-950/20 text-red-400 text-sm border border-red-500/20">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            id="proj-course-input"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="e.g. Data Science, Machine Learning, Web Development"
            className="flex-1 px-4 py-3 bg-[#0B0C10] border border-[#45A29E]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/20 focus:border-[#66FCF1] text-white transition-colors placeholder-[#C5C6C7]/30"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            id="proj-generate-btn"
            className="px-6 py-3 bg-[#66FCF1] hover:bg-[#45A29E] disabled:bg-[#45A29E]/40 text-[#0B0C10] font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Designing Projects..." : "Generate Capstone Projects"}</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-12 text-center bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm space-y-4 animate-fade-in" id="projects-loading-panel">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#0B0C10] border-t-[#66FCF1] rounded-full animate-spin"></div>
            <Terminal className="absolute w-6 h-6 text-[#66FCF1] animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Formulating Architecture Specifications</h4>
            <p className="text-xs text-[#66FCF1] font-medium mt-1 animate-pulse">{reassuringMsg}</p>
          </div>
        </div>
      )}

      {/* Projects output */}
      {projects.length > 0 && (
        <div className="space-y-4 animate-fade-in" id="projects-list-panel">
          {projects.map((proj) => {
            const isExpanded = expandedProj === proj.id;
            return (
              <div
                key={proj.id}
                className={`border bg-[#1F2833] rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${
                  isExpanded ? "border-[#66FCF1]/30 ring-2 ring-[#66FCF1]/5" : "border-[#45A29E]/20"
                }`}
              >
                {/* Header panel trigger */}
                <button
                  onClick={() => setExpandedProj(isExpanded ? null : proj.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-[#0B0C10]/40 text-left focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getLevelBadgeColor(proj.level)}`}>
                      {proj.level}
                    </span>
                    <h4 className="text-sm font-bold text-white tracking-tight">{proj.title}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#C5C6C7]/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C5C6C7]/40" />
                      <span>{proj.estimatedTime}</span>
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Collapsible body */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-[#45A29E]/10 space-y-6 text-xs text-[#C5C6C7] leading-relaxed">
                    {/* Quick Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-wider block mb-0.5">Project Description</span>
                          <p className="text-white font-medium">{proj.description}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-wider block mb-0.5">Core Problem Statement</span>
                          <p className="text-[#C5C6C7]/80">{proj.problemStatement}</p>
                        </div>
                      </div>

                      {/* Technical specifications */}
                      <div className="space-y-3 bg-[#0B0C10] p-4 rounded-xl border border-[#45A29E]/20">
                        <div>
                          <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-wider block mb-1">Recommended Tech Stack</span>
                          <div className="flex flex-wrap gap-1">
                            {proj.technologies?.map((t) => (
                              <span key={t} className="px-2 py-0.5 bg-[#1F2833] border border-[#45A29E]/20 text-[#66FCF1] font-semibold rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        {proj.dataset && (
                          <div>
                            <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-wider block mb-0.5">Dataset recommendation</span>
                            <span className="font-semibold text-white">{proj.dataset}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Objectives & Architecture */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#45A29E]/10">
                      <div>
                        <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-wider block mb-2">Technical Objectives</span>
                        <ul className="space-y-1.5 list-disc list-inside text-[#C5C6C7]/80">
                          {proj.objectives?.map((obj, oidx) => (
                            <li key={oidx}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-wider block mb-1">Architectural Outline</span>
                        <p className="text-[#C5C6C7]/80">{proj.architecture}</p>
                      </div>
                    </div>

                    {/* Modules & GitHub layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#45A29E]/10">
                      {/* Sub-modules list */}
                      <div>
                        <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-wider block mb-2">Modular Sub-systems</span>
                        <div className="space-y-2">
                          {proj.modules?.map((mod, midx) => (
                            <div key={midx} className="p-2.5 bg-[#0B0C10]/60 border border-[#45A29E]/10 rounded-lg">
                              <span className="font-bold text-white block">{mod.name}</span>
                              <p className="text-[#C5C6C7]/80 mt-0.5 leading-normal">{mod.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Folder Tree code block */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-wider block">GitHub Repository Schema</span>
                          <button
                            onClick={() => handleCopyStructure(proj.id, proj.githubFolderStructure)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#66FCF1] hover:text-[#45A29E] cursor-pointer"
                          >
                            {copiedId === proj.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === proj.id ? "Copied" : "Copy layout"}</span>
                          </button>
                        </div>
                        <pre className="p-3 bg-[#0B0C10] text-[#66FCF1] font-mono rounded-xl border border-[#45A29E]/20 text-[11px] overflow-x-auto leading-relaxed max-h-56">
                          {proj.githubFolderStructure}
                        </pre>
                      </div>
                    </div>

                    {/* Interview Prep section */}
                    <div className="pt-4 border-t border-[#45A29E]/10 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#45A29E]/5 p-4 rounded-xl border border-[#45A29E]/20">
                      <div>
                        <span className="text-[10px] font-bold text-[#66FCF1] uppercase tracking-wider block mb-1">Resume Impact Statement</span>
                        <p className="text-white font-medium leading-relaxed">
                          🥇 {proj.resumeValue}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#66FCF1] uppercase tracking-wider block mb-2">Suggested Interview Prep Questions</span>
                        <ul className="space-y-1.5 list-disc list-inside text-[#C5C6C7] font-medium leading-relaxed">
                          {proj.interviewQuestions?.map((q, qidx) => (
                            <li key={qidx}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
