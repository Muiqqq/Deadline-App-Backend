const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const db = [{ name: 'tiina' }, { name: 'jack' }];
const port = process.env.PORT || 8080;

app.get('/names', (req, res) => {
  res.send(db);
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
});
