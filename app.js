const database = require('./database/crudrepository.js');

const express = require('express');
const app = express();
const todos = require('./routes/todos.js');

app.use(express.json());
app.use('/api', todos);

const server = app.listen(8080, async () => {
  console.log(`Listening on port ${server.address().port}`);
});
