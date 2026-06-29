import { useState } from "react";
import { Sparkles, ArrowRight, ShieldAlert, BookOpen, ExternalLink, GraduationCap, Code, Briefcase, Award, Zap } from "lucide-react";
import { CareerRoadmap, CareerRoadmapItem } from "../types";

interface RoadmapTabProps {
  token: string;
  onNavigateToTab: (tab: string) => void;
}

export default function RoadmapTab({ token, onNavigateToTab }: RoadmapTabProps) {
  const [courseName, setCourseName] = useState("");
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reassuringMsg, setReassuringMsg] = useState("");

  const LOADING_MESSAGES = [
    "Contacting Gemini AI Recruiter Service...",
    "Analyzing global technical job roles and matching skills...",
    "Structuring step-by-step academic certification targets...",
    "Mapping future industry growth curves...",
    "Assembling your custom Career Path Roadmap..."
  ];

  const handleGenerate = async (selectedCourse?: string) => {
    const targetCourse = selectedCourse || courseName;
    if (!targetCourse.trim()) {
      setError("Please specify or choose a course.");
      return;
    }

    setError("");
    setLoading(true);
    setRoadmap(null);
    setReassuringMsg(LOADING_MESSAGES[0]);

    // Interval to change reassuring messages
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setReassuringMsg(LOADING_MESSAGES[msgIndex]);
    }, 2500);

    try {
      const res = await fetch("/api/career-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ courseName: targetCourse })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate roadmap");
      setRoadmap(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during AI mapping.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "Course":
        return <GraduationCap className="w-5 h-5 text-indigo-400" />;
      case "Project":
        return <Code className="w-5 h-5 text-emerald-400" />;
      case "Certification":
        return <Award className="w-5 h-5 text-amber-400" />;
      case "Internship":
      case "Job Role":
        return <Briefcase className="w-5 h-5 text-blue-400" />;
      default:
        return <Zap className="w-5 h-5 text-[#66FCF1]" />;
    }
  };

  const getStepColorClass = (type: string) => {
    switch (type) {
      case "Course":
        return "border-indigo-500/20 bg-indigo-950/20 text-indigo-300";
      case "Project":
        return "border-emerald-500/20 bg-emerald-950/20 text-emerald-300";
      case "Certification":
        return "border-amber-500/20 bg-amber-950/20 text-amber-300";
      case "Internship":
      case "Job Role":
        return "border-blue-500/20 bg-blue-950/20 text-blue-300";
      default:
        return "border-[#66FCF1]/20 bg-[#66FCF1]/10 text-[#66FCF1]";
    }
  };

  return (
    <div className="space-y-6" id="career-roadmap-tab-view">
      <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#66FCF1]" />
          Map Your Course-to-Career Pathway
        </h3>
        <p className="text-xs text-[#C5C6C7]/80 mt-1 max-w-2xl">
          Enter your current or targeted course name below (e.g. Data Science, Web Development, Cybersecurity, Machine Learning). Our Gemini AI engine will map out a custom step-by-step professional timeline matching your goals.
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
            id="roadmap-course-input"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Type your study topic, e.g. Cybersecurity, Web Development"
            className="flex-1 px-4 py-3 bg-[#0B0C10] border border-[#45A29E]/20 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/20 focus:border-[#66FCF1] transition-colors placeholder-[#C5C6C7]/30"
          />
          <button
            onClick={() => handleGenerate()}
            disabled={loading}
            id="roadmap-generate-btn"
            className="px-6 py-3 bg-[#66FCF1] hover:bg-[#45A29E] disabled:bg-[#45A29E]/40 text-[#0B0C10] font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Mapping Pathway..." : "Generate AI Career Roadmap"}</span>
          </button>
        </div>

        {/* Suggested presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#C5C6C7]/50 font-medium">Quick Presets:</span>
          {["Data Science", "Cybersecurity", "Web Development", "Cloud Computing", "Machine Learning"].map((p) => (
            <button
              key={p}
              onClick={() => {
                setCourseName(p);
                handleGenerate(p);
              }}
              className="px-3 py-1.5 bg-[#0B0C10] hover:bg-[#45A29E]/20 hover:text-[#66FCF1] border border-[#45A29E]/20 rounded-lg text-xs font-semibold text-[#C5C6C7] transition-all focus:outline-none cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Animation Stage */}
      {loading && (
        <div className="p-12 text-center bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm space-y-4 animate-fade-in" id="roadmap-loading-panel">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#0B0C10] border-t-[#66FCF1] rounded-full animate-spin"></div>
            <Sparkles className="absolute w-6 h-6 text-[#66FCF1] animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Consulting AI Knowledge Bases</h4>
            <p className="text-xs text-[#66FCF1] font-medium mt-1 animate-pulse">{reassuringMsg}</p>
          </div>
        </div>
      )}

      {/* Results Rendering Timeline */}
      {roadmap && (
        <div className="space-y-6" id="roadmap-results-panel">
          <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#66FCF1] uppercase tracking-widest bg-[#45A29E]/20 px-2 py-0.5 rounded">
                  Active Career Roadmap
                </span>
                <h4 className="text-xl font-extrabold text-white tracking-tight mt-1">
                  Professional Growth Timeline for: {roadmap.courseName}
                </h4>
              </div>
              <button
                onClick={() => onNavigateToTab("gap")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-xs shadow transition-all self-start md:self-center cursor-pointer"
              >
                <span>Run Skill Gap Analyzer next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Vertical Timeline Tree */}
            <div className="mt-8 relative border-l-2 border-[#45A29E]/10 ml-4 pl-8 space-y-8">
              {roadmap.roadmap?.map((step, idx) => (
                <div key={step.id || idx} className="relative group animate-fade-in">
                  {/* Circle number tag */}
                  <span className="absolute -left-[45px] top-0.5 flex items-center justify-center w-8 h-8 rounded-full bg-[#0B0C10] border-2 border-[#66FCF1] shadow-sm z-10 font-bold text-xs text-[#66FCF1] group-hover:bg-[#66FCF1] group-hover:text-[#0B0C10] transition-colors">
                    {step.step}
                  </span>

                  {/* Body card layout */}
                  <div className="p-5 bg-[#0B0C10]/40 border border-[#45A29E]/20 group-hover:border-[#66FCF1]/30 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getStepColorClass(step.type)}`}>
                          {getStepIcon(step.type)}
                          <span>{step.type}</span>
                        </span>
                        {step.duration && (
                          <span className="text-[10px] font-bold text-[#C5C6C7] uppercase tracking-wider bg-[#0B0C10] border border-[#45A29E]/10 px-2 py-0.5 rounded-lg">
                            ⏱️ {step.duration}
                          </span>
                        )}
                      </div>
                    </div>

                    <h5 className="text-sm font-bold text-white group-hover:text-[#66FCF1] transition-colors">
                      {step.title}
                    </h5>
                    <p className="text-xs text-[#C5C6C7]/80 mt-1 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Skill targets */}
                    {step.skills && step.skills.length > 0 && (
                      <div className="mt-3">
                        <span className="text-[10px] font-bold text-[#C5C6C7]/60 uppercase tracking-wider block mb-1">Target Competencies:</span>
                        <div className="flex flex-wrap gap-1">
                          {step.skills.map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-[#1F2833] text-[#C5C6C7] text-[10px] font-semibold rounded border border-[#45A29E]/10">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resources */}
                    {step.resources && step.resources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#45A29E]/10 flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-bold text-[#C5C6C7]/60 uppercase tracking-wider">Top Study Portals:</span>
                        {step.resources.map((res, ridx) => (
                          <a
                            key={ridx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#66FCF1] hover:text-[#45A29E] hover:underline"
                          >
                            <span>{res.name}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Long term growth projection */}
          <div className="p-6 bg-gradient-to-r from-[#1F2833] to-[#0B0C10] border border-[#45A29E]/20 rounded-2xl">
            <h4 className="text-xs font-bold text-[#66FCF1] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Long-Term Market Career Projection
            </h4>
            <p className="text-xs text-[#C5C6C7] leading-relaxed font-medium">
              {roadmap.careerGrowthProjection}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
