import { useState, useEffect } from "react";
import { Search, MapPin, Clock, DollarSign, Briefcase, Flame, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Badge, SkeletonCard, EmptyState } from "../components/ui/index.jsx";
import { jobService } from "../services/jobService.js";

const categories = ["All", "Frontend", "Backend", "Fullstack", "Mobile Development", "UI/UX", "DevOps", "Internship", "Remote"];

const categoryColor = (cat) =>
  ({ Frontend: "indigo", Backend: "purple", Fullstack: "cyan", "Mobile Development": "emerald", "UI/UX": "amber", DevOps: "red", Internship: "slate" }[cat] || "slate");

export default function Jobs({ toast }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    jobService.getAll()
      .then(setJobs)
      .catch(() => toast?.("Failed to load jobs", "error"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch = j.title?.toLowerCase().includes(q) || j.skills?.some((s) => s.toLowerCase().includes(q));
    const matchCat =
      activeCategory === "All" ||
      j.category === activeCategory ||
      (activeCategory === "Remote" && j.location === "Remote");
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center py-12">
          <Badge color="indigo">Open Positions</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-4">Find Your Next Role</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Explore {loading ? "..." : jobs.length} open positions across engineering, design, and infrastructure.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, skill, or technology..."
            className="w-full pl-12 pr-4 py-4 glass rounded-2xl text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${activeCategory === cat ? "bg-indigo-600 border-indigo-500 text-white" : "glass border-white/10 text-slate-400 hover:text-white"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-400 text-sm"><span className="text-white font-semibold">{filtered.length}</span> positions found</p>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Filter className="w-4 h-4" />
            Sorted by: Latest
          </div>
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Briefcase} title="No jobs found" description="Try adjusting your search or filters to find more opportunities." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job }) {
  return (
    <div className="glass rounded-2xl p-6 hover:-translate-y-1 hover:bg-white/[0.07] transition-all duration-300 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/20 flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="flex items-center gap-2">
          {job.hot && (
            <span className="flex items-center gap-1 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded-full">
              <Flame className="w-3 h-3" /> Hot
            </span>
          )}
          <Badge color={categoryColor(job.category)}>{job.category}</Badge>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>

      <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
        {job.salary && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary}</span>}
        {job.experience && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.experience}</span>}
        {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(job.createdAt).toLocaleDateString()}</span>
      </div>

      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {job.skills.map((s) => (
            <span key={s} className="px-2 py-1 rounded-lg bg-white/5 text-slate-400 text-xs border border-white/5">{s}</span>
          ))}
        </div>
      )}

      <div className="mt-auto">
        <Link to={`/apply?jobId=${job._id}&jobTitle=${encodeURIComponent(job.title)}`}>
          <Button className="w-full" size="sm">Apply Now</Button>
        </Link>
      </div>
    </div>
  );
}
