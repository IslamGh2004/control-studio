import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Library from "./pages/Library";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Categories from "./pages/Categories";
import Books from "./pages/Books";
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import BooksManagement from "./components/admin/BooksManagement";
import CategoriesManagement from "./components/admin/CategoriesManagement";
import AuthorsManagement from "./components/admin/AuthorsManagement";
import UsersManagement from "./components/admin/UsersManagement";
import SettingsManagement from "./components/admin/SettingsManagement";
import ReportsManagement from "./components/admin/ReportsManagement";
import NotificationsManagement from "./components/admin/NotificationsManagement";
import LogsManagement from "./components/admin/LogsManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/auth" element={<Layout><Auth /></Layout>} />
            <Route path="/library" element={<Layout requireAuth><Library /></Layout>} />
            <Route path="/favorites" element={<Layout requireAuth><Favorites /></Layout>} />
            <Route path="/profile" element={<Layout requireAuth><Profile /></Layout>} />
            <Route path="/settings" element={<Layout requireAuth><Settings /></Layout>} />
            <Route path="/categories" element={<Layout><Categories /></Layout>} />
            <Route path="/books" element={<Layout><Books /></Layout>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="books" element={<BooksManagement />} />
              <Route path="categories" element={<CategoriesManagement />} />
              <Route path="authors" element={<AuthorsManagement />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="settings" element={<SettingsManagement />} />
              <Route path="reports" element={<ReportsManagement />} />
              <Route path="notifications" element={<NotificationsManagement />} />
              <Route path="logs" element={<LogsManagement />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
