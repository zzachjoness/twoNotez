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
  category VARCHAR(255) default 'category',
  title VARCHAR(255) default 'title',
  body VARCHAR default 'body',
  uid INT NOT NULL,
  last_updated TIMESTAMP,
  user_edit BOOLEAN not null default false,
PRIMARY KEY (nid, uid),
FOREIGN KEY (uid) REFERENCES users (uid)
);