import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMySlots, addSlot, deleteSlot } from "../services/api";

const DAYS_OF_WEEK = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

export default function Availability() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  // Form State
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/auth?mode=login");
      return;
    }
    fetchSlots();
  }, [navigate]);

  const fetchSlots = async () => {
    try {
      const data = await getMySlots();
      setSlots(data);
    } catch (err) {
      console.error("Failed to fetch slots", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async () => {
    if (startTime >= endTime) {
      alert("End time must be after start time");
      return;
    }
    
    setAdding(true);
    try {
      await addSlot({
        day_of_week: Number(dayOfWeek),
        start_time: startTime,
        end_time: endTime
      });
      await fetchSlots(); // Refresh the list
    } catch (err) {
      alert(err.message || "Could not add slot");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSlot(id);
      setSlots(slots.filter(s => s.id !== id)); // Optimistic UI update
    } catch (err) {
      alert("Failed to delete slot");
    }
  };

  // Group slots by day for the UI
  const groupedSlots = DAYS_OF_WEEK.map(day => ({
    ...day,
    slots: slots.filter(s => s.day_of_week === day.value).sort((a, b) => a.start_time.localeCompare(b.start_time))
  }));

  if (loading) return (
    <div className="max-w-6xl mx-auto w-full pt-10 flex justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto w-full mb-20">
      <section className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
        
        {/* --- LEFT COLUMN: Add New Slot --- */}
        <div className="glass-panel p-8 sm:p-10 relative overflow-hidden" style={{marginTop:'120px'}}>
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <span className="eyebrow">Settings</span>
            <h1 className="mt-5 text-[2rem] sm:text-[2.5rem] font-extrabold text-white leading-[1.1] tracking-tight tracking-[0.05em] text-cyan-200/80 " style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Your Availability
            </h1>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-slate-400 tracking-[0.1em] text-cyan-200/80">
              Define your weekly working hours. The system uses this to automatically find overlapping times when someone invites you to a meeting.
            </p>
          </div>

          <div className="relative z-10 mt-10 space-y-6">
            <div>
              <label className="surface-label tracking-[0.2em] text-cyan-200/80 uppercase" style={{marginBottom:'10px'}}>Day of the week</label>
              <select 
                className="surface-input w-full appearance-none bg-[#0f1720] tracking-[0.2em] text-cyan-200/80 uppercase"
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                style={{marginBottom:'10px'}}
              >
                {DAYS_OF_WEEK.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="surface-label tracking-[0.2em] text-cyan-200/80 uppercase">Start Time</label>
                <input
                  type="time"
                  className="surface-input w-full [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div>
                <label className="surface-label tracking-[0.2em] text-cyan-200/80 uppercase">End Time</label>
                <input
                  type="time"
                  className="surface-input w-full [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleAddSlot} 
              disabled={adding} 
              className="primary-button mt-6 w-full py-4 text-[1.1rem]"
               style={{marginTop:'10px'}}
            >
              {adding ? "Adding..." : "Add Time Block"}
            </button>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Current Schedule --- */}
        <div className="glass-panel p-6 sm:p-8 sticky top-[130px]"  style={{marginTop:'10px'}}>
          <span className="text-[2rem] font-bold tracking-[0.2em] text-cyan-200/80 uppercase mb-6" style={{fontWeight:'1000',marginBottom:'20px'}}>
            Weekly Schedule
          </span>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {groupedSlots.map((dayGroup) => (
              <div key={dayGroup.value} className="flex flex-col border-b border-white/5 pb-4 last:border-0">
                <span className="text-[0.85rem] text-white uppercase tracking-wider font-bold mb-3 tracking-[0.2em] text-cyan-200/80 uppercase" style={{marginTop:'10px'}}>
                  {dayGroup.label}
                </span>
                
                {dayGroup.slots.length === 0 ? (
                  <span className="text-slate-600 text-sm italic tracking-[0.2em] text-cyan-200/80 uppercase">Unavailable</span>
                ) : (
                  <div className="flex flex-col gap-2">
                    {dayGroup.slots.map(slot => (
                      <div key={slot.id} className="meetingdemo bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between group transition-colors hover:bg-white/10">
                        <span className="text-slate-300 font-medium text-sm tracking-[0.2em] text-cyan-200/80 uppercase">
                          {slot.start_time.substring(0, 5)} <span className="text-slate-600 mx-2">→</span> {slot.end_time.substring(0, 5)}
                        </span>
                        <button 
                          onClick={() => handleDelete(slot.id)}
                          className="text-red-400/50 hover:text-red-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity px-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}