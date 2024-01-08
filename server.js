const app = require("./src/app");
const mongoose = require('mongoose');

const PORT = 3003;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce start with ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log(`Exit Server Express`);
    mongoose.connection.close();
  });
  // notify.send(ping...)
});
