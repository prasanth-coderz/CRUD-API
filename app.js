const express = require('express');
const ConnectToDB = require("./config/database");
const router = require ('./router/book_router')

const app = express();

const port = process.env.SERVER_PORT || 4000;

app.use(express.json());

ConnectToDB().then(() => {
  app.use ('/book', router);
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
