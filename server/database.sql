CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(28) UNIQUE NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL,
    userid VARCHAR NOT NULL UNIQUE
);

INSERT INTO users(username, passhash) Values($1,$2)

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id VARCHAR(255) NOT NULL,
    receiver_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE headlines (
  id SERIAL PRIMARY KEY,
  headline TEXT
);

