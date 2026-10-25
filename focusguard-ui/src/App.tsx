import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landing/LandingPage";
import ProjectShowcasePage from "./pages/Project/ProjectShowcasePage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import AcceptInvitationPage from "./pages/Auth/AcceptInvitationPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AboutPage from "./pages/Legal/AboutPage";
import PrivacyPage from "./pages/Legal/PrivacyPage";
import ContactPage from "./pages/Legal/ContactPage";
import TermsPage from "./pages/Legal/TermsPage";

/* ========================= */
/* Super Admin */
/* ========================= */

import SuperAdminDashboardPage from "./pages/superadmin/Dashboard/DashboardPage";
import SuperAdminPlannerPage from "./pages/superadmin/Planner/PlannerPage";
import SuperAdminAnalyticsPage from "./pages/superadmin/Analytics/AnalyticsPage";
import SuperAdminReportsPage from "./pages/superadmin/Reports/ReportsPage";
import SuperAdminAIPage from "./pages/superadmin/AI/AIPage";
import SuperAdminOrganizationPage from "./pages/superadmin/Organization/OrganizationPage";
import SuperAdminUsersPage from "./pages/superadmin/Users/UsersPage";
import SuperAdminRequestsPage from "./pages/superadmin/Requests/RequestsPage";
import SuperAdminSettingsPage from "./pages/superadmin/Settings/SettingsPage";

/* ========================= */
/* Sub Admin */
/* ========================= */

import SubAdminDashboardPage from "./pages/subadmin/Dashboard/DashboardPage";
import SubAdminPlannerPage from "./pages/subadmin/Planner/PlannerPage";
import SubAdminAnalyticsPage from "./pages/subadmin/Analytics/AnalyticsPage";
import SubAdminReportsPage from "./pages/subadmin/Reports/ReportsPage";
import SubAdminAIPage from "./pages/subadmin/AI/AIPage";
import SubAdminOrganizationPage from "./pages/subadmin/Organization/OrganizationPage";
import SubAdminUsersPage from "./pages/subadmin/Users/UsersPage";
import SubAdminUserActivityPage from "./pages/subadmin/Users/UserActivityPage";
import SubAdminSettingsPage from "./pages/subadmin/Settings/SettingsPage";

/* ========================= */
/* User */
/* ========================= */

import UserDashboardPage from "./pages/user/Dashboard/DashboardPage";
import UserPlannerPage from "./pages/user/Planner/PlannerPage";
import UserAnalyticsPage from "./pages/user/Analytics/AnalyticsPage";
import UserReportsPage from "./pages/user/Reports/ReportsPage";
import UserAIPage from "./pages/user/AI/AIPage";
import UserSettingsPage from "./pages/user/Settings/SettingsPage";

function App() {
  return (
    <Routes>

      {/* ========================= */}
      {/* Public Routes */}
      {/* ========================= */}

      <Route
        path="/about"
        element={<AboutPage />}
      />

      <Route
        path="/privacy"
        element={<PrivacyPage />}
      />

      <Route
        path="/contact"
        element={<ContactPage />}
      />

      <Route
        path="/terms"
        element={<TermsPage />}
      />

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/project"
        element={<ProjectShowcasePage />}
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* ========================= */}
      {/* Accept Invitation */}
      {/* ========================= */}

      <Route
        path="/accept-invitation"
        element={<AcceptInvitationPage />}
      />

      {/* ========================= */}
      {/* Super Admin */}
      {/* ========================= */}

      <Route
        path="/superadmin/dashboard"
        element={
          <ProtectedRoute>
            <SuperAdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/planner"
        element={
          <ProtectedRoute>
            <SuperAdminPlannerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/analytics"
        element={
          <ProtectedRoute>
            <SuperAdminAnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/reports"
        element={
          <ProtectedRoute>
            <SuperAdminReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/ai"
        element={
          <ProtectedRoute>
            <SuperAdminAIPage />
          </ProtectedRoute>
        }
      />

      {/* Organization */}

      <Route
        path="/superadmin/organization"
        element={
          <ProtectedRoute>
            <SuperAdminOrganizationPage tab="organizations" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/organization/organizations"
        element={
          <ProtectedRoute>
            <SuperAdminOrganizationPage tab="organizations" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/organization/users"
        element={
          <ProtectedRoute>
            <SuperAdminOrganizationPage tab="users" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/organization/requests"
        element={
          <ProtectedRoute>
            <SuperAdminOrganizationPage tab="requests" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/users"
        element={
          <ProtectedRoute>
            <SuperAdminUsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/requests"
        element={
          <ProtectedRoute>
            <SuperAdminRequestsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/settings"
        element={
          <ProtectedRoute>
            <SuperAdminSettingsPage />
          </ProtectedRoute>
        }
      />

      {/* ========================= */}
      {/* Sub Admin */}
      {/* ========================= */}

      <Route
        path="/subadmin/dashboard"
        element={
          <ProtectedRoute>
            <SubAdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subadmin/planner"
        element={
          <ProtectedRoute>
            <SubAdminPlannerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subadmin/analytics"
        element={
          <ProtectedRoute>
            <SubAdminAnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subadmin/reports"
        element={
          <ProtectedRoute>
            <SubAdminReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subadmin/ai"
        element={
          <ProtectedRoute>
            <SubAdminAIPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subadmin/organization"
        element={
          <ProtectedRoute>
            <SubAdminOrganizationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subadmin/users"
        element={
          <ProtectedRoute>
            <SubAdminUsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subadmin/users/:userId/activity"
        element={
          <ProtectedRoute>
            <SubAdminUserActivityPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subadmin/settings"
        element={
          <ProtectedRoute>
            <SubAdminSettingsPage />
          </ProtectedRoute>
        }
      />

      {/* ========================= */}
      {/* User */}
      {/* ========================= */}

      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/planner"
        element={
          <ProtectedRoute>
            <UserPlannerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/analytics"
        element={
          <ProtectedRoute>
            <UserAnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/reports"
        element={
          <ProtectedRoute>
            <UserReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/ai"
        element={
          <ProtectedRoute>
            <UserAIPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/settings"
        element={
          <ProtectedRoute>
            <UserSettingsPage />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;