
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthGuard from "./components/AuthGuard";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    try {
      // signal that the app mounted
      (window as any).__APP_MOUNTED = true;
      document.body.setAttribute('data-app-mounted', '1');
      console.log('APP MOUNTED');
    } catch (e) {}
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <AppLayout>
                  <Index />
                </AppLayout>
              </AuthGuard>
            }
          />
          {/* Catch any hash route that doesn't match */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
}

export default App;
