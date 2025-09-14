import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/Narmada-Dairy/reset-password",
      });
      if (error) throw error;
      setMessage("Check your email for reset instructions.");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err: any) {
      setMessage(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Reset password</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            <span className="text-sm">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded border px-3 py-2"
              placeholder="you@example.com"
            />
          </label>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? "Sending…" : "Send reset email"}
          </button>
        </form>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </div>
  );
}
