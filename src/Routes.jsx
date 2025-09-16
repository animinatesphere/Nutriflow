import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UserLogin from "./pages/user-login";
import MealPlanningPage from "./pages/meal-planning";
import LandingPage from "./pages/landing-page";
import UserDashboard from "./pages/user-dashboard";
import UserRegistration from "./pages/user-registration";
import CookingGames from "./pages/cooking-games";
import AdminGames from "pages/admin/games";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Landing Page as Homepage */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/meal-planning" element={<MealPlanningPage />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user-registration" element={<UserRegistration />} />
          <Route path="/cooking-games" element={<CookingGames />} />
          <Route path="/admin" element={<AdminGames />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
