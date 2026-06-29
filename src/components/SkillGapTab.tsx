import { useState } from "react";
import { Sparkles, ShieldAlert, Award, ExternalLink, ArrowRight, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import { SkillGapAnalysis, SkillGapItem } from "../types";

interface SkillGapTabProps {
  user: any;
  token: string;
  onNavigateToTab: (tab: string) => void;
}

export default function SkillGapTab({ user, token, onNavigateToTab }: SkillGapTabProps) {
  const [courseName, setCourseName] = useState(user?.profile?.completedCourses?.[0] || "");
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reassuringMsg, setReassuringMsg] = useState("");

  const LOADING_MESSAGES = [
    "Compiling your technical profile metrics...",
    "Crawling industrial recruitment prerequisites...",
    "Conducting differential gap calculation algorithms...",
    "Synthesizing high-yield course suggestions..."
  ];

  const handleAnalyze = async () => {
    if (!courseName.trim()) {
      setError("Please input or choose a course context.");
      return;
    }

    setError("");
    setLoading(true);
    setAnalysis(null);
    setReassuringMsg(LOADING_MESSAGES[0]);

    // Interval
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setReassuringMsg(LOADING_MESSAGES[msgIndex]);
    }, 2500);

    try {
      const res = await fetch("/api/skill-gap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          courseName,
          userSkills: user?.profile?.skills || []
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze skills");
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during Recruiter analysis.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const getPriorityColor = (prio: string) => {
    switch (prio) {
      case "High":
        return "bg-red-950/20 text-red-400 border-red-500/20";
      case "Medium":
        return "bg-amber-950/20 text-amber-400 border-amber-500/20";
      default:
        return "bg-blue-950/20 text-blue-400 border-blue-500/20";
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Beginner":
        return "bg-emerald-950/20 text-emerald-400 border-emerald-500/20";
      case "Intermediate":
        return "bg-[#66FCF1]/10 text-[#66FCF1] border-[#66FCF1]/20";
      default:
        return "bg-fuchsia-950/20 text-fuchsia-400 border-fuchsia-500/20";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-950/20 border-emerald-500/20";
    if (score >= 45) return "text-amber-400 bg-amber-950/20 border-amber-500/20";
    return "text-red-400 bg-red-950/20 border-red-500/20";
  };

  return (
    <div className="space-y-6" id="skill-gap-tab-view">
      <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Award className="w-5 h-5 text-[#66FCF1]" />
          AI Recruiter Skill Gap Analyzer
        </h3>
        <p className="text-xs text-[#C5C6C7]/80 mt-1 max-w-2xl">
          Evaluate the gap between your course competencies, current verified resume profile skills, and real-time enterprise recruiter standards. We calculate your exact readiness and output tailored study roadmaps.
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
            id="gap-course-input"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="e.g. Web Development, Data Science, Cybersecurity"
            className="flex-1 px-4 py-3 bg-[#0B0C10] border border-[#45A29E]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/20 focus:border-[#66FCF1] text-white transition-colors placeholder-[#C5C6C7]/30"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            id="gap-analyze-btn"
            className="px-6 py-3 bg-[#66FCF1] hover:bg-[#45A29E] disabled:bg-[#45A29E]/40 text-[#0B0C10] font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Analyzing Skills..." : "Analyze Tech Skill Gap"}</span>
          </button>
        </div>

        {/* Current Student profile checklist */}
        <div className="mt-4 p-4 bg-[#0B0C10] border border-[#45A29E]/20 rounded-xl flex flex-wrap gap-4 items-center justify-between text-xs text-[#C5C6C7]/80">
          <div>
            <span className="font-bold text-white uppercase tracking-wide block mb-0.5">Verified Profile Skills:</span>
            <span>{user?.profile?.skills?.join(", ") || "No custom stack skills updated. Click 'Update Student Profile' inside Analytics Desk to add some!"}</span>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-12 text-center bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm space-y-4 animate-fade-in" id="gap-loading-panel">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#0B0C10] border-t-[#66FCF1] rounded-full animate-spin"></div>
            <Award className="absolute w-6 h-6 text-[#66FCF1] animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Measuring Career Gaps</h4>
            <p className="text-xs text-[#66FCF1] font-medium mt-1 animate-pulse">{reassuringMsg}</p>
          </div>
        </div>
      )}

      {/* Results view */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="gap-results-panel">
          {/* Left Column: Summary & Readiness Score */}
          <div className="space-y-6">
            <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm text-center">
              <span className="text-xs font-bold text-[#C5C6C7]/60 uppercase tracking-widest block mb-1">Recruiter Evaluation</span>
              <h4 className="text-sm font-bold text-white mb-4">Industrial Career Readiness</h4>

              <div className="relative inline-flex items-center justify-center w-36 h-36 mb-4">
                {/* Visual circle outline */}
                <div className="absolute inset-0 rounded-full border-8 border-[#0B0C10]"></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-[#66FCF1] border-t-transparent border-r-transparent rotate-45"
                  style={{ transform: `rotate(${Math.round((analysis.careerReadinessScore / 100) * 360 - 135)}deg)` }}
                ></div>
                <div className="relative flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white">{analysis.careerReadinessScore}%</span>
                  <span className="text-[10px] font-bold text-[#C5C6C7]/60 uppercase">Score</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border text-xs font-bold ${getScoreColor(analysis.careerReadinessScore)}`}>
                {analysis.careerReadinessScore >= 80 && "🥇 HIGH PREPAREDNESS"}
                {analysis.careerReadinessScore >= 45 && analysis.careerReadinessScore < 80 && "🥈 MODERATE PREPAREDNESS"}
                {analysis.careerReadinessScore < 45 && "🥉 ENTRY PATHWAY INITIATED"}
              </div>

              <p className="text-[11px] text-[#C5C6C7]/80 mt-3 leading-relaxed">
                Matches current verified profile skills vs. targets in {courseName}.
              </p>
            </div>

            {/* Target skills lists */}
            <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Skill Map Context</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#C5C6C7]/60 font-medium block mb-1">Standard Course Syllabus:</span>
                  <div className="flex flex-wrap gap-1">
                    {analysis.courseSkills?.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-[#0B0C10] border border-[#45A29E]/15 rounded text-[10px] font-semibold text-[#C5C6C7]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[#C5C6C7]/60 font-medium block mb-1">Enterprise Hiring Criteria:</span>
                  <div className="flex flex-wrap gap-1">
                    {analysis.internshipSkills?.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-[#45A29E]/10 border border-[#45A29E]/30 rounded text-[10px] font-semibold text-[#66FCF1]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Missing Skills & Learning Roadmaps */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Identified Missing Industrial Skills ({analysis.missingSkills?.length || 0})</h4>
              <button
                onClick={() => onNavigateToTab("projects")}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#66FCF1] hover:text-[#45A29E] hover:underline cursor-pointer"
              >
                <span>Generate matching projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {analysis.missingSkills?.map((item, idx) => (
                <div key={item.skill || idx} className="p-5 bg-[#0B0C10]/40 border border-[#45A29E]/20 hover:border-[#66FCF1]/30 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h5 className="text-sm font-bold text-white">{item.skill}</h5>
                    <div className="flex gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                      <span className={`px-2 py-0.5 border rounded-lg ${getPriorityColor(item.priority)}`}>
                        Priority: {item.priority}
                      </span>
                      <span className={`px-2 py-0.5 border rounded-lg ${getDifficultyColor(item.difficulty)}`}>
                        {item.difficulty}
                      </span>
                      {item.estimatedTime && (
                        <span className="px-2 py-0.5 bg-[#0B0C10] border border-[#45A29E]/10 text-[#C5C6C7] rounded-lg">
                          ⏱️ {item.estimatedTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Roadmap steps */}
                  {item.learningRoadmap && (
                    <div className="mb-4 bg-[#1F2833]/40 p-3.5 rounded-xl border border-[#45A29E]/15">
                      <span className="text-[10px] font-bold text-[#C5C6C7]/60 uppercase tracking-wider block mb-2">Step-by-step learning guide:</span>
                      <ul className="space-y-1.5">
                        {item.learningRoadmap.map((step, sidx) => (
                          <li key={sidx} className="flex items-start gap-2 text-xs text-[#C5C6C7] leading-relaxed">
                            <span className="inline-flex items-center justify-center w-4 h-4 bg-[#66FCF1]/10 text-[10px] font-bold text-[#66FCF1] rounded-full shrink-0 mt-0.5">
                              {sidx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Certified external resources */}
                  {item.resources && item.resources.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#45A29E]/10 text-[10px] font-bold">
                      <span className="text-[#C5C6C7]/60 uppercase tracking-wider">High-quality study resources:</span>
                      {item.resources.map((res, ridx) => (
                        <a
                          key={ridx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#66FCF1] hover:text-[#45A29E] hover:underline"
                        >
                          <span className="text-[9px] font-semibold text-[#66FCF1] uppercase tracking-wider bg-[#45A29E]/10 border border-[#45A29E]/30 px-1 rounded">
                            {res.platform}
                          </span>
                          <span>{res.name}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
