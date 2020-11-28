// const database = require('./database/crudrepository.js');
const dbConnection = require('./database/connection');
const express = require('express');
const app = express();
const todos = require('./routes/todos.js');
const lists = require('./routes/lists');

app.use(express.json());
app.use('/api', todos);
app.use('/api', lists);

const server = app.listen(8080, async () => {
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
