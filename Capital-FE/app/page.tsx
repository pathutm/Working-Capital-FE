"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`http://localhost:5000/api/organizations/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage(data.message);
      
      // Store organization info in localStorage for dynamic access
      if (data.organization && data.organization.id) {
        localStorage.setItem("organizationId", data.organization.id);
        localStorage.setItem("organizationName", data.organization.name);
      }
      
      console.log("Logged in:", data.organization);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-background">
      <div className="card-surface w-full max-w-md p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-4xl text-primary font-bold tracking-tight">CapFlow</h1>
          <p className="text-foreground/60">Working Capital</p>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">Organization Login</h2>
            <p className="text-sm text-foreground/40">Enter your credentials to access your dashboard</p>
          </div>

          {error && <div className="p-3 text-sm bg-error/10 text-error border border-error/20 rounded-sm">{error}</div>}
          {message && <div className="p-3 text-sm bg-accent/10 text-primary border border-accent/20 rounded-sm">{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Email Address</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@organization.com"
                className="w-full px-4 py-2 border border-border rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Password</label>
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-12 flex items-center justify-center space-x-2 text-base shadow-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-foreground/40 pt-4">
          By signing in, you agree to CapFlow's Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
