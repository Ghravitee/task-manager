import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { RouteLoadingProvider } from "./context/RouteLoadingContext";
import { useRouteLoading } from "./hooks/useRouteLoading";
import { PageTransitionLoader } from "./components/PageTransitionLoader";
import { ToastContainer } from "./components/ToastContainer";
import { RouteError } from "./components/RouteError";
import { ProtectedRoute } from "./components/ProtectedRoute";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const WorkspacePage = lazy(() => import("./pages/WorkspacePage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const TaskPage = lazy(() => import("./pages/TaskPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const WorkspaceMembersPage = lazy(() => import("./pages/WorkspaceMembersPage"));
const InvitePage = lazy(() => import("./pages/InvitePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// ─── App Shell ─────────────────────────────────────────────────

function AppShell() {
  const isRouteLoading = useRouteLoading();

  return (
    <>
      <PageTransitionLoader isLoading={isRouteLoading} />
      <ToastContainer />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </>
  );
}

// ─── Router ────────────────────────────────────────────────────

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RouteLoadingProvider>
        <AppShell />
      </RouteLoadingProvider>
    ),
    errorElement: <RouteError />,
    children: [
      // ── Public routes ─────────────────────────────────────
      { index: true, element: <Landing /> },
      { path: "login", element: <Login /> },
      { path: "invite/:token", element: <InvitePage /> },

      // ── Protected routes ──────────────────────────────────
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "workspace/:workspaceId", element: <WorkspacePage /> },
          {
            path: "workspace/:workspaceId/project/:projectId",
            element: <ProjectPage />,
          },
          {
            path: "workspace/:workspaceId/project/:projectId/task/:taskId",
            element: <TaskPage />,
          },
          { path: "profile", element: <ProfilePage /> },
          {
            path: "workspace/:workspaceId/members",
            element: <WorkspaceMembersPage />,
          },
        ],
      },

      // ── Fallback ──────────────────────────────────────────
      { path: "*", element: <NotFound /> },
    ],
  },
]);

// ─── Root ──────────────────────────────────────────────────────

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
