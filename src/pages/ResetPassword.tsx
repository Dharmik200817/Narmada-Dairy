import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setHasSession(!!data.session);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // If user has an active session (after following magic link), update password
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage("Password updated. You will be redirected to login.");
      setTimeout(() => navigate("/login"), 1400);
    } catch (err: any) {
      setMessage(err.message || "Failed to update password. Ensure you used the link from email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Set a new password</h1>
        {!hasSession && (
          <p className="mb-4 text-sm">You must follow the password reset link in your email first. It will authenticate you and allow setting a new password.</p>
        )}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            <span className="text-sm">New password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded border px-3 py-2"
              placeholder="Choose a strong password"
            />
          </label>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded" disabled={loading || !hasSession}>
            {loading ? "Updating…" : "Set password"}
          </button>
        </form>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </div>
  );
}
