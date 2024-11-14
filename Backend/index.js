const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const userRoute = require('./routes/users');
const chatRoute = require('./routes/chat');
const { FE_ENDPOINT } = process.env;

const cors = require('cors')
app.use(
  cors({
    origin: ['http://localhost:5173', FE_ENDPOINT],
    credentials: true
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/user', userRoute);
app.use('/chat', chatRoute);

app.get('/', (req,res) => {
  console.log("server online")
  res.send("ok")
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

// Correctly export as Vercel expects a function handler
module.exports = (req, res) => {
  app(req, res);
};