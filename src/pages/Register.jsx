import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Zap, Eye, EyeOff } from "lucide-react";
import { Button, Input } from "../components/ui/index.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { authService } from "../services/authService.js";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullname: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const set = (key, val) => setFormData((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.register(formData);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050816]">
      <div className="glass-strong rounded-3xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 text-sm mt-2">Join Marvel Tech Hub today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.fullname}
            onChange={(e) => set("fullname", e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => set("email", e.target.value)}
            required
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => set("password", e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-slate-500 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" className="w-full" loading={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
