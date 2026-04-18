export default function SlotGrid({ availability, setAvailability }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const times = ["18:00", "19:00", "20:00", "21:00"];

  const toggleSlot = (key) => {
    if (availability.includes(key)) {
      setAvailability(availability.filter((s) => s !== key));
    } else {
      setAvailability([...availability, key]);
    }
  };

  return (
    <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
      {days.map((day) =>
        times.map((time) => {
          const key = `${day}-${time}`;
          const selected = availability.includes(key);

          return (
            <div
              key={key}
              onClick={() => toggleSlot(key)}
              className={`p-4 rounded-xl text-center cursor-pointer transition ${
                selected
                  ? "bg-blue-600 scale-105"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <div>{day}</div>
              <div className="text-sm opacity-70">{time}</div>
            </div>
          );
        })
      )}
    </div>
  );
}