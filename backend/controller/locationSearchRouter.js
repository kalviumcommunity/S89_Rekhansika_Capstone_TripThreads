const express = require('express');
const locationSearchRouter = express.Router();

locationSearchRouter.get('/location/:place', async (req, res) => {
    try {
        const { place } = req.params;
        const locationData = {
            name: place,
            attractions: ['Museum', 'Park', 'Gallery'],
            restaurants: ['Restaurant A', 'Restaurant B'],
            weather: 'Sunny',
        };

        res.status(200).send(locationData);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong" });
    }
});


module.exports = locationSearchRouter;