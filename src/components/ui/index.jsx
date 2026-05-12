import { useState } from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

export const Button = ({ children, variant = "primary", size = "md", className = "", disabled, loading, onClick, type = "button" }) => {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white glow-blue",
    secondary: "glass text-slate-200 hover:bg-white/10 border border-white/10",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30",
    success: "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base", xl: "px-9 py-4 text-lg" };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
};

export const Badge = ({ children, color = "indigo" }) => {
  const colors = {
    indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    red: "bg-red-500/15 text-red-300 border-red-500/30",
    slate: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>{children}</span>;
};

export const statusColor = (status) => ({ Applied: "slate", Review: "amber", Interview: "indigo", Offer: "emerald", Rejected: "red" }[status] || "slate");

export const Card = ({ children, className = "", hover = false }) => (
  <div className={`glass rounded-2xl p-6 ${hover ? "hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1" : ""} ${className}`}>
    {children}
  </div>
);

export const Input = ({ label, error, className = "", ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
    <input
      className={`w-full px-4 py-3 rounded-xl glass text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm ${error ? "border-red-500/50" : ""} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

export const Textarea = ({ label, error, className = "", ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
    <textarea
      className={`w-full px-4 py-3 rounded-xl glass text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm resize-none ${error ? "border-red-500/50" : ""} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

export const Select = ({ label, error, children, className = "", ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
    <select
      className={`w-full px-4 py-3 rounded-xl glass text-slate-200 outline-none focus:border-indigo-500/60 transition-all text-sm bg-[#0a0f1e] ${error ? "border-red-500/50" : ""} ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

export const Skeleton = ({ className = "" }) => <div className={`skeleton rounded-xl ${className}`} />;

export const SkeletonCard = () => (
  <div className="glass rounded-2xl p-6 space-y-4">
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-6 w-14" />
    </div>
    <Skeleton className="h-10 w-full" />
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4">
      {Icon && <Icon className="w-8 h-8 text-slate-500" />}
    </div>
    <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm max-w-xs mb-6">{description}</p>
    {action}
  </div>
);

export const Modal = ({ open, onClose, title, children, size = "md" }) => {
  if (!open) return null;
  const sizes = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} glass-strong rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const toastIcons = { success: CheckCircle, error: AlertCircle, warning: AlertTriangle, info: Info };
const toastColors = { success: "text-emerald-400 border-emerald-500/30", error: "text-red-400 border-red-500/30", warning: "text-amber-400 border-amber-500/30", info: "text-indigo-400 border-indigo-500/30" };

export const ToastContainer = ({ toasts, onRemove }) => (
  <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
    {toasts.map((t) => {
      const Icon = toastIcons[t.type] || Info;
      return (
        <div key={t.id} className={`pointer-events-auto flex items-center gap-3 glass-strong rounded-xl px-4 py-3 min-w-72 border ${toastColors[t.type]} shadow-xl`}>
          <Icon className="w-5 h-5 shrink-0" />
          <p className="text-sm text-slate-200 flex-1">{t.message}</p>
          <button onClick={() => onRemove(t.id)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      );
    })}
  </div>
);

export const StatCard = ({ icon: Icon, label, value, change, color = "indigo" }) => {
  const colors = { indigo: "from-indigo-600/20 to-indigo-600/5 border-indigo-500/20", purple: "from-purple-600/20 to-purple-600/5 border-purple-500/20", cyan: "from-cyan-600/20 to-cyan-600/5 border-cyan-500/20", emerald: "from-emerald-600/20 to-emerald-600/5 border-emerald-500/20" };
  const iconColors = { indigo: "text-indigo-400", purple: "text-purple-400", cyan: "text-cyan-400", emerald: "text-emerald-400" };
  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br border ${colors[color]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-white/5 ${iconColors[color]}`}><Icon className="w-5 h-5" /></div>
        {change && <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">{change}</span>}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
};

export const Tabs = ({ tabs, active, onChange }) => (
  <div className="flex gap-1 glass rounded-xl p-1">
    {tabs.map((tab) => (
      <button key={tab.value} onClick={() => onChange(tab.value)}
        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${active === tab.value ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
        {tab.label}
      </button>
    ))}
  </div>
);

export const Pagination = ({ page, total, perPage, onChange }) => {
  const pages = Math.ceil(total / perPage);
  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => onChange(page - 1)}>Prev</Button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${p === page ? "bg-indigo-600 text-white" : "glass text-slate-400 hover:text-white"}`}>
          {p}
        </button>
      ))}
      <Button variant="secondary" size="sm" disabled={page === pages} onClick={() => onChange(page + 1)}>Next</Button>
    </div>
  );
};

export const Accordion = ({ items }) => {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="glass rounded-xl overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left text-slate-200 font-medium hover:text-white transition-colors">
            {item.q}
            <span className={`text-indigo-400 transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}>+</span>
          </button>
          {open === i && <div className="px-6 pb-4 text-slate-400 text-sm leading-relaxed">{item.a}</div>}
        </div>
      ))}
    </div>
  );
};

export const MultiSelect = ({ label, options, selected, onChange }) => {
  const toggle = (opt) => onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selected.includes(opt) ? "bg-indigo-600 border-indigo-500 text-white" : "glass border-white/10 text-slate-400 hover:text-white"}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
