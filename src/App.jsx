import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import NewGuidePage from "./pages/NewGuidePage.jsx";
import GuideModal from "./components/GuideModal.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthCallbackPage from "./pages/AuthCallbackPage.jsx";
import InquiryPage from "./pages/InquiryPage.jsx";
import ReportGuidePage from "./pages/ReportGuidePage.jsx";
import MyGuidesPage from "./pages/MyGuidesPage.jsx";
import AdminModerationPage from "./pages/AdminModerationPage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route path="guide/:id" element={<GuideModal />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      <Route
        path="/guides/:id/inquiry"
        element={
          <ProtectedRoute>
            <InquiryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guides/:id/report"
        element={
          <ProtectedRoute>
            <ReportGuidePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-guides"
        element={
          <ProtectedRoute>
            <MyGuidesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/moderation"
        element={
          <AdminRoute>
            <AdminModerationPage />
          </AdminRoute>
        }
      />

      <Route
        path="/guides/new"
        element={
          <ProtectedRoute>
            <NewGuidePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
