const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cnf_pass: {
        type: String,
        required: true
    },
    blogs: {
        type: Number
    },
    admin: {
        type: Boolean
    }
})

const Register = new mongoose.model("User", UserSchema);

module.exports = Register;