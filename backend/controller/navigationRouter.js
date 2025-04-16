const express = require('express');
const navigationRouter = express.Router();

const navigationPreference = require("../models/navigationPreferenceSchema");

navigationRouter.get('/transportation', async (req, res) => {
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

navigationRouter.post('/preference',async (req, res) => {
    try {
      const { userName, preferredRoutes, transportOptions, mapDirections } = req.body;
      const newNavigationPreference = new navigationPreference({ userName, preferredRoutes, transportOptions, mapDirections });
      await newNavigationPreference.save();
      res.status(201).json({ message: 'Navigation preference saved successfully!', preference: newNavigationPreference });
    } catch (error) {
      res.status(500).json({ message: 'Error saving navigation preference', error });
    }
  });

module.exports = navigationRouter;