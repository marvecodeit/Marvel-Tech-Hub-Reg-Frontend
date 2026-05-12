import { useState, useEffect } from "react";
import { Users, Briefcase, TrendingUp, CheckCircle, Search, Eye, Trash2, Plus, BarChart2, FileText, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Badge, Button, Modal, StatCard, Pagination, SkeletonCard, EmptyState, Input, Textarea, Select } from "../components/ui/index.jsx";
import { applicationService } from "../services/applicationService.js";
import { adminService } from "../services/adminService.js";
import { jobService } from "../services/jobService.js";
import { analyticsData, skillOptions } from "../data/mockData.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const adminLinks = ["Overview", "Applicants", "Jobs", "Analytics"];

const appStatusColor = (s) => ({ Pending: "slate", Reviewed: "amber", Accepted: "emerald", Rejected: "red" }[s] || "slate");

export default function Admin({ toast }) {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApp, setSelectedApp] = useState(null);
  const [page, setPage] = useState(1);

  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postJobModal, setPostJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({ title: "", description: "", category: "", location: "", salary: "", experience: "", jobType: "Full-time", skills: [] });
  const [jobFormLoading, setJobFormLoading] = useState(false);
  const [jobFormError, setJobFormError] = useState("");

  useEffect(() => {
    Promise.all([
      applicationService.getAll(),
      adminService.getUsers(),
      jobService.getAll(),
    ])
      .then(([apps, usrs, jbs]) => {
        setApplications(apps);
        setUsers(usrs);
        setJobs(jbs);
      })
      .catch(() => toast?.("Failed to load admin data", "error"))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await applicationService.updateStatus(id, status);
      setApplications((prev) => prev.map((a) => a._id === id ? { ...a, status } : a));
      if (selectedApp?._id === id) setSelectedApp((p) => ({ ...p, status }));
      toast?.(`Status updated to ${status}`, "success");
    } catch {
      toast?.("Failed to update status", "error");
    }
  };

  const deleteJob = async (id) => {
    try {
      await jobService.delete(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast?.("Job removed", "success");
    } catch {
      toast?.("Failed to remove job", "error");
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setJobFormError("");
    if (!jobForm.title.trim() || !jobForm.description.trim() || !jobForm.category.trim()) {
      setJobFormError("Title, description and category are required");
      return;
    }
    if (jobFormLoading) return;
    setJobFormLoading(true);
    try {
      const newJob = await jobService.create(jobForm);
      setJobs((prev) => [newJob, ...prev]);
      setPostJobModal(false);
      setJobForm({ title: "", description: "", category: "", location: "", salary: "", experience: "", jobType: "Full-time", skills: [] });
      setJobFormError("");
      toast?.("Job posted successfully!", "success");
    } catch (err) {
      setJobFormError(err.response?.data?.message || "Failed to post job");
    } finally {
      setJobFormLoading(false);
    }
  };

  const toggleJobSkill = (skill) => {
    setJobForm((p) => ({
      ...p,
      skills: p.skills.includes(skill) ? p.skills.filter((s) => s !== skill) : [...p.skills, skill],
    }));
  };

  const filtered = applications.filter((a) => {
    const name = a.applicant?.fullname || "";
    const title = a.job?.title || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const perPage = 5;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen pt-16">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 hidden lg:flex flex-col glass border-r border-white/5 min-h-screen pt-6 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">Admin Panel</p>
          {adminLinks.map((l) => (
            <button key={l} onClick={() => setTab(l)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left mb-1 ${tab === l ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              {l}
            </button>
          ))}
          <div className="my-2 border-t border-white/5" />
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <ArrowLeft className="w-4 h-4" /> Home Page
          </Link>
          <div className="mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white">AD</div>
              <div>
                <p className="text-xs font-medium text-white">{user?.fullname || "Admin"}</p>
                <p className="text-xs text-slate-600">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-2" onClick={logout}>Logout</Button>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Mobile tabs */}
          <div className="lg:hidden mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {adminLinks.map((l) => (
                <button key={l} onClick={() => setTab(l)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === l ? "bg-indigo-600 text-white" : "glass text-slate-400"}`}>
                  {l}
                </button>
              ))}
              <Link to="/" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white transition-all">
                <ArrowLeft className="w-3.5 h-3.5" /> Home
              </Link>
            </div>
          </div>

          {/* Overview */}
          {tab === "Overview" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
                <p className="text-slate-400 text-sm">Manage applicants, jobs, and hiring pipeline.</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Applicants" value={loading ? "..." : applications.length.toString()} change="+12 this week" color="indigo" />
                <StatCard icon={Briefcase} label="Open Positions" value={loading ? "..." : jobs.length.toString()} color="purple" />
                <StatCard icon={CheckCircle} label="Accepted" value={loading ? "..." : applications.filter((a) => a.status === "Accepted").length.toString()} color="emerald" />
                <StatCard icon={TrendingUp} label="Total Users" value={loading ? "..." : users.length.toString()} color="cyan" />
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-base font-semibold text-white mb-4">Applications Over Time</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={analyticsData}>
                      <defs>
                        <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#e2e8f0" }} />
                      <Area type="monotone" dataKey="applications" stroke="#6366f1" fill="url(#appGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-base font-semibold text-white mb-4">Hires Per Month</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#e2e8f0" }} />
                      <Bar dataKey="hires" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-white">Recent Applications</h3>
                  <Button variant="ghost" size="sm" onClick={() => setTab("Applicants")}>View All</Button>
                </div>
                {loading ? <SkeletonCard /> : (
                  <ApplicantTable applications={applications.slice(0, 4)} onView={setSelectedApp} onStatusChange={updateStatus} />
                )}
              </div>
            </div>
          )}

          {/* Applicants */}
          {tab === "Applicants" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Applicants</h1>
                <div className="flex gap-3 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search applicants..." className="pl-9 pr-4 py-2 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/60 w-56" />
                  </div>
                  <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 glass rounded-xl text-sm text-slate-300 outline-none bg-transparent">
                    {["All", "Pending", "Reviewed", "Accepted", "Rejected"].map((s) => <option key={s} value={s} className="bg-[#0a0f1e]">{s}</option>)}
                  </select>
                </div>
              </div>
              {loading ? <SkeletonCard /> : filtered.length === 0 ? (
                <EmptyState icon={Users} title="No applicants found" description="Try adjusting your search or filters." />
              ) : (
                <>
                  <div className="glass rounded-2xl overflow-hidden">
                    <ApplicantTable applications={paginated} onView={setSelectedApp} onStatusChange={updateStatus} />
                  </div>
                  <div className="flex justify-center">
                    <Pagination page={page} total={filtered.length} perPage={perPage} onChange={setPage} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Jobs */}
          {tab === "Jobs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Job Postings</h1>
                <Button size="sm" onClick={() => setPostJobModal(true)}><Plus className="w-4 h-4" /> Post New Job</Button>
              </div>
              {loading ? <SkeletonCard /> : jobs.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="No jobs posted yet"
                  description="Post your first job so applicants can apply."
                  action={<Button size="sm" onClick={() => setPostJobModal(true)}><Plus className="w-4 h-4" /> Post New Job</Button>}
                />
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div key={job._id} className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-white">{job.title}</p>
                          <Badge color="slate">Active</Badge>
                        </div>
                        <p className="text-sm text-slate-500">{job.category} · {job.location} · {job.salary}</p>
                        {job.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.skills.map((s) => <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5">{s}</span>)}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button variant="danger" size="sm" onClick={() => deleteJob(job._id)}><Trash2 className="w-3 h-3" /> Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics */}
          {tab === "Analytics" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-white">Analytics</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Applications" value={applications.length.toString()} color="indigo" />
                <StatCard icon={CheckCircle} label="Accepted" value={applications.filter((a) => a.status === "Accepted").length.toString()} color="emerald" />
                <StatCard icon={TrendingUp} label="Reviewed" value={applications.filter((a) => a.status === "Reviewed").length.toString()} color="purple" />
                <StatCard icon={BarChart2} label="Pending" value={applications.filter((a) => a.status === "Pending").length.toString()} color="cyan" />
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="text-base font-semibold text-white mb-4">Applications vs Hires (6 months)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#e2e8f0" }} />
                    <Area type="monotone" dataKey="applications" stroke="#6366f1" fill="url(#g1)" strokeWidth={2} name="Applications" />
                    <Area type="monotone" dataKey="hires" stroke="#8b5cf6" fill="url(#g2)" strokeWidth={2} name="Hires" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Post Job Modal */}
      <Modal open={postJobModal} onClose={() => { if (!jobFormLoading) { setPostJobModal(false); setJobFormError(""); setJobForm({ title: "", description: "", category: "", location: "", salary: "", experience: "", jobType: "Full-time", skills: [] }); } }} title="Post New Job" size="md">
        <form onSubmit={handlePostJob} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Job Title *"
              placeholder="e.g. Senior Frontend Engineer"
              value={jobForm.title}
              onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))}
            />
            <Select
              label="Category *"
              value={jobForm.category}
              onChange={(e) => setJobForm((p) => ({ ...p, category: e.target.value }))}
            >
              <option value="">Select category</option>
              {["Frontend", "Backend", "Fullstack", "Mobile Development", "UI/UX", "DevOps", "Internship"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
            <Input
              label="Location"
              placeholder="e.g. Remote, Lagos, New York"
              value={jobForm.location}
              onChange={(e) => setJobForm((p) => ({ ...p, location: e.target.value }))}
            />
            <Input
              label="Salary"
              placeholder="e.g. $80k - $120k"
              value={jobForm.salary}
              onChange={(e) => setJobForm((p) => ({ ...p, salary: e.target.value }))}
            />
            <Select
              label="Experience Required"
              value={jobForm.experience}
              onChange={(e) => setJobForm((p) => ({ ...p, experience: e.target.value }))}
            >
              <option value="">Select experience</option>
              {["0-1 years", "1-2 years", "2-4 years", "4-6 years", "6-10 years", "10+ years"].map((x) => (
                <option key={x} value={x}>{x}</option>
              ))}
            </Select>
            <Select
              label="Job Type"
              value={jobForm.jobType}
              onChange={(e) => setJobForm((p) => ({ ...p, jobType: e.target.value }))}
            >
              {["Full-time", "Part-time", "Remote", "Internship"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </div>
          <Textarea
            label="Job Description *"
            placeholder="Describe the role, responsibilities, and requirements..."
            rows={4}
            value={jobForm.description}
            onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))}
          />
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Required Skills</label>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleJobSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    jobForm.skills.includes(skill)
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "glass border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
          {jobFormError && <p className="text-red-400 text-sm">{jobFormError}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" loading={jobFormLoading}>
              {jobFormLoading ? "Posting..." : "Post Job"}
            </Button>
            <Button type="button" variant="secondary" className="flex-1" disabled={jobFormLoading} onClick={() => { setPostJobModal(false); setJobFormError(""); setJobForm({ title: "", description: "", category: "", location: "", salary: "", experience: "", jobType: "Full-time", skills: [] }); }}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* Applicant Detail Modal */}
      <Modal open={!!selectedApp} onClose={() => setSelectedApp(null)} title="Application Details" size="md">
        {selectedApp && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                {(selectedApp.applicant?.fullname || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedApp.applicant?.fullname || "Applicant"}</h3>
                <p className="text-slate-400">{selectedApp.job?.title || "Position"}</p>
                <p className="text-sm text-slate-500">{selectedApp.applicant?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Phone", value: selectedApp.applicant?.phone || "N/A" },
                { label: "Experience", value: selectedApp.experience || "N/A" },
                { label: "Applied", value: new Date(selectedApp.createdAt).toLocaleDateString() },
                { label: "Status", value: selectedApp.status },
                { label: "Country", value: selectedApp.meta?.country || "N/A" },
                { label: "Availability", value: selectedApp.meta?.availability || "N/A" },
                { label: "Work Preference", value: selectedApp.meta?.workPreference || "N/A" },
                { label: "Tech Stack", value: selectedApp.meta?.techStack || "N/A" },
                { label: "Qualification", value: selectedApp.meta?.qualification || "N/A" },
                { label: "Institution", value: selectedApp.meta?.institution || "N/A" },
              ].map(({ label, value }) => (
                <div key={label} className="glass rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className="text-sm font-medium text-white">{value}</p>
                </div>
              ))}
            </div>

            {selectedApp.applicant?.skills?.length > 0 && (
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.applicant.skills.map((s) => (
                    <span key={s} className="px-2 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 text-xs border border-indigo-500/20">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {selectedApp.coverLetter && (
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-2">Cover Letter / Answers</p>
                <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{selectedApp.coverLetter}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 text-sm">
              {selectedApp.applicant?.portfolio && (
                <a href={selectedApp.applicant.portfolio} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">🌐 Portfolio</a>
              )}
              {selectedApp.applicant?.github && (
                <a href={selectedApp.applicant.github} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">🐙 GitHub</a>
              )}
              {selectedApp.applicant?.linkedin && (
                <a href={selectedApp.applicant.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">💼 LinkedIn</a>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-slate-300 mb-2">Update Status</p>
              <select
                value={selectedApp.status}
                onChange={(e) => updateStatus(selectedApp._id, e.target.value)}
                className="w-full px-4 py-3 glass rounded-xl text-slate-200 outline-none bg-[#0a0f1e] text-sm">
                {["Pending", "Reviewed", "Accepted", "Rejected"].map((s) => <option key={s} value={s} className="bg-[#0a0f1e]">{s}</option>)}
              </select>
            </div>

            <div className="flex gap-3">
              {selectedApp.resume && (
                <ResumeViewer url={selectedApp.resume} mimeType={selectedApp.resumeMimeType} />
              )}
              <Button variant="secondary" className="flex-1" onClick={() => setSelectedApp(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function ResumeViewer({ url, mimeType }) {
  const openViewer = () => {
    const params = new URLSearchParams({ url, type: mimeType || "" });
    window.open(`/resume-viewer?${params.toString()}`, "_blank");
  };

  return (
    <div className="flex-1 flex gap-2">
      <button
        onClick={openViewer}
        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold transition-all"
      >
        <FileText className="w-4 h-4" /> View Resume
      </button>
      <a href={url} download target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl glass border border-white/10 text-slate-300 hover:text-white transition-colors">
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
}

function ApplicantTable({ applications, onView, onStatusChange }) {
  if (applications.length === 0) return <p className="text-slate-500 text-sm p-4">No applications found.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            {["Applicant", "Position", "Experience", "Applied", "Status", "Actions"].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {(a.applicant?.fullname || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{a.applicant?.fullname || "Unknown"}</p>
                    <p className="text-xs text-slate-500">{a.applicant?.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-slate-300">{a.job?.title || "N/A"}</td>
              <td className="px-4 py-4 text-sm text-slate-400">{a.experience || "N/A"}</td>
              <td className="px-4 py-4 text-sm text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-4">
                <select
                  value={a.status}
                  onChange={(e) => onStatusChange(a._id, e.target.value)}
                  className="px-2 py-1 rounded-lg text-xs font-medium bg-transparent outline-none cursor-pointer border border-white/10 text-slate-300">
                  {["Pending", "Reviewed", "Accepted", "Rejected"].map((s) => <option key={s} value={s} className="bg-[#0a0f1e]">{s}</option>)}
                </select>
              </td>
              <td className="px-4 py-4">
                <button onClick={() => onView(a)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
