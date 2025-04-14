const express = require('express');
const chatbotRouter = express.Router();

chatbotRouter.get('/recommendations',async (req, res) => {
    try {
        const { interests, budget } = req.query;
        const recommendations = [
            { destination: 'Paris', type: 'Culture', budget: 'High' },
            { destination: 'Goa', type: 'Adventure', budget: 'Low' },
        ].filter(rec => rec.type === interests && rec.budget === budget);

        if (recommendations.length === 0) {
            return res.status(404).send({ message: "No recommendations found" });
        }

        res.status(200).send(recommendations);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong" });
    }
});


module.exports = chatbotRouter;