DROP TABLE IF EXISTS tasks;
CREATE TABLE todos (id INTEGER PRIMARY KEY autoincrement, task TEXT, completed BOOLEAN DEFAULT false);
INSERT INTO todos (task) VALUES ('Learn Gatsby'), ('Python');
