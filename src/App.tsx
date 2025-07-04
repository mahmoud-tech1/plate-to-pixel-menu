
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageRestaurants from "./pages/admin/ManageRestaurants";
import RestaurantLogin from "./pages/restaurant/RestaurantLogin";
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";
import RestaurantMenu from "./pages/RestaurantMenu";
import RestaurantsPage from "./pages/RestaurantsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ad-login" element={<AdminLogin />} />
          <Route path="/ad-dashboard" element={<AdminDashboard />} />
          <Route path="/ad-dashboard/manage-restaurants" element={<ManageRestaurants />} />
          <Route path="/login" element={<RestaurantLogin />} />
          <Route path="/res-dashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/:restaurantName" element={<RestaurantMenu />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
