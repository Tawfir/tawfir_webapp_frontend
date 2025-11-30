import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import RestaurantsPage from "./pages/admin/RestaurantsPage";
import ViewRestaurantPage from "./pages/admin/ViewRestaurantPage";
import EditRestaurantPage from "./pages/admin/EditRestaurantPage";
import NewRestaurantPage from "./pages/admin/NewRestaurantPage";
import OrdersPage from "./pages/admin/OrdersPage";
import OrderViewPage from "./pages/admin/OrderViewPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import NewCategoryPage from "./pages/admin/NewCategoryPage";
import EditCategoryPage from "./pages/admin/EditCategoryPage";
import WithdrawalsPage from "./pages/admin/WithdrawalsPage";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";

// Restaurant Pages
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";
import MenuPage from "./pages/restaurant/MenuPage";
import CreateDishPage from "./pages/restaurant/CreateDishPage";
import EditDishPage from "./pages/restaurant/EditDishPage";
import RestaurantOrdersPage from "./pages/restaurant/RestaurantOrdersPage";
import TodaysOrdersPage from "./pages/restaurant/TodaysOrdersPage";
import RestaurantProfilePage from "./pages/restaurant/RestaurantProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/orders/:id" element={<OrderViewPage />} />
          <Route path="/admin/restaurants" element={<RestaurantsPage />} />
          <Route path="/admin/restaurants/new" element={<NewRestaurantPage />} />
          <Route path="/admin/restaurants/:id" element={<ViewRestaurantPage />} />
          <Route path="/admin/restaurants/:id/edit" element={<EditRestaurantPage />} />
          <Route path="/admin/categories" element={<CategoriesPage />} />
          <Route path="/admin/categories/new" element={<NewCategoryPage />} />
          <Route path="/admin/categories/:id/edit" element={<EditCategoryPage />} />
          <Route path="/admin/withdrawals" element={<WithdrawalsPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />

          {/* Restaurant Routes */}
          <Route path="/restaurant" element={<RestaurantDashboard />} />
          <Route path="/restaurant/menu" element={<MenuPage />} />
          <Route path="/restaurant/menu/new" element={<CreateDishPage />} />
          <Route path="/restaurant/menu/:id/edit" element={<EditDishPage />} />
          <Route path="/restaurant/orders" element={<RestaurantOrdersPage />} />
          <Route path="/restaurant/orders/today" element={<TodaysOrdersPage />} />
          <Route path="/restaurant/profile" element={<RestaurantProfilePage />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
