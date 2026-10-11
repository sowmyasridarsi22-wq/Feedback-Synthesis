import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  MessageSquare,
  BarChart3,
  Lightbulb,
  Layers3,
  FileText,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
const links = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/import", "Data Import", Upload],
  ["/feedback", "Feedback", MessageSquare],
  ["/topics", "Topics & Issues", Layers3],
  ["/features", "Feature Requests", Lightbulb],
  ["/trends", "Trends", BarChart3],
  ["/reports", "Reports", FileText],
];
export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-[#0b1020] text-slate-100">
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-slate-800 bg-[#0e1528] p-5 hidden md:flex flex-col">
        <div className="mb-8">
          <div className="text-xs text-cyan-400 font-semibold tracking-widest">
            AI PRODUCT INTELLIGENCE
          </div>
          <h1 className="text-xl font-bold mt-2">Feedback Synthesis</h1>
        </div>
        <nav className="space-y-1 flex-1">
          {links.map(([to, label, I]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${isActive ? "bg-cyan-500/15 text-cyan-300" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`
              }
            >
              <I size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-800 pt-4">
          <div className="text-sm font-medium">{user?.name}</div>
          <div className="text-xs text-slate-500 mb-3">{user?.role}</div>
          <button
            onClick={() => {
              logout();
              nav("/login");
            }}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
      <main className="md:ml-64 min-h-screen p-5 md:p-8">{children}</main>
    </div>
  );
}
