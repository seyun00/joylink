CREATE TABLE
  notice (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT,
    body TEXT,
    notice_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  );