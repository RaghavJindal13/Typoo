const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,

    },
    content: {
        type: String,

    },
    author: {
        type: String,
    },
    username: {
        type: String,
        required: true
    }
})

const Blog = new mongoose.model("Blog", BlogSchema);

module.exports = Blog;