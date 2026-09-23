import { Routes, Route } from "react-router-dom";
import QuickHomeButton from "./components/QuickHomeButton.jsx";
import QuickBackButton from "./components/QuickBackButton.jsx";
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
import GuideInboxPage from "./pages/GuideInboxPage.jsx";
import ProposalPage from "./pages/ProposalPage.jsx";
import MyTripsPage from "./pages/MyTripsPage.jsx";
import TripPlanPage from "./pages/TripPlanPage.jsx";

function App() {
  return (
    <>
      <QuickHomeButton />
      <QuickBackButton />
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
        path="/my-trips"
        element={<ProtectedRoute><MyTripsPage /></ProtectedRoute>}
      />
      <Route
        path="/guide-inbox"
        element={<ProtectedRoute><GuideInboxPage /></ProtectedRoute>}
      />
      <Route
        path="/guide-inbox/:inquiryId/proposal"
        element={<ProtectedRoute><ProposalPage /></ProtectedRoute>}
      />
      <Route
        path="/trips/proposals/:proposalId/plan"
        element={<ProtectedRoute><TripPlanPage /></ProtectedRoute>}
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
    </>
  );
}

export default App;
