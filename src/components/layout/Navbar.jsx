import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/index.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Jobs", to: "/jobs" },
  { label: "Apply", to: "/apply" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <nav className="fixed top-4 left-4 right-4 z-40 glass border border-white/5 rounded-2xl max-w-6xl mx-auto">
      <div className="flex items-center justify-around h-16 px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="font-bold text-white text-lg">Marvel<span className="gradient-text">Tech</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === l.to ? "text-white bg-white/10" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAdmin ? (
            <>
              <Link to="/admin">
                <Button variant="secondary" size="sm">Admin Panel</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/admin/login">
                <Button variant="ghost" size="sm">Admin Login</Button>
              </Link>
              <Link to="/apply">
                <Button size="sm">Apply Now</Button>
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg glass text-slate-400">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass-strong border-t border-white/5 px-4 py-4 space-y-2">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${pathname === l.to ? "text-white bg-white/10" : "text-slate-400"}`}>
              {l.label}
            </Link>
          ))}
          {isAdmin ? (
            <>
              <Link to="/admin" onClick={() => setOpen(false)}>
                <Button className="w-full mt-2" variant="secondary">Admin Panel</Button>
              </Link>
              <Button className="w-full mt-2" variant="ghost" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/admin/login" onClick={() => setOpen(false)}>
                <Button className="w-full mt-2" variant="secondary">Admin Login</Button>
              </Link>
              <Link to="/apply" onClick={() => setOpen(false)}>
                <Button className="w-full mt-2">Apply Now</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
