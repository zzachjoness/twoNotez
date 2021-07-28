CREATE TABLE users (
  uid SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email VARCHAR(255) NOT NULL,
  email_verfieid BOOLEAN,
  date_created DATE,
  last_login DATE
);

CREATE TABLE notes(
  nid SERIAL NOT NULL,
  title VARCHAR(255),
  body VARCHAR NOT NULL,
  uid INT NOT NULL,
  date_created TIMESTAMP,
  PRIMARY KEY (nid, uid),
  FOREIGN KEY (uid) REFERENCES users (uid)
);