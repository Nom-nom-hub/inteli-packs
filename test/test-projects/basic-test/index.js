
const express = require('express');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const message = _.capitalize('hello world');
  res.send(message);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
