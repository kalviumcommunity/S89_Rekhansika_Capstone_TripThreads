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
        return res.status(400).send({message:"Please provide id"});
      }
      
      const { communityName, userName, title, content } = req.body;
      const updatedCommunityPost = await communityPost.findByIdAndUpdate(
        {_id:id},
        {communityName, userName, title, content},
        {new:true});
      res.status(200).send({message:"Community Post Updated successfully", post:updatedCommunityPost});
    } catch (error) {
      console.log(error)
      res.status(500).send({message:"Error updating community post",error})
    }
}); 

socialFeaturesRouter.put("/updateposts/:id",async(req,res)=>{
  try {
    const {id} = req.params;
    if(!id){
      return res.status(400).send({message:"Please provide id"});
    }
    const { userName, title, content, tags } = req.body;
    const updatedPost = await post.findByIdAndUpdate({_id:id},{userName, title, content, tags},{new:true});
    res.status(200).send({message:"Post Updated successfully",post:updatedPost});
  } catch (error) {
    console.log(error)
    res.status(500).send({message:"Error updating post",error})
  }
});

socialFeaturesRouter.delete("/deletecommunityposts/:id",async(req,res)=>{
  try {
    const {id} = req.params;
    if(!id){
      return res.status(400).send({message:"Please provide id"});
    }
    const deletedCommunityPosts = await communityPost.findByIdAndDelete({_id:id});
    res.status(200).send({message:"Community Post Deleted successfully"});
  } catch (error) {
    res.status(500).send({message:"Error deleting post",error})
  }
});

socialFeaturesRouter.delete("/deleteposts/:id",async(req,res)=>{
  try {
    const {id} = req.params;
    if(!id){
      return res.status(400).send({message:"Please provide id"});
    }
    const deletedPosts = await post.findByIdAndDelete({_id:id});
    res.status(200).send({message:"Post Deleted successfully"});
  } catch (error) {
    res.status(500).send({message:"Error deleting post",error})
  }
});

socialFeaturesRouter.patch("/patchcommunityposts/:id", async (req, res) => {
  try {
      const { id } = req.params;
      if (!id) {
          return res.status(400).send({ message: "Please provide a valid id" });
      }
      const { communityName, userName, title, content } = req.body;
      if (!userName && !communityName && !title && !content) {
          return res.status(400).send({ message: "Please provide at least one field to update" });
      }
      const updatedCommunityPosts = await communityPost.findByIdAndUpdate({_id:id},
          { communityName, userName, title, content },
          { new: true},{runValidators: true}
      );
      if (!updatedCommunityPosts) {
          return res.status(404).send({ message: "Community Post insight not found" });
      }
      res.status(200).send({ message: "Community post updated successfully", Post : updatedCommunityPosts });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error updating post", error });
  }
});

socialFeaturesRouter.patch("/patchposts/:id", async (req, res) => {
  try {
      const { id } = req.params;
      if (!id) {
          return res.status(400).send({ message: "Please provide a valid id" });
      }
      const {userName, title, content, tags } = req.body;
      if (!userName && !tags && !title && !content) {
          return res.status(400).send({ message: "Please provide at least one field to update" });
      }
      const updatedPosts = await post.findByIdAndUpdate({_id:id},
          { userName, tags, title, content },
          { new: true},{runValidators: true}
      );
      if (!updatedPosts) {
          return res.status(404).send({ message: "Post insight not found" });
      }
      res.status(200).send({ message: "Post updated successfully", Post : updatedPosts });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error updating post", error });
  }
});
  

module.exports = socialFeaturesRouter;