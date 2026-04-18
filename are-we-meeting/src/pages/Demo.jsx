import { useState } from "react";
import { Link } from "react-router-dom";

// Helper for dates (just like in your real Meeting page)
const formatDateTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", { 
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" 
  });
};

export default function Demo() {
  // 1. Initial Mock Data
  const [meeting] = useState({
    title: "Quarterly Design Review",
    duration_mins: 45,
    status: "voting",
    search_from: "2026-04-19",
    search_until: "2026-04-22"
  });

  const [slots, setSlots] = useState([
    { id: 101, start_utc: "2026-04-20T14:00:00Z", end_utc: "2026-04-20T14:45:00Z", votes: 4 },
    { id: 102, start_utc: "2026-04-21T10:00:00Z", end_utc: "2026-04-21T10:45:00Z", votes: 7 },
    { id: 103, start_utc: "2026-04-21T16:30:00Z", end_utc: "2026-04-21T17:15:00Z", votes: 3 }
  ]);

  const [myVote, setMyVote] = useState(null);

  // 2. Simulate Voting Logic (Local Only)
  const handleVote = (slotId) => {
    if (myVote === slotId) return; // Already voted for this

    setSlots(prev => prev.map(slot => {
      // If we're changing our vote, subtract from old and add to new
      if (slot.id === myVote) return { ...slot, votes: slot.votes - 1 };
      if (slot.id === slotId) return { ...slot, votes: slot.votes + 1 };
      return slot;
    }));
    setMyVote(slotId);
  };

  // Sort slots by votes (just like the real logic we wrote)
  const sortedSlots = [...slots].sort((a, b) => b.votes - a.votes);

  return (
    <section className="page-stack pb-20">

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" style={{marginTop:'130px'}}>
        <div className="glass-panel p-8 sm:p-10">
          <span className="eyebrow !text-cyan-400">Interactive Demo</span>
          <h1 className="section-title mt-5 tracking-[0.2em] text-white uppercase">{meeting.title}</h1>
          <p className="mt-4 max-w-2xl text-slate-300 tracking-[0.1em]">
            This is how your invitees see your meeting. They pick a time, you see the winner, and the meeting gets locked.
          </p>
          
          <div className="meetingdemo mt-8 p-5 rounded-[26px] border border-white/10 bg-slate-950/50">
            <div className="text-xs uppercase tracking-[0.1em] text-slate-500">Demo Link (Inactive)</div>
            <div className="text-sm mt-2 text-slate-400 italic" style={{fontWeight:'500'}}>https://are-we-meeting.com/invite/demo-123</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="stat-card" style={{marginTop:'10px'}}>
            <div className="text-sm text-slate-400 tracking-[0.1em]">Total Participants</div>
            <div className="mt-2 text-xl font-extrabold text-white tracking-[0.1em] italic">14 Members</div>
          </div>
          <div className="stat-card" style={{marginTop:'10px'}}>
            <div className="text-sm text-slate-400 tracking-[0.1em]">Status</div>
            <div className="mt-2 text-xl font-extrabold text-cyan-400 tracking-[0.1em] uppercase italic">Live Voting</div>
          </div>
        </div>
      </div>

      {/* PROPOSED SLOTS SECTION */}
      <div className="meetingdemo glass-card p-8 mt-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white italic tracking-tighter" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            WHICH WORKS BEST?
          </h2>
          <div className="text-xs text-slate-500 uppercase tracking-widest" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Click to simulate a vote</div>
        </div>

        <div className="grid gap-4">
          {sortedSlots.map((slot, index) => {
            const isTopChoice = index === 0;
            const hasMyVote = myVote === slot.id;

            return (
              <div 
                key={slot.id} 
                onClick={() => handleVote(slot.id)}
                className={`cursor-pointer rounded-[24px] border p-6 transition-all duration-500 ${
                  hasMyVote 
                    ? 'bg-cyan-500/10 border-cyan-500/50 ring-1 ring-cyan-500/50' 
                    : 'bg-white/[0.03] border-white/8 hover:border-white/20'
                }`} style={{marginBottom:'10px'}}
              >
                <div className="meetingdemo flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" >
                  <div>
                    <div className="flex items-center gap-3" > 
                      <span className={`text-[15px] uppercase tracking-[0.2em] font-bold ${isTopChoice ? 'text-cyan-400' : 'text-slate-500'}`} style={{marginBottom:'10px'}}>
                        {isTopChoice ? '🏆 Leading Option' : `Option ${index + 1}`}
                      </span>
                      {hasMyVote && <span className="text-[15px] bg-cyan-500 text-black px-2 py-0.5 rounded-full font-bold uppercase" style={{marginLeft:'10px'}}>Selected</span>}
                    </div>
                    <div className="mt-2 text-lg font-bold text-white tracking-tight">
                      {formatDateTime(slot.start_utc)}
                    </div>
                    <div className="text-sm text-slate-400">
                      Duration: {meeting.duration_mins} mins
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 text-right">
                      <div className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold" style={{marginRight:'5px'}}>Total Votes</div>
                      <div className="text-2xl font-black text-white leading-none" style={{marginRight:'5px'}}>{slot.votes}</div>
                    </div>
                    <div className={`primary-button w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                      hasMyVote ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-white/10 text-white'
                    }`}>
                      {hasMyVote ? 'Confirmed' : 'Confirm'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}