const express = require('express');
const locationSearchRouter = express.Router();

const locationInsight = require("../models/locationInsightSchema")

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

locationSearchRouter.post('/sight',async (req, res) => {
    try {
      const { userName, locationName, attractions, cuisines, weatherDetails, languageInfo, activities , budgetRange} = req.body;
      const newLocationInsight = new locationInsight({ userName, locationName, attractions, cuisines, weatherDetails, languageInfo, activities, budgetRange });
      await newLocationInsight.save();
      res.status(201).json({ message: 'Location bookmarked successfully!', location: newLocationInsight });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error bookmarking location', error });
      
    }
  });

module.exports = locationSearchRouter;