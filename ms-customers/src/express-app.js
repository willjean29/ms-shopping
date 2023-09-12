const express = require('express');
const cors = require('cors');
const { customer, appEvents } = require('./api');
const HandleErrors = require('./utils/error-handler')


module.exports = async (app, broker) => {

    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

    // listen to events
    // appEvents(app);

    //api
    customer(app, broker);

    // error handling
    app.use(HandleErrors);

}