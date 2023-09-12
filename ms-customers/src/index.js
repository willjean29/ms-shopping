const express = require('express');
const { PORT } = require('./config');
const { databaseConnection } = require('./database');
const expressApp = require('./express-app');
const { Broker } = require('./utils');

const StartServer = async () => {

    const app = express();

    await databaseConnection();

    const broker = Broker();

    await expressApp(app, broker);

    app.listen(PORT, () => {
        console.log(`Customers listening to port ${PORT}`);
    })
        .on('error', (err) => {
            console.log(err);
            process.exit();
        })
}

StartServer();