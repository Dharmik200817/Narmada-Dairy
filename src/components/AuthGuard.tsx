import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        // Wait a bit for session to potentially be available after login redirect
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        
        const session = data.session;
        console.info("AuthGuard check:", { 
          hasSession: !!session, 
          pathname: window.location.pathname,
          href: window.location.href 
        });
        
        if (session) {
          setAuthed(true);
        } else {
          setAuthed(false);
          // Check if we're on login page (with hash routing)
          const currentPath = window.location.hash.slice(1) || "/";
          const isOnLogin = currentPath === "/login" || currentPath.endsWith("/login");
          
          if (!isOnLogin) {
            // store intended path for hash routing
            try {
              sessionStorage.setItem('post_auth_redirect', currentPath);
            } catch (e) {}
            navigate("/login", { replace: true });
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setLoading(false);
      }
    };
    check();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.info("Auth state change:", event, !!session);
      
      if (event === 'SIGNED_IN' && session) {
        setAuthed(true);
        setLoading(false);
      } else if (event === 'SIGNED_OUT' || !session) {
        setAuthed(false);
        // Only redirect if we're not already on login
        const currentPath = window.location.hash.slice(1) || "/";
        const isOnLogin = currentPath === "/login" || currentPath.endsWith("/login");
        
        if (!isOnLogin) {
          try {
            sessionStorage.setItem('post_auth_redirect', currentPath);
          } catch (e) {}
          navigate("/login", { replace: true });
        }
      }
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) return <div className="p-6">Checking authentication…</div>;
  if (!authed) return null; // redirect already handled

  return <>{children}</>;
}
