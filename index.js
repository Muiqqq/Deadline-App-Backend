// const database = require('./database/crudrepository.js');
const dbConnection = require('./database/connection');
const express = require('express');
const cors = require('cors');
const app = express();
const todos = require('./routes/todos.js');
const lists = require('./routes/lists');

const baseURL = process.env.PORT
  ? 'https://tamk-4a00ez62-3001-group11.herokuapp.com/'
  : 'http://localhost:8080/api/';
const port = process.env.PORT || 8080;

if (!process.env.PORT) {
  app.use(cors());
}

app.get('/api', (req, res, next) => {
  res.send(
    `Resources: <br> <a href="${baseURL}lists">/lists</a> <br> <a href="${baseURL}todos">/todos</a>`
  );
  next();
});

app.use(express.static('frontend/build'));
app.use(express.json());
app.use('/api', todos);
app.use('/api', lists);

const server = app.listen(port, async () => {
  try {
    // PROBLEM: this doesn't really try connecting to db...
    // if db server not running its "successful" in connecting
    await dbConnection.connect();
    console.log('Database connection successful');
    console.log(`Listening on port ${server.address().port}`);
  } catch (err) {
    console.log(err);
    server.close();
  }
});

// Graceful exit
process.on('SIGINT', function () {
  console.log('Closing...');
  dbConnection.close();
  process.exit();
});
