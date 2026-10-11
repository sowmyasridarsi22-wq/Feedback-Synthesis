
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Protected from "./components/Protected";

import Intro from "./pages/Intro";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Import from "./pages/Import";
import Feedback from "./pages/Feedback";
import Reports from "./pages/Reports";
import Topics from "./pages/Topics";
import Features from "./pages/Features";
import Trends from "./pages/Trends";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Intro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected application pages */}
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />

          <Route
            path="/import"
            element={
              <Protected>
                <Import />
              </Protected>
            }
          />

          <Route
            path="/feedback"
            element={
              <Protected>
                <Feedback />
              </Protected>
            }
          />

          <Route
            path="/topics"
            element={
              <Protected>
                <Topics />
              </Protected>
            }
          />

          <Route
            path="/features"
            element={
              <Protected>
                <Features />
              </Protected>
            }
          />

          <Route
            path="/trends"
            element={
              <Protected>
                <Trends />
              </Protected>
            }
          />

          <Route
            path="/reports"
            element={
              <Protected>
                <Reports />
              </Protected>
            }
          />

          {/* Unknown URLs return to the introduction page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
