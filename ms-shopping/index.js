const express = require('express');

const StartServer = async () => {
  const PORT = 8003;
  const app = express();

  app.listen(PORT, () => {
    console.log(`Shopping listening to port ${PORT}`);
  })
    .on('error', (err) => {
      console.log(err);
      process.exit();
    })
}

StartServer();