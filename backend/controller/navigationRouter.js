const express = require('express');
const navigationrouter = express.Router();

navigationrouter.get('/transportation', async (req, res) => {
    try {
        const { location } = req.query;
        const transportOptions = [
            { type: 'Bus', distance: '500m' },
            { type: 'Train', distance: '1km' },
            { type: 'Taxi', available: true },
        ];
        res.status(200).send(transportOptions);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong" });
    }
});

module.exports = navigationrouter;