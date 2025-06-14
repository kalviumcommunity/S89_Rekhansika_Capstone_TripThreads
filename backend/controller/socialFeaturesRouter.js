const express = require('express');
const socialFeaturesRouter = express.Router();

const {communityPost,post} = require("../models/communityPostSchema");
const authenticateToken = require("../middleware/auth");


socialFeaturesRouter.get('/communities', async (req, res) => {
    try {
        const communities = ['Solo Travel', 'Budget Trips', 'Food Tours'];
        res.status(200).send(communities);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong" });
    }
});

socialFeaturesRouter.get("/posts", authenticateToken,async (req, res) => {
  try {
    const email = req.query.email;
    if (req.user.email !== email) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const experiences = await post.find({ email });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch experiences" });
  }
});

// Get posts for a user
socialFeaturesRouter.get("/user/:id/posts", authenticateToken, async (req, res) => {
  try {
    const posts = await post.find({ userName: req.params.id }); // or use userId if you store it
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

socialFeaturesRouter.post("/posts/:id/like", authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Find the post's author
    const targetPost = await post.findById(postId);
    if (!targetPost) return res.status(404).json({ error: "Post not found" });

    // Find the post's author user
    const author = await User.findOne({ username: targetPost.userName });
    if (!author) return res.status(404).json({ error: "Author not found" });

    // Check if current user follows the author
    const currentUser = await User.findById(userId);
    if (!currentUser.following.includes(author._id)) {
      return res.status(403).json({ error: "You must follow this user to like their post" });
    }

    // Add like if not already liked
    await post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } });
    res.json({ message: "Post liked" });
  } catch (err) {
    res.status(500).json({ error: "Failed to like post" });
  }
});

socialFeaturesRouter.post('/communities/communityposts',async (req, res) => {
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
  
  
socialFeaturesRouter.post('/communities/posts',authenticateToken,async (req, res) => {
    try {
      const { userName, title, description, imageUrl,email } = req.body;
      console.log("JWT email:", req.user.email, "Body email:", email); // Add this line
      if (req.user.email !== email) {
      return res.status(403).json({ error: "Forbidden" });
    }
      const newPost = new post({ userName,email, title, description, imageUrl  });
      await newPost.save();
      res.status(201).send({ message: 'Post created successfully!', post: newPost });
    } catch (error) {
      res.status(500).send({ message: 'Error creating post', error });
    }
  });

socialFeaturesRouter.put("/communities/updatecommunityposts/:id",async(req,res)=>{
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
      res.status(500).send({message:"Error updating community post"})
    }
}); 

socialFeaturesRouter.put("/communities/updateposts/:id",async(req,res)=>{
  try {
    const {id} = req.params;
    if(!id){
      return res.status(400).send({message:"Please provide id"});
    }
    const { userName, title, description, imageUrl  } = req.body;
    const updatedPost = await post.findByIdAndUpdate({_id:id},{userName, title, description, imageUrl },{new:true});
    res.status(200).send({message:"Post Updated successfully",post:updatedPost});
  } catch (error) {
    console.log(error)
    res.status(500).send({message:"Error updating post"})
  }
});

socialFeaturesRouter.delete("/communities/deletecommunityposts/:id",async(req,res)=>{
  try {
    const {id} = req.params;
    if(!id){
      return res.status(400).send({message:"Please provide id"});
    }
    const deletedCommunityPosts = await communityPost.findByIdAndDelete({_id:id});
    res.status(200).send({message:"Community Post Deleted successfully"});
  } catch (error) {
    res.status(500).send({message:"Error deleting post"})
  }
});

socialFeaturesRouter.delete("/communities/deleteposts/:id",async(req,res)=>{
  try {
    const {id} = req.params;
    if(!id){
      return res.status(400).send({message:"Please provide id"});
    }
    const deletedPosts = await post.findByIdAndDelete({_id:id});
    res.status(200).send({message:"Post Deleted successfully"});
  } catch (error) {
    res.status(500).send({message:"Error deleting post"})
  }
});

socialFeaturesRouter.patch("/communities/patchcommunityposts/:id", async (req, res) => {
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
      res.status(500).send({ message: "Error updating post" });
  }
});

socialFeaturesRouter.patch("/communities/patchposts/:id", async (req, res) => {
  try {
      const { id } = req.params;
      if (!id) {
          return res.status(400).send({ message: "Please provide a valid id" });
      }
      const {userName, title, description, imageUrl } = req.body;
      if (!userName && !imageUrl && !title && !description) {
          return res.status(400).send({ message: "Please provide at least one field to update" });
      }
      const updatedPosts = await post.findByIdAndUpdate({_id:id},
          { userName, description, imageUrl , title },
          { new: true},{runValidators: true}
      );
      if (!updatedPosts) {
          return res.status(404).send({ message: "Post insight not found" });
      }
      res.status(200).send({ message: "Post updated successfully", Post : updatedPosts });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error updating post" });
  }
});
  

module.exports = socialFeaturesRouter;