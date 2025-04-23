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

locationSearchRouter.put("/updatesight/:id",async(req,res)=>{
    try {
      const {id} = req.params;
      if(!id){
        res.status(400).send({message:"Please provide id"});
      }
      const { userName, locationName, attractions, cuisines, weatherDetails, languageInfo, activities , budgetRange } = req.body;
      const updatedSight = await locationInsight.findByIdAndUpdate({_id:id},{userName, locationName, attractions, cuisines, weatherDetails, languageInfo, activities , budgetRange});
      res.status(200).send({message:"Data Updated successfully",location:updatedSight});
    } catch (error) {
      console.log(error)
      res.status(500).send({message:"Error updating data",error})
    }
});

locationSearchRouter.delete("/deletesight/:id",async(req,res)=>{
  try {
    const {id} = req.params;
    if(!id){
      return res.status(400).send({message:"Please provide id"});
    }
    const deletedSight = await locationInsight.findByIdAndDelete({_id:id});
    res.status(200).send({message:"location Deleted successfully"});
  } catch (error) {
    res.status(500).send({message:"Error deleting data",error})
  }
});

locationSearchRouter.patch("/patchlocationsight/:id", async (req, res) => {
  try {
      const { id } = req.params;
      if (!id) {
          return res.status(400).send({ message: "Please provide a valid id" });
      }
      const { userName, locationName, attractions, cuisines, weatherDetails, languageInfo, activities, budgetRange } = req.body;
      if (!userName && !locationName && !attractions && !cuisines && !weatherDetails && !languageInfo && !activities && !budgetRange) {
          return res.status(400).send({ message: "Please provide at least one field to update" });
      }
      const updatedSight = await locationInsight.findByIdAndUpdate({_id:id},
          { userName, locationName, attractions, cuisines, weatherDetails, languageInfo, activities, budgetRange },
          { new: true}
      );
      if (!updatedSight) {
          return res.status(404).send({ message: "Location insight not found" });
      }
      res.status(200).send({ message: "Location updated successfully", location: updatedSight });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error updating data", error });
  }
});

module.exports = locationSearchRouter;