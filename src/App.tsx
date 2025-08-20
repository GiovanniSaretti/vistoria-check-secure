import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "./components/auth/AuthGuard";
import Dashboard from "./pages/app/Dashboard";
import InspectionDetail from "./pages/app/InspectionDetail";
import PublicVerify from "./pages/PublicVerify";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/p/:token" element={<PublicVerify />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
          <Route path="/app" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
          <Route path="/app/inspections/:id" element={
            <AuthGuard>
              <InspectionDetail />
            </AuthGuard>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;