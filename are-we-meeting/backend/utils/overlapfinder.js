const { DateTime } = require('luxon');

function slottoUTC(date, slot, timezone) {
    const d = DateTime.fromISO(date);
    const [startHour, startMinute] = slot.start_time.split(':').map(Number);
    const [endHour, endMinute] = slot.end_time.split(':').map(Number);
    
    const starttime = DateTime.fromObject(
        { year: d.year, month: d.month, day: d.day, hour: startHour, minute: startMinute },
        { zone: timezone }
    ).toUTC();
    
    const endtime = DateTime.fromObject(
        { year: d.year, month: d.month, day: d.day, hour: endHour, minute: endMinute },
        { zone: timezone }
    ).toUTC();
    
    return { start: starttime, end: endtime };
}

function findOverlappingSlots(participants, date, durationMins) {
    const day_of_week = DateTime.fromISO(date).weekday;

    const allUserSlots = participants.map(participant => {
        const matchingslots = participant.slots.filter(s => s.day_of_week === day_of_week);
        return matchingslots.map(slot => slottoUTC(date, slot, participant.timezone));
    });

    const usersWithSlots = allUserSlots.filter(slots => slots.length > 0);
    
    if (usersWithSlots.length !== participants.length || usersWithSlots.length === 0) {
        return null; 
    }

    let commonSlots = usersWithSlots[0];

    for (let i = 1; i < usersWithSlots.length; i++) {
        let nextCommon = [];
        const currentPersonSlots = usersWithSlots[i];

        for (const common of commonSlots) {
            for (const person of currentPersonSlots) {
                
                const overlapStart = DateTime.max(common.start, person.start);
                const overlapEnd = DateTime.min(common.end, person.end);

                
                if (overlapStart < overlapEnd) {
                    nextCommon.push({ start: overlapStart, end: overlapEnd });
                }
            }
        }

        commonSlots = nextCommon;
    }

    
    for (const slot of commonSlots) {
        const availableMinutes = slot.end.diff(slot.start, 'minutes').minutes;
        
        if (availableMinutes >= durationMins) {
            
            return {
                start: slot.start,
                end: slot.start.plus({ minutes: durationMins })
            };
        }
    }

    
    return null;
}

module.exports = { findOverlappingSlots };