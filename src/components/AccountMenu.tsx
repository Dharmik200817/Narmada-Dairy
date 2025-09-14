import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AccountMenu() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    // page will be redirected by AuthGuard
  };

  if (!email) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-700">{email}</span>
      <button onClick={signOut} className="text-sm px-2 py-1 bg-gray-100 rounded">Sign out</button>
    </div>
  );
}
