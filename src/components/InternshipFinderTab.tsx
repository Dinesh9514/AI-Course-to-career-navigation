import { useState, useEffect } from "react";
import { Search, Briefcase, MapPin, Landmark, DollarSign, Calendar, Bookmark, BookmarkCheck, ExternalLink, HelpCircle } from "lucide-react";
import { Internship } from "../types";

interface InternshipFinderTabProps {
  token: string;
}

export default function InternshipFinderTab({ token }: InternshipFinderTabProps) {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("Latest");

  useEffect(() => {
    fetchInternships();
  }, [search, type, sort]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        type,
        sort
      });
      const res = await fetch(`/api/internships?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setInternships(data.internships || []);
      setSavedIds(data.savedIds || []);
    } catch (error) {
      console.error("Failed to load internships:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (id: string, isSaved: boolean) => {
    try {
      const res = await fetch("/api/internships/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ internshipId: id, isSaved: !isSaved })
      });
      const data = await res.json();
      setSavedIds(data.savedIds || []);
    } catch (error) {
      console.error("Failed to toggle save state:", error);
    }
  };

  const getCompanyColor = (company: string) => {
    const colors: Record<string, string> = {
      Google: "bg-red-950/20 text-red-400 border-red-500/20",
      Stripe: "bg-indigo-950/20 text-indigo-400 border-indigo-500/20",
      Meta: "bg-blue-950/20 text-blue-400 border-blue-500/20",
      Netflix: "bg-red-950/20 text-red-400 border-red-500/20",
      Amazon: "bg-amber-950/20 text-amber-400 border-amber-500/20",
      CrowdStrike: "bg-[#0B0C10] text-white border-[#45A29E]/30",
      OpenAI: "bg-emerald-950/20 text-emerald-400 border-emerald-500/20"
    };
    return colors[company] || "bg-[#45A29E]/10 text-[#66FCF1] border-[#45A29E]/30";
  };

  return (
    <div className="space-y-6" id="internship-finder-tab-view">
      {/* Top filter dashboard */}
      <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#66FCF1]" />
            AI Internship Finder
          </h3>
          <p className="text-xs text-[#C5C6C7]/80 mt-1">
            Search top-tier technical internship openings. We pull vetted developer and architect roles matching modern syllabus criteria.
          </p>
        </div>

        {/* Input parameters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#C5C6C7]/50">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, role, or skill..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0B0C10] border border-[#45A29E]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/20 focus:border-[#66FCF1] text-white transition-colors placeholder-[#C5C6C7]/30"
            />
          </div>

          {/* Work type filter */}
          <div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0B0C10] border border-[#45A29E]/20 text-[#C5C6C7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/20 focus:border-[#66FCF1] transition-colors [&>option]:bg-[#1F2833] [&>option]:text-[#C5C6C7]"
            >
              <option value="All">All Types (Remote/Onsite)</option>
              <option value="Remote">Remote Only</option>
              <option value="Onsite">Onsite Only</option>
              <option value="Hybrid">Hybrid Only</option>
            </select>
          </div>

          {/* Sort selection */}
          <div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0B0C10] border border-[#45A29E]/20 text-[#C5C6C7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/20 focus:border-[#66FCF1] transition-colors [&>option]:bg-[#1F2833] [&>option]:text-[#C5C6C7]"
            >
              <option value="Latest">Latest Postings</option>
              <option value="Highest Paid">Highest Paid</option>
              <option value="Remote">Remote Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="p-12 text-center" id="internships-loading-panel">
          <div className="w-10 h-10 border-4 border-[#0B0C10] border-t-[#66FCF1] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-[#C5C6C7]/50">Loading verified internships list...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="internships-grid">
          {internships.length === 0 ? (
            <div className="md:col-span-2 p-12 text-center bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm text-[#C5C6C7]/50 text-xs">
              No matching internships found. Try clearing your search parameters!
            </div>
          ) : (
            internships.map((item) => {
              const isSaved = savedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="p-5 bg-[#1F2833] border border-[#45A29E]/20 hover:border-[#66FCF1]/40 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Company, Save Bookmark */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border font-bold text-sm ${getCompanyColor(item.company)}`}>
                          {item.company.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-tight">{item.role}</h4>
                          <span className="text-xs text-[#C5C6C7]/60 font-semibold">{item.company}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleSave(item.id, isSaved)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isSaved
                            ? "bg-amber-950/20 text-amber-400 border-amber-500/20"
                            : "bg-[#0B0C10] text-[#C5C6C7]/60 border-[#45A29E]/20 hover:text-white hover:border-[#66FCF1]/30"
                        }`}
                        title={isSaved ? "Saved to Profile" : "Save to Profile"}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Metadata tags */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 my-4 text-xs text-[#C5C6C7]/80">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C5C6C7]/40 shrink-0" />
                        <span>{item.location} ({item.type})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-bold text-[#66FCF1]">{item.salary}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-[#C5C6C7]/40 shrink-0" />
                        <span>Duration: {item.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C5C6C7]/40 shrink-0" />
                        <span>Deadline: {new Date(item.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Skills required badges */}
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {item.requiredSkills?.map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-[#0B0C10] text-[#C5C6C7]/80 text-[10px] font-semibold rounded border border-[#45A29E]/10">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-5 pt-3 border-t border-[#45A29E]/10 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[#C5C6C7]/50 font-mono">Posted: {new Date(item.postedDate).toLocaleDateString()}</span>
                    <a
                      href={item.url}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#66FCF1] hover:bg-[#45A29E] text-[#0B0C10] font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
                    >
                      <span>Apply on Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
