const express = require('express');

const StartServer = async () => {
  const PORT = 8001;
  const app = express();

  app.listen(PORT, () => {
    console.log(`Customer listening to port ${PORT}`);
  })
    .on('error', (err) => {
      console.log(err);
      process.exit();
    })
}

StartServer();