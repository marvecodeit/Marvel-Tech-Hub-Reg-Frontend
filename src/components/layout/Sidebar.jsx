import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Award, Settings, ChevronRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext.jsx";

const links = [
  { icon: LayoutDashboard, label: "Overview", value: "overview" },
  { icon: FileText, label: "Applications", value: "applications" },
  { icon: Award, label: "Skill Badges", value: "badges" },
];

export default function Sidebar({ mobile = false, onClose, activeTab, onTabChange }) {
  const { user } = useAuth();
  const initials = user?.fullname
    ? user.fullname.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <aside className={`${mobile ? "w-full" : "w-64 hidden lg:flex"} flex-col glass border-r border-white/5 min-h-screen pt-16`}>
      <div className="flex flex-col gap-1 p-4 pt-6">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Navigation</p>
        {links.map(({ icon: Icon, label, value }) => {
          const active = activeTab === value;
          return (
            <button key={value}
              onClick={() => { onTabChange?.(value); onClose?.(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group text-left w-full ${active ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <Icon className={`w-4 h-4 ${active ? "text-indigo-400" : "group-hover:text-white"}`} />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-indigo-400" />}
            </button>
          );
        })}
      </div>
      <div className="mt-auto p-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-sm font-bold text-white">{initials}</div>
            <div>
              <p className="text-sm font-medium text-white">{user?.fullname || "User"}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400">Active Applicant</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
