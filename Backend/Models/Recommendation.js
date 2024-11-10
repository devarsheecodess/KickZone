const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecommendationSchema = new Schema({
    id:{
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    favPlayer: {
        type: String,
        required: true,
    },
    favClub: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Recommendation", RecommendationSchema);