const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://raghav:raghav@cluster0.jnco9.mongodb.net/typoo?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("connection succ");
}).catch(() => {
    console.log("no conn")
})