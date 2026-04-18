import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { castVote, getMeeting, getVotes } from "../services/api";

export default function Invite() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [votes, setVotes] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    Promise.all([getMeeting(id), getVotes(id)])
      .then(([meetingData, voteData]) => {
        const m = Array.isArray(meetingData.meeting)
          ? meetingData.meeting[0]
          : meetingData.meeting;
        setMeeting(m || null);
        setVotes(Array.isArray(voteData) ? voteData : []);
      })
      .catch((err) => setError(err.message || "Failed to load invite"))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async () => {
    if (!selectedSlotId) {
      alert("Please select a proposed slot");
      return;
    }
    setSubmitting(true);
    try {
      await castVote({
        meeting_id: Number(id),
        proposed_slot_id: selectedSlotId,
      });
      setSubmitted(true);
      // Refresh vote counts
      const updated = await getVotes(id);
      setVotes(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to submit vote");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (error) return <div className="text-white p-6">{error}</div>;

  return (
    <section className="page-stack">

      <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="glass-panel p-8 sm:p-10" style={{marginTop:'120px',marginBottom:'20px'}}>
          <span className="eyebrow">Participant voting</span>
          <h1 className="section-title mt-5 tracking-[0.1em] text-cyan-200/80">
            Vote for a time{meeting ? ` for ${meeting.title}` : ""}.
          </h1>
          <p className="mt-4 text-slate-300 tracking-[0.1em] text-cyan-200/80">
            Choose the option that works best for you.
          </p>
          <div className="mt-8 grid gap-4">
            <div className="stat-card" style={{marginBottom:'10px'}}>
              <div className="text-sm text-slate-400 tracking-[0.1em] text-cyan-200/80" style={{marginBottom:'5px',fontWeight:'1000'}}>Available options</div>
              <div className="mt-2 text-2xl font-semibold text-stone-50 tracking-[0.1em] text-cyan-200/80">{votes.length}</div>
            </div>
            <div className="stat-card" style={{marginBottom:'10px'}}>
              <div className="text-sm text-slate-400 tracking-[0.1em] text-cyan-200/80" style={{marginBottom:'5px',fontWeight:'1000'}}>Your selection</div>
              <div className="mt-2 text-2xl font-semibold text-stone-50 tracking-[0.1em] text-cyan-200/80" >
                {selectedSlotId
                  ? `Option ${votes.findIndex((s) => s.slot_id === selectedSlotId) + 1}`
                  : "None yet"}
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300" style={{marginBottom:'10px'}}>
            {votes.length === 0
              ? "No candidate slots available yet."
              : "Select one option and submit your vote."}
          </div>
          <button
            onClick={submit}
            disabled={submitting || votes.length === 0 || submitted}
            className="primary-button mt-8 w-full"
          >
            {submitted ? "Vote submitted ✓" : submitting ? "Submitting..." : "Submit vote"}
          </button>
        </div>

        <div className="meetingdemo glass-card p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-[2rem] text-sm uppercase text-slate-400  tracking-[0.1em] text-cyan-200/80">Candidate slots</div>
              <h2 className="mt-2 text-2xl font-bold text-stone-50" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                Pick your best fit
              </h2>
            </div>
            {submitted && (
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
                Vote recorded ✓
              </div>
            )}
          </div>
          <div className="grid gap-4">
            {votes.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] p-8 text-slate-300 tracking-[0.1em] text-cyan-200/80">
                No slots to vote on yet.
              </div>
            ) : (
              votes.map((slot) => {
                // getVotes returns slot_id from the JOIN query
                const slotId = slot.slot_id || slot.id;
                const selected = selectedSlotId === slotId;
                return (
                  <button
                    key={slotId}
                    type="button"
                    onClick={() => !submitted && setSelectedSlotId(slotId)}
                    className={`marginten meetingdemo rounded-[24px] border p-5 text-left transition ${
                      selected
                        ? "border-cyan-300/50 bg-cyan-300/10 shadow-lg shadow-cyan-500/10"
                        : "border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" style={{marginTop:'5px'}}>
                      <div>
                        <div className="text-sm uppercase tracking-[0.18em] text-slate-400" style={{marginBottom:'5px'}}>
                          {selected ? "Selected" : "Available"}
                        </div>
                        <div className="mt-2 text-lg font-semibold text-stone-50">
                          {new Date(slot.start_utc).toLocaleString()}
                        </div>
                        <div className="mt-1 text-sm text-slate-400" style={{marginBottom:'5px'}} >
                          Ends {new Date(slot.end_utc).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-white/[0.06] px-4 py-2 text-sm text-slate-200">
                          {slot.vote_count} vote{slot.vote_count === "1" ? "" : "s"}
                        </div>
                        <div className={`h-4 w-4 rounded-full border ${selected ? "border-cyan-200 bg-cyan-300" : "border-white/30"}`} />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}