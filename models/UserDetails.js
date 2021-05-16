const mongoose = require("mongoose");

const DetailsSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    univ_name: {
        type: String,

    },
    address: {
        type: String,

    },
    email_id: {
        type: String,
    },
    account: {
        type: String,
    },
    bio: {
        type: String,
    }
})

const Details = new mongoose.model("Details", DetailsSchema);

module.exports = Details;