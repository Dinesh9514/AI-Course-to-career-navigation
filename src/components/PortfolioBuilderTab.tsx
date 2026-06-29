import { useState, useRef } from "react";
import { Sparkles, ShieldAlert, FolderCode, FileText, Linkedin, Github, LayoutGrid, Copy, Check, UploadCloud, FileCheck, Trash2, Lightbulb } from "lucide-react";
import { PortfolioData } from "../types";

interface PortfolioBuilderTabProps {
  user: any;
  token: string;
}

export default function PortfolioBuilderTab({ user, token }: PortfolioBuilderTabProps) {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"resume" | "linkedin" | "readme" | "web" | "suggestions">("suggestions");
  const [copiedText, setCopiedText] = useState(false);

  const [resumeFile, setResumeFile] = useState<{ name: string; size: string } | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<{ name: string; size: string } | null>(null);
  const [isDragResume, setIsDragResume] = useState(false);
  const [isDragPortfolio, setIsDragPortfolio] = useState(false);

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleResumeFile = (file: File) => {
    setResumeFile({ name: file.name, size: formatBytes(file.size) });
  };

  const handlePortfolioFile = (file: File) => {
    setPortfolioFile({ name: file.name, size: formatBytes(file.size) });
  };

  const handleSynthesize = async () => {
    setError("");
    setLoading(true);
    setPortfolio(null);

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: user?.name || "Student",
          email: user?.email || "demo@navigator.ai",
          targetRole: user?.profile?.targetRole || "Software Developer",
          skills: user?.profile?.skills || ["React", "TypeScript", "Node.js"],
          projects: ["Custom Career Roadmap builder", "Scalable Enterprise Dashboard"],
          internships: ["Associate Engineering Intern"],
          certifications: ["Google Career Certificate"]
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to synthesize portfolio assets");
      setPortfolio(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during asset compilation.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const hasAtLeastOneFile = !!resumeFile || !!portfolioFile;

  return (
    <div className="space-y-6" id="portfolio-builder-tab-view">
      <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <FolderCode className="w-5 h-5 text-[#66FCF1]" />
          AI Digital Portfolio & Resume Builder
        </h3>
        <p className="text-xs text-[#C5C6C7]/80 mt-1 max-w-2xl">
          Instantly compile and synthesize high-conversion marketing packages based on your profile skills, completed courses, and projects. We generate copy-ready Resumes, LinkedIn bio summaries, and beautiful GitHub README templates.
        </p>

        {error && (
          <div className="flex items-center gap-2 p-3 mt-4 rounded-lg bg-red-950/20 text-red-400 text-sm border border-red-500/20">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* File Upload Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resume Upload Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragResume(true);
            }}
            onDragLeave={() => setIsDragResume(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragResume(false);
              const files = e.dataTransfer.files;
              if (files && files[0]) {
                handleResumeFile(files[0]);
              }
            }}
            onClick={() => resumeInputRef.current?.click()}
            className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              resumeFile
                ? "border-emerald-500/30 bg-emerald-950/10"
                : isDragResume
                ? "border-[#66FCF1] bg-[#66FCF1]/5"
                : "border-[#45A29E]/20 hover:border-[#66FCF1]/40 bg-[#0B0C10]/40"
            }`}
          >
            <input
              type="file"
              ref={resumeInputRef}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files[0]) {
                  handleResumeFile(files[0]);
                }
              }}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
            />
            {resumeFile ? (
              <div className="space-y-2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white max-w-[200px] truncate">{resumeFile.name}</p>
                  <p className="text-[10px] text-[#C5C6C7]/60 font-mono mt-0.5">{resumeFile.size}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setResumeFile(null);
                    setPortfolio(null);
                  }}
                  className="px-2.5 py-1 text-[10px] font-bold text-red-400 hover:text-white bg-red-950/20 hover:bg-red-900/30 border border-red-500/20 rounded-lg transition-all cursor-pointer"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <div className="space-y-2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0B0C10]/60 flex items-center justify-center text-[#45A29E]">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Upload Your Resume</p>
                  <p className="text-[10px] text-[#C5C6C7]/50 mt-1 leading-relaxed max-w-[200px]">
                    Drag & drop here or <span className="text-[#66FCF1] font-semibold hover:underline">browse files</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Portfolio Upload Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragPortfolio(true);
            }}
            onDragLeave={() => setIsDragPortfolio(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragPortfolio(false);
              const files = e.dataTransfer.files;
              if (files && files[0]) {
                handlePortfolioFile(files[0]);
              }
            }}
            onClick={() => portfolioInputRef.current?.click()}
            className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              portfolioFile
                ? "border-emerald-500/30 bg-emerald-950/10"
                : isDragPortfolio
                ? "border-[#66FCF1] bg-[#66FCF1]/5"
                : "border-[#45A29E]/20 hover:border-[#66FCF1]/40 bg-[#0B0C10]/40"
            }`}
          >
            <input
              type="file"
              ref={portfolioInputRef}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files[0]) {
                  handlePortfolioFile(files[0]);
                }
              }}
              accept=".pdf,.zip,.html,.txt"
              className="hidden"
            />
            {portfolioFile ? (
              <div className="space-y-2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white max-w-[200px] truncate">{portfolioFile.name}</p>
                  <p className="text-[10px] text-[#C5C6C7]/60 font-mono mt-0.5">{portfolioFile.size}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPortfolioFile(null);
                    setPortfolio(null);
                  }}
                  className="px-2.5 py-1 text-[10px] font-bold text-red-400 hover:text-white bg-red-950/20 hover:bg-red-900/30 border border-red-500/20 rounded-lg transition-all cursor-pointer"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <div className="space-y-2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0B0C10]/60 flex items-center justify-center text-[#45A29E]">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Upload Your Portfolio / Work Samples</p>
                  <p className="text-[10px] text-[#C5C6C7]/50 mt-1 leading-relaxed max-w-[200px]">
                    Drag & drop here or <span className="text-[#66FCF1] font-semibold hover:underline">browse files</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compile Panel */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0B0C10] p-4 border border-[#45A29E]/20 rounded-xl">
          <div className="text-xs text-[#C5C6C7]/60">
            <span className="font-bold text-[#C5C6C7] block mb-0.5">Linked Student Account:</span>
            <span>Name: {user?.name || "Student"} &bull; Target Role: <span className="text-white font-semibold">{user?.profile?.targetRole || "Not specified yet"}</span></span>
          </div>
          {hasAtLeastOneFile ? (
            <button
              onClick={handleSynthesize}
              disabled={loading}
              id="portfolio-synthesize-btn"
              className="px-6 py-3 bg-[#66FCF1] hover:bg-[#45A29E] disabled:bg-[#45A29E]/40 text-[#0B0C10] font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 self-stretch sm:self-center cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Assembling Portfolios..." : "Compile Recruiter Package"}</span>
            </button>
          ) : (
            <div className="px-4 py-2 bg-[#1F2833] border border-amber-500/20 rounded-xl text-[11px] text-amber-400 font-medium">
              ⚠️ Upload a Resume or Portfolio file to activate suggestions
            </div>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-12 text-center bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm space-y-4" id="portfolio-loading-panel">
          <div className="w-10 h-10 border-4 border-[#0B0C10] border-t-[#66FCF1] rounded-full animate-spin mx-auto"></div>
          <div>
            <h4 className="text-sm font-bold text-white">Synthesizing Recruiter Artifacts</h4>
            <p className="text-xs text-[#C5C6C7]/60">Branding LinkedIn bios and writing markdown schemas...</p>
          </div>
        </div>
      )}

      {/* Result view */}
      {portfolio && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in" id="portfolio-results-panel">
          {/* Sub tab selectors on left */}
          <div className="lg:col-span-1 p-4 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm space-y-1.5 self-start">
            <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-widest block px-3 mb-2">Select Marketing Asset</span>
            
            <button
              onClick={() => setActiveSubTab("suggestions")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === "suggestions" ? "bg-[#66FCF1]/10 text-[#66FCF1] border border-[#66FCF1]/20" : "text-[#C5C6C7]/80 hover:bg-[#0B0C10]/40"
              }`}
            >
              <Lightbulb className="w-4 h-4 text-[#66FCF1] shrink-0" />
              <span>Critique & Suggestions</span>
            </button>

            <button
              onClick={() => setActiveSubTab("resume")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === "resume" ? "bg-[#66FCF1]/10 text-[#66FCF1] border border-[#66FCF1]/20" : "text-[#C5C6C7]/80 hover:bg-[#0B0C10]/40"
              }`}
            >
              <FileText className="w-4 h-4 text-[#C5C6C7]/40 shrink-0" />
              <span>Full Resume Specs</span>
            </button>

            <button
              onClick={() => setActiveSubTab("linkedin")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === "linkedin" ? "bg-[#66FCF1]/10 text-[#66FCF1] border border-[#66FCF1]/20" : "text-[#C5C6C7]/80 hover:bg-[#0B0C10]/40"
              }`}
            >
              <Linkedin className="w-4 h-4 text-[#C5C6C7]/40 shrink-0" />
              <span>LinkedIn Summary Bio</span>
            </button>

            <button
              onClick={() => setActiveSubTab("readme")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === "readme" ? "bg-[#66FCF1]/10 text-[#66FCF1] border border-[#66FCF1]/20" : "text-[#C5C6C7]/80 hover:bg-[#0B0C10]/40"
              }`}
            >
              <Github className="w-4 h-4 text-[#C5C6C7]/40 shrink-0" />
              <span>GitHub README.md</span>
            </button>

            <button
              onClick={() => setActiveSubTab("web")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === "web" ? "bg-[#66FCF1]/10 text-[#66FCF1] border border-[#66FCF1]/20" : "text-[#C5C6C7]/80 hover:bg-[#0B0C10]/40"
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-[#C5C6C7]/40 shrink-0" />
              <span>Portfolio Web copy</span>
            </button>
          </div>

          {/* Right side output display */}
          <div className="lg:col-span-3 p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm space-y-4">
            {/* AI Resume & Portfolio Critique Tab */}
            {activeSubTab === "suggestions" && (
              <div className="space-y-6">
                <div className="border-b border-[#45A29E]/15 pb-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                    AI Resume & Portfolio Critique Recommendations
                  </h4>
                  <p className="text-xs text-[#C5C6C7]/60 mt-0.5">Custom improvement checklists based on your compiled profile details and industry standards.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Resume Suggestions */}
                  <div className="p-5 bg-[#FAF8F2]/40 border border-[#45A29E]/15 rounded-2xl space-y-3">
                    <h5 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#45A29E]/10 pb-2">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      Resume Improvements Checklist
                    </h5>
                    <ul className="space-y-2.5 text-xs text-[#C5C6C7] leading-relaxed">
                      {(portfolio.suggestions?.resumeImprovements || [
                        "Include more quantifiable metrics: add percentage results, database load speed reduction thresholds, and scale data.",
                        "Add a concise professional profile summary highlighting your exact tech stack at the top of the single-page layout.",
                        "List your project details clearly showcasing technologies used and clear high-impact outcomes."
                      ]).map((item: string, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-[#66FCF1] font-bold shrink-0">&bull;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Portfolio Suggestions */}
                  <div className="p-5 bg-[#FAF8F2]/40 border border-[#45A29E]/15 rounded-2xl space-y-3">
                    <h5 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#45A29E]/10 pb-2">
                      <LayoutGrid className="w-4 h-4 text-emerald-500" />
                      Portfolio & Online Brand Upgrades
                    </h5>
                    <ul className="space-y-2.5 text-xs text-[#C5C6C7] leading-relaxed">
                      {(portfolio.suggestions?.portfolioImprovements || [
                        "Ensure your featured repositories have clean, accessible live Hosted Demo URLs in the description.",
                        "Add screenshot images or visual loop GIFs showing the interface in action inside your GitHub README.",
                        "Provide a structured 'Challenges & Technical Solves' section to explain complex engineering decisions."
                      ]).map((item: string, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-[#66FCF1] font-bold shrink-0">&bull;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* DOs and DONTs Split Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* DOs Column */}
                  <div className="p-5 bg-emerald-50/20 border border-emerald-500/15 rounded-2xl space-y-3">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-500/10 pb-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Best Practices (DOs)
                    </h5>
                    <ul className="space-y-2.5 text-xs text-[#C5C6C7] leading-relaxed">
                      {(portfolio.suggestions?.dos || [
                        "Lead with active outcome verbs like 'Engineered', 'Architected', or 'Optimized'.",
                        "Limit your resume page count strictly to 1 page for entry-level and intermediate roles.",
                        "Link verified credentials and certificates to bolster proof of qualifications."
                      ]).map((item: string, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-emerald-500 font-bold shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* DONTs Column */}
                  <div className="p-5 bg-rose-50/20 border border-rose-500/15 rounded-2xl space-y-3">
                    <h5 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-rose-500/10 pb-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      Common Pitfalls (DONTs)
                    </h5>
                    <ul className="space-y-2.5 text-xs text-[#C5C6C7] leading-relaxed">
                      {(portfolio.suggestions?.donts || [
                        "Avoid including subjective skill rating bar meters or percentages (e.g., 'React: 80%').",
                        "Do not dump generic course syllabus summaries or basic school homework details as projects.",
                        "Do not omit setup installation guidelines and clear API keys warnings from README files."
                      ]).map((item: string, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-rose-500 font-bold shrink-0">✗</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Resume Tab */}
            {activeSubTab === "resume" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#45A29E]/15 pb-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Verified Professional Resume Specification</h4>
                  <button
                    onClick={() => handleCopyText(JSON.stringify(portfolio.resume, null, 2))}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#66FCF1] hover:text-[#45A29E] cursor-pointer"
                  >
                    {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedText ? "Copied" : "Copy Raw JSON"}</span>
                  </button>
                </div>

                <div className="p-6 bg-[#0B0C10] rounded-2xl border border-[#45A29E]/20 space-y-6 text-xs text-[#C5C6C7] leading-relaxed max-h-[500px] overflow-y-auto">
                  {/* Resume Content Layout */}
                  <div className="text-center space-y-1 pb-4 border-b border-[#45A29E]/15">
                    <h5 className="text-lg font-bold text-white">{portfolio.resume?.fullName}</h5>
                    <p className="text-[#66FCF1] font-semibold">{user?.profile?.targetRole}</p>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[#C5C6C7]/60 font-medium">
                      <span>{portfolio.resume?.email}</span>
                      <span>&bull;</span>
                      <span>{portfolio.resume?.phone}</span>
                      <span>&bull;</span>
                      <span>{portfolio.resume?.linkedin}</span>
                      <span>&bull;</span>
                      <span>{portfolio.resume?.github}</span>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-2">
                    <h6 className="font-bold text-[#66FCF1] uppercase tracking-wider border-b border-[#45A29E]/15 pb-1 text-[10px]">Education History</h6>
                    {portfolio.resume?.education?.map((edu, idx) => (
                      <div key={idx} className="flex justify-between items-baseline gap-4">
                        <div>
                          <span className="font-bold text-white block">{edu.institution}</span>
                          <span className="text-[#C5C6C7]/85">{edu.degree}</span>
                        </div>
                        <span className="font-mono text-[#C5C6C7]/40 text-[10px] shrink-0">{edu.year}</span>
                      </div>
                    ))}
                  </div>

                  {/* Experience */}
                  <div className="space-y-4">
                    <h6 className="font-bold text-[#66FCF1] uppercase tracking-wider border-b border-[#45A29E]/15 pb-1 text-[10px]">Technical Project Experience</h6>
                    {portfolio.resume?.experience?.map((exp, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-baseline gap-4">
                          <div>
                            <span className="font-bold text-white">{exp.role}</span>
                            <span className="text-[#C5C6C7]/45 mx-1.5">@</span>
                            <span className="font-semibold text-[#66FCF1]">{exp.company}</span>
                          </div>
                          <span className="font-mono text-[#C5C6C7]/40 text-[10px] shrink-0">{exp.duration}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-[#C5C6C7]/80">
                          {exp.details?.map((d, didx) => (
                            <li key={didx}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LinkedIn Tab */}
            {activeSubTab === "linkedin" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#45A29E]/15 pb-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Recruiter-Optimized LinkedIn bio</h4>
                  <button
                    onClick={() => handleCopyText(portfolio.linkedinSummary)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#66FCF1] hover:text-[#45A29E] cursor-pointer"
                  >
                    {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedText ? "Copied bio" : "Copy bio"}</span>
                  </button>
                </div>

                <div className="p-5 bg-[#45A29E]/5 border border-[#45A29E]/20 rounded-2xl text-xs leading-relaxed text-[#C5C6C7] font-medium whitespace-pre-line">
                  {portfolio.linkedinSummary}
                </div>
              </div>
            )}

            {/* GitHub README */}
            {activeSubTab === "readme" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#45A29E]/15 pb-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">GitHub Profile README.md</h4>
                  <button
                    onClick={() => handleCopyText(portfolio.githubReadme)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#66FCF1] hover:text-[#45A29E] cursor-pointer"
                  >
                    {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedText ? "Copied Markdown" : "Copy Markdown"}</span>
                  </button>
                </div>

                <pre className="p-4 bg-[#0B0C10] text-[#66FCF1] font-mono rounded-2xl border border-[#45A29E]/20 text-xs overflow-x-auto leading-relaxed max-h-96">
                  {portfolio.githubReadme}
                </pre>
              </div>
            )}

            {/* Portfolio Web copy */}
            {activeSubTab === "web" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#45A29E]/15 pb-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Portfolio Website Structure</h4>
                  <button
                    onClick={() => handleCopyText(JSON.stringify(portfolio.portfolioWebsite, null, 2))}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#66FCF1] hover:text-[#45A29E] cursor-pointer"
                  >
                    {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedText ? "Copied" : "Copy details"}</span>
                  </button>
                </div>

                <div className="space-y-4 text-xs text-[#C5C6C7] leading-relaxed max-h-[500px] overflow-y-auto pr-2">
                  <div className="p-5 bg-[#0B0C10] border border-[#45A29E]/20 rounded-xl">
                    <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-wider block mb-1">Hero Title Banner</span>
                    <h5 className="font-extrabold text-white text-sm">{portfolio.portfolioWebsite?.heroTitle}</h5>
                  </div>

                  <div className="p-5 bg-[#0B0C10] border border-[#45A29E]/20 rounded-xl">
                    <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-wider block mb-1">About Me Summary</span>
                    <p className="text-[#C5C6C7]/80">{portfolio.portfolioWebsite?.aboutMe}</p>
                  </div>

                  <div className="p-5 bg-[#0B0C10] border border-[#45A29E]/20 rounded-xl space-y-3">
                    <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-wider block">Featured Projects Segment</span>
                    {portfolio.portfolioWebsite?.featuredProjects?.map((proj, pidx) => (
                      <div key={pidx} className="bg-[#1F2833] p-3 border border-[#45A29E]/20 rounded-lg space-y-1">
                        <span className="font-bold text-white block">{proj.title}</span>
                        <p className="text-[#C5C6C7]/80 leading-normal">{proj.desc}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {proj.tech?.map((t) => (
                            <span key={t} className="px-1.5 py-0.5 bg-[#0B0C10] border border-[#45A29E]/10 text-[10px] font-bold text-[#66FCF1] rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
