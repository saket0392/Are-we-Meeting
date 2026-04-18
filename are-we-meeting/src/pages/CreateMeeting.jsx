import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createMeeting } from "../services/api";

export default function CreateMeeting() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [emails, setEmails] = useState("");
  const [durationMins, setDurationMins] = useState(30);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchUntil, setSearchUntil] = useState("");
  const [loading, setLoading] = useState(false);

  const invitees = emails
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!title || !emails || !searchFrom || !searchUntil || !durationMins) {
      alert("Please fill all fields");
      return;
    }
    if (searchFrom > searchUntil) {
      alert("Search end date must be after the start date");
      return;
    }
    setLoading(true);
    try {
      const data = await createMeeting({
        title,
        duration_mins: Number(durationMins),
        search_from: searchFrom,
        search_until: searchUntil,
        invitee_emails: invitees,
      });
      // Fixed: API returns meeting object directly, id is on data.id
      const meetingId = data?.id || data?.meeting?.id;
      navigate(`/meeting/${meetingId}`);
    } catch (err) {
      console.error(err);
      if (err.message === "Invalid or expired token" || err.message === "Invalid user") {
        navigate("/auth");
      }
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-stack">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-panel p-8 sm:p-10" style={{marginTop:"125px" , marginBottom:"20px"}}>
          <span className="eyebrow">Organizer workflow</span>
          <h1 className="section-title mt-5 tracking-[0.2em] text-cyan-200/80 uppercase">Create a meeting people can actually respond to.</h1>
          <p className="mt-4 max-w-2xl text-slate-300 tracking-[0.1em] text-cyan-200/80 ">
            Define the search window, invite the right people, and let the system
            generate a focused set of candidate slots instead of endless back-and-forth.
          </p>
          <div className="mt-8 space-y-5">
            <div>
              <label className="surface-label tracking-[0.2em] text-cyan-200/80 uppercase">Meeting title</label>
              <input
                type="text"
                placeholder="Q2 roadmap review"
                className="surface-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="surface-label tracking-[0.2em] text-cyan-200/80 uppercase" style={{marginTop:'10px'}}>Invitee emails</label>
              <textarea
                placeholder="alex@company.com, rina@company.com"
                className="surface-input min-h-32 resize-none"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
              <p className="mt-2 text-sm text-slate-400 tracking-[0.2em] text-cyan-200/80 uppercase" style={{fontWeight:'1000'}}>
                Separate addresses with commas.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="surface-label tracking-[0.2em] text-cyan-200/80 uppercase" >Duration (mins)</label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  className="surface-input"
                  value={durationMins}
                  onChange={(e) => setDurationMins(e.target.value)}
                />
              </div>
              <div>
                <label className="surface-label tracking-[0.2em] text-cyan-200/80 uppercase" style={{marginTop:'10px'}}>Search from</label>
                <input
                  type="date"
                  className="surface-input"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="surface-label tracking-[0.2em] text-cyan-200/80 uppercase" style={{marginTop:'10px'}}>Search until</label>
                <input
                  type="date"
                  className="surface-input"
                  value={searchUntil}
                  onChange={(e) => setSearchUntil(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="primary-button mt-8 w-full sm:w-auto" style={{marginTop:'10px'}}>
            {loading ? "Generating meeting..." : "Generate meeting options"}
          </button>
        </div>
        {/* --- RIGHT COLUMN (Replace your existing space-y-6 div with this) --- */}
        <div className="space-y-6 lg:sticky lg:top-[130px] h-fit">
          
          {/* 1. MEETING BRIEF (Styled like the Homepage Radar) */}
          <div className="glass-panel p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden" style={{marginBottom:'20px'}}>
            
            {/* Subtle background glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between">
              <span className="text-[2rem] font-bold tracking-[0.2em] text-cyan-200/80 uppercase">
                Summary
              </span>
            </div>

            <h3 className="text-[1.5rem] font-bold text-white tracking-tight leading-none" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Meeting brief
            </h3>

            {/* Voting Slots Container */}
            <div className="flex flex-col gap-3" style={{marginBottom:'5px'}}>
              
              {/* Title Slot (Highlighted) */}
              <div className="meetingdemo bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 flex flex-col transition-transform hover:-translate-y-1">
                <span className="text-cyan-300 text-[11px] font-bold uppercase tracking-wider mb-1 tracking-[0.2em] text-cyan-200/80 uppercase">
                  Title
                </span>
                <span className="text-white font-semibold tracking-[0.2em] text-cyan-200/80 uppercase">
                  {title || "Your meeting title will appear here"}
                </span>
              </div>

              {/* Participants Slot */}
              <div className="meetingdemo bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col transition-transform hover:-translate-y-1 tracking-[0.2em] text-cyan-200/80 uppercase">
                <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
                  Participants
                </span>
                <span className="text-slate-200 font-medium">
                  {invitees.length} invitee{invitees.length === 1 ? "" : "s"}
                </span>
              </div>

              {/* Window Slot */}
              <div className="meetingdemo bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col transition-transform hover:-translate-y-1 tracking-[0.2em] text-cyan-200/80 uppercase">
                <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
                  Search Window
                </span>
                <span className="text-slate-200 font-medium">
                  {searchFrom || "Start date"} <span className="text-slate-500 mx-2">→</span> {searchUntil || "End date"}
                </span>
              </div>

            </div>
          </div>

          {/* 2. WHAT HAPPENS NEXT */}
          <div className="glass-panel p-6 sm:p-8" style={{marginBottom:'20px'}}>
            <span className="text-[2rem] font-bold text-white mb-5 tracking-[0.2em] text-cyan-200/80 uppercase" style={{ fontFamily: '"Space Grotesk", sans-serif'}}>
              What happens next
            </span>
            
            <div className="flex flex-col gap-3 tracking-[0.2em] text-cyan-200/80 uppercase">
              {[
                "1. We save the meeting metadata and participants.",
                "2. The backend calculates overlapping availability windows.",
                "3. You get a shareable invite page where participants can vote.",
              ].map((step) => (
                <div key={step} className="meetingdemo bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-300">
                  {step}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}