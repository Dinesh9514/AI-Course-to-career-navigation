import React, { useState, useEffect } from "react";
import { ShieldCheck, Users, Mail, GraduationCap } from "lucide-react";

interface AdminPanelTabProps {
  token: string;
  onBroadcastSuccess: () => void;
}

export default function AdminPanelTab({ token }: AdminPanelTabProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [token]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch admin statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="admin-panel-tab-view">
      {/* Banner */}
      <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 text-white rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-5 translate-x-10 translate-y-10 scale-150">
          <ShieldCheck className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-[#66FCF1]/10 text-[#66FCF1] border border-[#66FCF1]/20 px-2.5 py-1 rounded-full">
            Security & Registration Audit
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-3">
            Registered Students Database
          </h2>
          <p className="text-xs text-[#C5C6C7]/80 mt-1 max-w-xl">
            A comprehensive overview of active student registrations and their selected study pathways.
          </p>
        </div>
      </div>

      {/* Registration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-widest">Total Registered Accounts</span>
            <span className="text-3xl font-black text-white block mt-1.5">{stats?.totalUsers || 0}</span>
          </div>
          <span className="p-3 bg-[#66FCF1]/10 text-[#66FCF1] border border-[#66FCF1]/20 rounded-xl"><Users className="w-6 h-6" /></span>
        </div>

        <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-widest">System Health</span>
            <span className="text-sm font-bold text-emerald-400 block mt-1.5">Standby Active</span>
          </div>
          <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse mr-2"></span>
        </div>

        <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#C5C6C7]/50 uppercase tracking-widest">Database Sync State</span>
            <span className="text-xs font-semibold text-[#66FCF1] block mt-1.5">JSON Persistence</span>
          </div>
        </div>
      </div>

      {/* Registrations List */}
      <div className="p-6 bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            All Registered Student Profiles
          </h4>
          <p className="text-xs text-[#C5C6C7]/60 mt-0.5">Auditing student names, emails, and target career paths.</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#C5C6C7]/60">
            <div className="w-8 h-8 border-2 border-[#0B0C10] border-t-[#66FCF1] rounded-full animate-spin mx-auto mb-3"></div>
            Loading active registrations...
          </div>
        ) : !stats?.registrationsList || stats.registrationsList.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#C5C6C7]/40 bg-[#0B0C10]/20 border border-[#45A29E]/10 rounded-xl">
            No registered student records available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#45A29E]/15 text-[#66FCF1]">
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Student Name</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Email Address</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Target Career Role</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Skills Tracked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#45A29E]/10">
                {stats.registrationsList.map((reg: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#0B0C10]/20 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{reg.name}</td>
                    <td className="py-3 px-4 text-[#C5C6C7]/80 font-mono flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#45A29E]" />
                      {reg.email}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#66FCF1]">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#45A29E]/10 rounded-lg border border-[#45A29E]/25">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {reg.targetRole}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {reg.skills.length === 0 ? (
                        <span className="text-[#C5C6C7]/40">No skills added</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {reg.skills.slice(0, 4).map((skill: string) => (
                            <span key={skill} className="px-1.5 py-0.5 bg-[#0B0C10] border border-[#45A29E]/10 text-[9px] font-semibold text-[#C5C6C7]/80 rounded">
                              {skill}
                            </span>
                          ))}
                          {reg.skills.length > 4 && (
                            <span className="text-[10px] text-[#45A29E] font-medium pl-1">
                              +{reg.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
