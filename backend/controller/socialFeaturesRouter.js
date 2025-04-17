const express = require('express');
const socialFeaturesRouter = express.Router();

const {communityPost,post} = require("../models/communityPostSchema");


socialFeaturesRouter.get('/communities', async (req, res) => {
    try {
        const communities = ['Solo Travel', 'Budget Trips', 'Food Tours'];
        res.status(200).send(communities);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong" });
    }
});

socialFeaturesRouter.post('/communityposts',async (req, res) => {
    try {
      const { communityName, userName, title, content } = req.body;
      const newCommunityPost = new communityPost({ communityName, userName, title, content });
      await newCommunityPost.save();
      res.status(201).send({ message: 'Community post created successfully!', post: newCommunityPost });
    } catch (error) {
      res.status(500).send({ message: 'Error creating community post', error });
      console.log(error);
    }
  });
  
  
socialFeaturesRouter.post('/posts',async (req, res) => {
    try {
      const { userName, title, content, tags } = req.body;
      const newPost = new post({ userName, title, content, tags });
      await newPost.save();
      res.status(201).send({ message: 'Post created successfully!', post: newPost });
    } catch (error) {
      res.status(500).send({ message: 'Error creating post', error });
    }
  });

socialFeaturesRouter.put("/updatecommunityposts/:id",async(req,res)=>{
    try {
      const {id} = req.params;
      if(!id){
        res.status(400).send({message:"Please provide id"});
      }
      const { communityName, userName, title, content } = req.body;
      const updatedCommunityPost = await communityPost.findByIdAndUpdate(
        {_id:id},
        {communityName, userName, title, content},
        {new:true});
      res.status(200).send({message:"Data Updated successfully", post:updatedCommunityPost});
    } catch (error) {
      console.log(error)
      res.status(500).send({message:"Error updating post",error})
    }
}); 

socialFeaturesRouter.put("/updateposts/:id",async(req,res)=>{
  try {
    const {id} = req.params;
    if(!id){
      res.status(400).send({message:"Please provide id"});
    }
    const { userName, title, content, tags } = req.body;
    const updatedPost = await post.findByIdAndUpdate({_id:id},{userName, title, content, tags});
    res.status(200).send({message:"Data Updated successfully",post:updatedPost});
  } catch (error) {
    console.log(error)
    res.status(500).send({message:"Error updating post",error})
  }
});
  

module.exports = socialFeaturesRouter;