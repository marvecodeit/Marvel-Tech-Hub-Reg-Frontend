import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import { ToastContainer } from "./components/ui/index.jsx";
import { useToast } from "./hooks/useAsync.js";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import Landing from "./pages/Landing.jsx";
import Jobs from "./pages/Jobs.jsx";
import Apply from "./pages/Apply.jsx";
import Admin from "./pages/Admin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ResumeViewer from "./pages/ResumeViewer.jsx";

function AppLayout() {
  const { toasts, toast, removeToast } = useToast();
  const { pathname } = useLocation();
  const hideNav = pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/resume-viewer";

  return (
    <div className="min-h-screen bg-[#050816]">
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/jobs" element={<Jobs toast={toast} />} />
        <Route path="/apply" element={<Apply toast={toast} />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/resume-viewer" element={<ResumeViewer />} />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <Admin toast={toast} />
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
