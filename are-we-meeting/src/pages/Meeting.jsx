import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// 1. Added getVotes to the imports!
import { getMeeting, confirmMeeting, getVotes } from "../services/api";

const formatDateString = (dateStr) => {
  if (!dateStr) return "TBD";
  const d = new Date(dateStr);
  return isNaN(d) ? dateStr : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function Meeting() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  
  // 2. Added a state to hold the votes
  const [votes, setVotes] = useState([]);
  
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    // 3. Fetch BOTH the meeting details and the votes at the same time
    Promise.all([getMeeting(id), getVotes(id)])
      .then(([meetingData, votesData]) => {
        setMeeting(meetingData);
        setVotes(votesData || []); // Save the votes to state
      })
      .catch((err) => setError(err.message || "Failed to load data"));
  }, [id]);

  if (error) return <div className="text-white p-6">{error}</div>;
  if (!meeting) return <div className="text-white p-6">Loading...</div>;

  const meetingDetails = Array.isArray(meeting.meeting) ? meeting.meeting[0] : meeting.meeting;
  const rawProposedSlots = meeting.proposed_slots || [];
  const inviteUrl = `${window.location.origin}/invite/${id}`;

  if (!meetingDetails) return <div className="text-white p-6">Meeting not found</div>;

  // 4. Helper function to count how many votes a specific slot got
  const getVoteCount = (slotId) => {
  return votes.filter(v => Number(v.proposed_slot_id) === Number(slotId)).length;
  };

  // 5. Sort the slots so the one with the MOST votes is always at the top!
  const sortedSlots = [...rawProposedSlots].sort((a, b) => getVoteCount(b.id) - getVoteCount(a.id));

  const handleConfirm = async (slotId) => {
    setConfirming(true);
    try {
      await confirmMeeting(id, slotId);
      setConfirmed(true);
      // Refresh data after confirming
      const updatedMeeting = await getMeeting(id);
      setMeeting(updatedMeeting);
    } catch (err) {
      alert(err.message || "Could not confirm meeting");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <section className="page-stack">

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" style={{marginTop:'120px'}}>
        <div className="glass-panel p-8 sm:p-10">
          <span className="eyebrow">Meeting overview</span>
          <h1 className="section-title mt-5 tracking-[0.2em] text-cyan-200/80 uppercase">{meetingDetails.title}</h1>
          <p className="mt-4 max-w-2xl text-slate-300 tracking-[0.1em] text-cyan-200/80">
            Review the generated options, share the invite page, and watch the strongest slot emerge.
          </p>
          <div className="meetingdemo mt-8 rounded-[26px] border border-white/10 bg-slate-950/70 p-5">
            <div className="text-[1.5rem] text-sm uppercase tracking-[0.22em] text-slate-400 tracking-[0.1em] text-cyan-200/80 uppercase" style={{fontWeight:'500'}} >Share invite page</div>
            <div className="text-[1rem] mt-3 break-all text-base text-stone-100 tracking-[0.2em] text-cyan-200/80 ">{inviteUrl}</div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row" style={{marginTop:'10px'}}>
              <button
                type="button"
                className="primary-button"
                onClick={async () => {
                  await navigator.clipboard.writeText(inviteUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                }}
              >
                {copied ? "Copied" : "Copy invite link"}
              </button>
              <a href={inviteUrl} className="secondary-button" style={{marginTop:'10px'}}>Open invite page</a>
              <Link to="/create" className="ghost-button" style={{marginTop:'10px' , marginBottom:'10px'}}>New meeting</Link>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="stat-card" style={{marginTop:'10px'}}>
            <div className="text-sm text-slate-400 tracking-[0.1em] text-cyan-200/80">Status</div>
            <div className="mt-2 text-xl font-semibold text-stone-50 capitalize tracking-[0.1em] text-cyan-200/80" style={{fontWeight:'800'}}>
              {meetingDetails.status}
              {(confirmed || meetingDetails.status === 'confirmed') && <span className="ml-2 text-emerald-300">✓ Locked</span>}
            </div>
          </div>
          <div className="stat-card" style={{marginTop:'10px'}}>
            <div className="text-sm text-slate-400 tracking-[0.1em] text-cyan-200/80">Total Votes Cast</div>
            <div className="mt-2 text-xl font-semibold text-stone-50 tracking-[0.1em] text-cyan-200/80" style={{fontWeight:'800'}}>
              {votes.length} votes
            </div>
          </div>
          <div className="stat-card" style={{marginTop:'10px'}}>
            <div className="text-sm text-slate-400 tracking-[0.1em] text-cyan-200/80">Search window</div>
            <div className="mt-2 text-xl font-semibold text-stone-50 tracking-[0.1em] text-cyan-200/80" style={{fontWeight:'800'}}>
              {formatDateString(meetingDetails.search_from)} → {formatDateString(meetingDetails.search_until)}
            </div>
          </div>
        </div>
      </div>

      <div className="meetingdemo glass-card p-8" style={{marginBottom:'20px'}}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[1.5rem] text-sm uppercase tracking-[0.22em] text-slate-400  tracking-[0.2em] text-cyan-200/80 ">Proposed slots</div>
            <h2 className="mt-2 text-2xl font-bold text-stone-50  tracking-[0.1em] text-cyan-200/80" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Best available windows
            </h2>
          </div>
          <div className="rounded-full bg-white/[0.03] px-4 py-2 text-sm text-slate-300 tracking-[0.1em] text-cyan-200/80">
            {sortedSlots.length} option{sortedSlots.length === 1 ? "" : "s"}
          </div>
        </div>
        
        <div className="mt-6 grid gap-4">
          {sortedSlots.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-slate-300  tracking-[0.1em] text-cyan-200/80">
              No proposed slots were generated yet.
            </div>
          ) : (
            sortedSlots.map((slot, index) => {
              // Get the vote count for this specific slot
              const slotVotes = getVoteCount(slot.id);
              const isWinner = meetingDetails.winner_slot_id === slot.id;

              return (
                <div key={slot.id} className={`meetingdemo rounded-[24px] border p-5 transition-colors ${isWinner ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-white/[0.03] border-white/8'}`} style={{marginBottom:'10px'}}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm uppercase tracking-[0.18em] text-slate-400  tracking-[0.1em] text-cyan-200/80" style={{marginBottom:'10px'}}>
                        {index === 0 && slotVotes > 0 ? '🏆 Top Choice' : `Option ${index + 1}`}
                      </div>
                      <div className="mt-2 text-lg font-semibold text-stone-50 tracking-[0.1em] text-cyan-200/80">
                        {new Date(slot.start_utc).toLocaleString()}
                      </div>
                      <div className="mt-1 text-sm text-slate-400  tracking-[0.1em] text-cyan-200/80">
                        Ends {new Date(slot.end_utc).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* VOTE COUNTER UI */}
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-300 font-bold text-lg">{slotVotes}</span>
                        <span className="text-cyan-200/60 text-sm tracking-widest uppercase">. Votes</span>
                      </div>

                      {meetingDetails.status !== "confirmed" && (
                        <button
                          onClick={() => handleConfirm(slot.id)}
                          disabled={confirming}
                          className="primary-button text-sm px-4 py-2 tracking-[0.1em] text-cyan-200/80 ml-4" style={{marginLeft:'10px',marginTop:'10px'}}
                        >
                          {confirming ? "Confirming..." : "Confirm"}
                        </button>
                      )}
                      
                      {isWinner && (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300 tracking-[0.1em] ml-4">
                          Winner ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}