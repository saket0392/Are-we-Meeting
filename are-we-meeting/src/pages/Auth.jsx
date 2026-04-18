import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
// Assuming your api path is correct, keep this import!
import { login, register } from "../services/api";

function guessTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
  } catch {
    return "Asia/Kolkata";
  }
}

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    timezone: guessTimezone(),
  });

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setSearchParams({ mode: nextMode });
  };

  useEffect(() => {
    const paramMode = searchParams.get("mode");
    if (paramMode === "login" || paramMode === "register") {
      setMode(paramMode);
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!form.email || !form.password || (mode === "register" && !form.name)) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        await register(form);
      }

      const data = await login({
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", data.token);
      navigate("/create");
    } catch (err) {
      console.error(err);
      alert(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Max-width constrains the form so it doesn't stretch wildly on large monitors
    <div className="max-w-5xl mx-auto w-full">
      <section className="grid gap-6 lg:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        
        {/* --- LEFT PANEL: Welcome Info --- */}
        <div className="glass-panel relative overflow-hidden flex flex-col justify-between p-8 sm:p-10" style={{ marginTop:'120px' , marginBottom:'10px'}}>
          
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <span className="eyebrow">Team scheduling workspace</span>
            <h1 className="text-[2rem] sm:text-[2.5rem] font-extrabold text-white leading-[1.1] mt-6 tracking-tight tracking-[0.1em] text-cyan-200/80 uppercase" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {mode === "login" ? "Welcome back to the command center." : "Start scheduling smarter."}
            </h1>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-slate-400 max-w-sm tracking-[0.1em] text-cyan-200/80">
              Organizers can generate overlap-based options, while invitees get a calm voting experience instead of a messy thread.
            </p>
          </div>

          <div className="relative z-10 mt-10 flex flex-col gap-3 tracking-[0.1em] text-cyan-200/80 uppercase">
            {[
              "Fast sign-in with automatic token handling",
              "Timezone-aware registration defaults",
              "A cleaner handoff from setup to meeting creation",
            ].map((item) => (
              <div key={item} className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4 transition-colors hover:bg-white/[0.04]" style={{padding:'5px',fontWeight:'700'}}>
                {/* Glowing Bullet Point */}
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                <span className="text-sm font-medium text-slate-300 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT PANEL: Form --- */}
        <div className="glass-panel p-8 sm:p-10" style={{marginBottom:'20px'}}>
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-cyan-200/70">
                Secure access
              </div>
              <h2 className="mt-2 text-3xl font-bold text-white tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                {mode === "login" ? "Sign in" : "Register"}
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            {mode === "register" && (
              <div>
                <label className="surface-label tracking-[0.1em] text-cyan-200/80">Full name</label>
                <input
                  type="text"
                  placeholder="Ava Thompson"
                  className="surface-input w-full"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="surface-label tracking-[0.1em] text-cyan-200/80">Email</label>
              <input
                type="email"
                placeholder="team@company.com"
                className="surface-input w-full"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div>
              <label className="surface-label tracking-[0.1em] text-cyan-200/80">Password</label>
              <input
                type="password"
                placeholder="Enter a secure password"
                className="surface-input w-full"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
              />
            </div>

            {mode === "register" && (
              <div>
                <label className="surface-label tracking-[0.1em] text-cyan-200/80">Timezone</label>
                <input
                  type="text"
                  placeholder="Asia/Kolkata"
                  className="surface-input w-full"
                  value={form.timezone}
                  onChange={(e) => updateField("timezone", e.target.value)}
                />
              </div>
            )}
          </div>

          <button onClick={handleSubmit} disabled={loading} className="primary-button mt-8 w-full py-3.5 text-[1.05rem]" style={{marginTop:'10px'}}>
            {loading
              ? mode === "login"
                ? "Signing in..."
                : "Creating your workspace..."
              : mode === "login"
                ? "Continue to dashboard"
                : "Create account"}
          </button>

          <p className="mt-5 text-sm text-slate-400 text-center">
            {mode === "login"
              ? "New here? Switch to register and we’ll sign you in right after setup."
              : "Already have an account? Switch back to login anytime."}
          </p>

          <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400" style={{marginTop:'5px'}}>
            <Link to="/" className="secondary-button" style={{marginTop:'10px'}}>
              ← Back to home
            </Link>
            <button
              type="button"
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
              className="primary-button" style={{marginTop:'10px'}}
            >
              {mode === "login" ? "Need to sign up?" : "Already have an account?"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}