import { Link } from "react-router-dom";

export default function Home() {
  const hasToken = Boolean(localStorage.getItem("token"));
  const primaryTarget = hasToken ? "/create" : "/auth";
  const primaryLabel = hasToken ? "Launch Meeting Planner" : "Login to continue";
  const secondaryTarget = hasToken ? "#product-flow" : "/auth?mode=register";

  return (
    <div className="page-stack">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="flex flex-col gap-7 h-full">
          <div className="fixed top-[110px] z-[90] self-start"> 
          <span className="eyebrow bg-[#0f1720]/80 backdrop-blur-md shadow-md" style={{marginTop:'10px'}}>
            Built for fast-moving teams
        </span>
        </div>
          <div className="space-y-5" style={{marginTop: '120px'}}>
            <h1 className="page-title">
              Calendar coordination without the usual chaos.
            </h1>
            <p className="hero-kicker">
              Create meetings, invite your team, surface the best time slots,
              and keep everyone aligned in one crisp workflow.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to={primaryTarget} className="primary-button">
              {primaryLabel}
            </Link>
            {hasToken ? (
              <a href={secondaryTarget} className="secondary-button" style={{marginTop:'10px'}}>
                See the product flow
              </a>
            ) : (
              <Link to="/auth?mode=register" className="secondary-button" style={{marginTop : '10px'}}>
                Create an account
              </Link>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="stat-card" style={{marginTop : '20px'}}>
              <div className="metric-number" >3 min</div>
              <p className="mt-2 text-sm text-slate-300">
                Typical setup time for a new group scheduling request.
              </p>
            </div>
            <div className="stat-card" style={{marginTop : '10px'}}>
              <div className="metric-number">Auto</div>
              <p className="mt-2 text-sm text-slate-300">
                Proposed slots generated from participant overlap.
              </p>
            </div>
            <div className="stat-card" style={{marginTop : '10px'}}>
              <div className="metric-number">Clear</div>
              <p className="mt-2 text-sm text-slate-300">
                Invite pages designed for quick yes-or-no decisions.
              </p>
            </div>
          </div>
        </div>

       
        {/* RIGHT SIDE: Meeting Radar Card */}
        <div className="glass-panel p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden h-fit" style={{marginTop:'20px'}}>
          
          {/* Subtle background glow for that "radar" tech vibe */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Card Header */}
          <div className="flex items-center justify-between">
            <span className="text-[2rem] font-bolder tracking-[0.2em] text-cyan-200/80 uppercase">
              Meeting Radar
            </span>
            <span className="text-white text-[15px] font-semibold px-3 py-1 tracking-[0.2em] text-cyan-200/80 uppercase  ">
              6 participants
            </span>
          </div>

          {/* Meeting Title */}
          <h3 className="text-[1.5rem] font-bold text-white tracking-tight leading-none tracking-[0.2em] text-cyan-200/80 uppercase">
            Monday design sync
          </h3>

          {/* Voting Slots Container */}
          <div className="flex flex-col gap-3">
            
            {/* Slot 1: The Winner */}
            <div className="meetingdemo bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 flex items-center justify-between transition-transform hover:-translate-y-1">
              <div className="flex flex-col">
                <span className="text-cyan-300 text-[11px] font-bold uppercase tracking-wider mb-1 tracking-[0.2em] text-cyan-200/80 uppercase">
                  Best overlap
                </span>
                <span className="text-white font-semibold tracking-[0.2em] text-cyan-200/80 uppercase">Tue, 3:30 PM</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Visual Vote Bar */}
                <div className="h-1.5 w-12 bg-black/20 rounded-full overflow-hidden hidden sm:block">
                  <div className="h-full bg-cyan-400 w-full rounded-full" />
                </div>
                <span className="text-white font-bold tracking-[0.2em] text-cyan-200/80 uppercase">4 votes</span>
              </div>
            </div>

            {/* Slot 2: Fallback */}
            <div className="meetingdemo bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between transition-transform hover:-translate-y-1">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1 tracking-[0.2em] text-cyan-200/80 uppercase">
                  Fallback option
                </span>
                <span className="text-slate-200 font-medium tracking-[0.2em] text-cyan-200/80 uppercase">Wed, 11:00 AM</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-12 bg-black/20 rounded-full overflow-hidden hidden sm:block">
                  <div className="h-full bg-slate-400 w-[75%] rounded-full" />
                </div>
                <span className="text-slate-300 font-medium tracking-[0.2em] text-cyan-200/80 uppercase">3 votes</span>
              </div>
            </div>

            {/* Slot 3: Last Resort */}
            <div className=" meetingdemo bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between opacity-60 transition-opacity hover:opacity-100">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1 tracking-[0.2em] text-cyan-200/80 uppercase">
                  Last possible slot
                </span>
                <span className="text-slate-300 font-medium tracking-[0.2em] text-cyan-200/80 uppercase">Thu, 6:00 PM</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-12 bg-black/20 rounded-full overflow-hidden hidden sm:block">
                  <div className="h-full bg-slate-600 w-[50%] rounded-full" />
                </div>
                <span className="text-slate-400 font-medium tracking-[0.2em] text-cyan-200/80 uppercase">2 votes</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      
      
      <section className="mt-24 sm:mt-32">
        <div className="grid gap-6 md:grid-cols-3">
          
          
          <div className="meetingdemo glass-card p-8 flex flex-col gap-4 relative overflow-hidden group transition-transform hover:-translate-y-1"
            style={{marginBottom:'10px'}}
            >
            
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-[1.25rem] font-bold text-white tracking-tight tracking-[0.2em] text-cyan-200/80 uppercase">
              Create with confidence
            </h3>
            <p className="text-slate-400 leading-relaxed tracking-[0.1em] text-cyan-200/80 ">
              Add invitees, define the search window, and generate proposals with enough structure for real teams.
            </p>
          </div>

         
          <div className="meetingdemo glass-card p-8 flex flex-col gap-4 relative overflow-hidden group transition-transform hover:-translate-y-1"
            style={{marginBottom:'10px'}}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-[1.25rem] font-bold text-white tracking-tight tracking-[0.2em] text-cyan-200/80 uppercase">
              Share a clean voting page
            </h3>
            <p className="text-slate-400 leading-relaxe tracking-[0.1em] text-cyan-200/80 ">
              Participants get one focused action: review the candidate slots and choose what works.
            </p>
          </div>

         
          <div className="meetingdemo glass-card p-8 flex flex-col gap-4 relative overflow-hidden group transition-transform hover:-translate-y-1"
              style={{marginBottom:"10px"}}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-[1.25rem] font-bold text-white tracking-tight tracking-[0.2em] text-cyan-200/80 uppercase">
              See the signal quickly
            </h3>
            <p className="text-slate-400 leading-relaxed tracking-[0.1em] text-cyan-200/80 ">
              Meeting pages highlight the strongest options so organizers can make fast decisions without the noise.
            </p>
          </div>

        </div>
      </section>

      {/* --- FINAL CALL TO ACTION SECTION --- */}
      <section className="mt-24 sm:mt-32 mb-20">
        <div className="glass-panel p-10 sm:p-16 text-center flex flex-col items-center justify-center relative overflow-hidden" style={{marginBottom:'10px'}}>
          
          {/* Centered background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/10 to-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            <span className="eyebrow mb-6">Ready to move</span>
            
            <h2 className="text-[2.5rem] sm:text-[3.5rem] font-extrabold text-white leading-[1.1] tracking-tight mb-8" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Jump into the scheduling flow
            </h2>
            
            {/* YOUR DYNAMIC LOGIC APPLIED HERE */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              
              {/* Primary Button */}
              <Link 
                to={hasToken ? "/create" : "/auth?mode=login"} 
                className="primary-button w-full sm:w-auto text-[1.1rem] px-8 py-4" style={{marginBottom:'10px'}}
              >
                {hasToken ? "Create a meeting" : "Open login"}
              </Link>

              {/* Secondary Button */}
              {hasToken ? (
                <Link 
                  to="/auth?mode=login" 
                  className="secondary-button w-full sm:w-auto text-[1.1rem] px-8 py-4"
                >
                  Account access
                </Link>
              ) : (
                <Link 
                  to="/auth?mode=register" 
                  className="secondary-button w-full sm:w-auto text-[1.1rem] px-8 py-4"
                >
                  Sign up first
                </Link>
              )}
              
            </div>
          </div>
          
        </div>
      </section>
      </div>
)
}