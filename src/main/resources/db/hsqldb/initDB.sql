DROP TABLE users IF EXISTS;
DROP TABLE types IF EXISTS;

CREATE TABLE users (
  id         INTEGER IDENTITY PRIMARY KEY,
  first_name VARCHAR(30),
  last_name  VARCHAR(30),
  type_id    INTEGER NOT NULL
);

CREATE TABLE types (
  id        INTEGER IDENTITY PRIMARY KEY,
  name      VARCHAR(30)
);
