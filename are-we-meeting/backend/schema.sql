CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    timezone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE availability_slots(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL ,
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE meetings(
    id SERIAL PRIMARY KEY,
    organizer_id INTEGER REFERENCES users(id) NOT NULL,
    title TEXT NOT NULL,
    duration_mins INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    winner_slot_id INTEGER REFERENCES proposed_slots(id),
    search_from DATE NOT NULL,
    search_until DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE meeting_participants(
    id SERIAL PRIMARY KEY,
    meeting_id INTEGER REFERENCES meetings(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) ,
    email TEXT NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE proposed_slots(
    id SERIAL PRIMARY KEY,
    meeting_id INTEGER REFERENCES meetings(id) NOT NULL,
    start_utc TIMESTAMPTZ NOT NULL,
    end_utc TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE votes(
    id SERIAL PRIMARY KEY,
    participant_id INTEGER REFERENCES meeting_participants(id) NOT NULL,
    proposed_slot_id INTEGER REFERENCES proposed_slots(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(participant_id,proposed_slot_id)
);

CREATE TABLE reminders(
    id SERIAL PRIMARY KEY,
    meeting_id INTEGER REFERENCES meetings(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    remind_at TIMESTAMPTZ,
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
