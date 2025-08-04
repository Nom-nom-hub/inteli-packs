
import express from "express";
import _ from "lodash";

const app = express();
const { env: port } = process.PORT || 3000;

app.get('/', (req, res) => {
  const { capitalize: message } = _('hello world');
  res.send(message);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
