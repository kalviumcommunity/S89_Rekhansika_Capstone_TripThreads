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

navigationRouter.put("/updatepreference/:id",async(req,res)=>{
    try {
      const {id} = req.params;
      if(!id){
        res.status(400).send({message:"Please provide id"});
      }
      const { userName, preferredRoutes, transportOptions, mapDirections } = req.body;
      const updatedPreference = await navigationPreference.findByIdAndUpdate({_id:id},{userName, preferredRoutes, transportOptions, mapDirections});
      res.status(200).send({message:"Data Updated successfully", preference:updatedPreference});
    } catch (error) {
      console.log(error);
      res.status(500).send({message:"Error updating post",error})
    }
});

navigationRouter.delete("/deletepreference/:id",async(req,res)=>{
  try {
    const {id} = req.params;
    if(!id){
      return res.status(400).send({message:"Please provide id"});
    }
    const deletedPreference = await navigationPreference.findByIdAndDelete({_id:id});
    res.status(200).send({message:"Preference Deleted successfully"});
  } catch (error) {
    res.status(500).send({message:"Error updating post",error})
  }
});

navigationRouter.patch("/patchnavigationpreference/:id", async (req, res) => {
  try {
      const { id } = req.params;
      if (!id) {
          return res.status(400).send({ message: "Please provide a valid id" });
      }
      const { userName, preferredRoutes, transportOptions, mapDirections } = req.body;
      if (!userName && !preferredRoutes && !transportOptions && !mapDirections) {
          return res.status(400).send({ message: "Please provide at least one field to update" });
      }
      const updatedSight = await navigationPreference.findByIdAndUpdate({_id:id},
          { userName, preferredRoutes, transportOptions, mapDirections },
          { new: true}
      );
      if (!updatedSight) {
          return res.status(404).send({ message: "Preference insight not found" });
      }
      res.status(200).send({ message: "Preference updated successfully", Preference : updatedSight });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error updating post", error });
  }
});

module.exports = navigationRouter;