const express = require('express');
const app = express();

// Import Routes
const todos = require('./routes/todos.js');

app.use(express.json());
app.use('/api', todos);

const server = app.listen(3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});
