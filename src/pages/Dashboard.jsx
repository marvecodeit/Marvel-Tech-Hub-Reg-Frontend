import { useState, useEffect } from "react";
import { LayoutDashboard, FileText, Bell, Calendar, Award, CheckCircle, Clock, AlertCircle, XCircle, Zap, Code2, Cloud, Smartphone, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Card, StatCard, Tabs, Button, EmptyState, SkeletonCard, statusColor } from "../components/ui/index.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";
import { applicationService } from "../services/applicationService.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const statusIcon = { Pending: Clock, Reviewed: AlertCircle, Accepted: CheckCircle, Rejected: XCircle };
const statusIconColor = { Pending: "text-slate-400", Reviewed: "text-amber-400", Accepted: "text-emerald-400", Rejected: "text-red-400" };

// Map backend statuses to UI color keys
const appStatusColor = (s) => ({ Pending: "slate", Reviewed: "amber", Accepted: "emerald", Rejected: "red" }[s] || "slate");

const skillBadges = [
  { name: "React Expert", icon: Code2, color: "indigo", earned: true },
  { name: "Cloud Certified", icon: Cloud, color: "cyan", earned: true },
  { name: "Mobile Dev", icon: Smartphone, color: "emerald", earned: false },
  { name: "Top Applicant", icon: Zap, color: "amber", earned: true },
];

export default function Dashboard({ toast }) {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("overview");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getMine()
      .then(setApplications)
      .catch(() => toast?.("Failed to load applications", "error"))
      .finally(() => setLoading(false));
  }, []);

  const initials = user?.fullname
    ? user.fullname.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const acceptedCount = applications.filter((a) => a.status === "Accepted").length;
  const reviewedCount = applications.filter((a) => a.status === "Reviewed").length;

  return (
    <div className="min-h-screen pt-16 flex">
      <Sidebar activeTab={tab} onTabChange={setTab} />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user?.fullname?.split(" ")[0] || "there"} 👋</h1>
            <p className="text-slate-400 text-sm mt-1">Here's what's happening with your applications.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/apply">
              <Button size="sm">Apply to New Role</Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FileText} label="Total Applications" value={applications.length.toString()} color="indigo" />
          <StatCard icon={CheckCircle} label="Accepted" value={acceptedCount.toString()} color="emerald" />
          <StatCard icon={AlertCircle} label="Under Review" value={reviewedCount.toString()} color="cyan" />
          <StatCard icon={Award} label="Skill Badges" value="3" color="purple" />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs
            tabs={[
              { label: "Overview", value: "overview" },
              { label: "Applications", value: "applications" },
              { label: "Badges", value: "badges" },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-white">Recent Applications</h2>
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
              ) : applications.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No applications yet"
                  description="Start applying to roles to track your progress here."
                  action={<Link to="/apply"><Button size="sm">Browse Jobs</Button></Link>}
                />
              ) : (
                applications.slice(0, 3).map((app) => {
                  const Icon = statusIcon[app.status] || Clock;
                  return (
                    <Card key={app._id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{app.job?.title || "Position"}</p>
                          <p className="text-xs text-slate-500">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge color={appStatusColor(app.status)}>{app.status}</Badge>
                        <Icon className={`w-4 h-4 ${statusIconColor[app.status]}`} />
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Profile Overview</h2>
              <Card>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xl font-bold text-white">{initials}</div>
                  <div>
                    <p className="font-bold text-white">{user?.fullname || "User"}</p>
                    <p className="text-sm text-slate-400">{user?.email}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-emerald-400">Active</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Role</span><span className="text-slate-300 capitalize">{user?.role || "Applicant"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Applications</span><span className="text-slate-300">{applications.length}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="text-emerald-400">Active</span></div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Applications */}
        {tab === "applications" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">All Applications</h2>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : applications.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No applications yet"
                description="Apply to a role to see your applications here."
                action={<Link to="/jobs"><Button size="sm">Browse Jobs</Button></Link>}
              />
            ) : (
              applications.map((app) => (
                <Card key={app._id}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-white">{app.job?.title || "Position"}</p>
                        <Badge color={appStatusColor(app.status)}>{app.status}</Badge>
                      </div>
                      <p className="text-sm text-slate-500">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                      {app.resume && (
                        <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:underline flex items-center gap-1 mt-1">
                          <ExternalLink className="w-3 h-3" /> View Resume
                        </a>
                      )}
                    </div>
                  </div>
                  {/* Status Timeline */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      {["Pending", "Reviewed", "Accepted"].map((s, i) => {
                        const stages = ["Pending", "Reviewed", "Accepted"];
                        const currentIdx = stages.indexOf(app.status);
                        const isActive = i <= currentIdx && app.status !== "Rejected";
                        return (
                          <div key={s} className="flex items-center flex-1">
                            <div className="flex flex-col items-center gap-1 flex-1">
                              <div className={`w-3 h-3 rounded-full ${isActive ? "bg-indigo-500" : "bg-white/10"}`} />
                              <span className={`text-xs ${isActive ? "text-indigo-400" : "text-slate-600"}`}>{s}</span>
                            </div>
                            {i < 2 && <div className={`flex-1 h-px ${isActive && i < currentIdx ? "bg-indigo-500/50" : "bg-white/5"}`} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Badges */}
        {tab === "badges" && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-6">Skill Badges</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {skillBadges.map(({ name, icon: Icon, color, earned }) => (
                <div key={name} className={`glass rounded-2xl p-6 text-center ${!earned ? "opacity-40" : ""}`}>
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ${color === "indigo" ? "from-indigo-600/30 to-indigo-600/10 border border-indigo-500/20" : color === "cyan" ? "from-cyan-600/30 to-cyan-600/10 border border-cyan-500/20" : color === "emerald" ? "from-emerald-600/30 to-emerald-600/10 border border-emerald-500/20" : "from-amber-600/30 to-amber-600/10 border border-amber-500/20"}`}>
                    <Icon className={`w-8 h-8 ${color === "indigo" ? "text-indigo-400" : color === "cyan" ? "text-cyan-400" : color === "emerald" ? "text-emerald-400" : "text-amber-400"}`} />
                  </div>
                  <p className="font-semibold text-white text-sm">{name}</p>
                  <p className="text-xs text-slate-500 mt-1">{earned ? "Earned" : "Locked"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
