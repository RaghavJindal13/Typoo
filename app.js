const express = require("express");
const app = express();
const path = require("path");
// var router = express.Router();
const port = process.env.PORT || 3000;
require("./db/conn");
const hbs = require("hbs");
const Register = require("./models/UserData");
const Blog = require("./models/BlogData");
const Details = require("./models/UserDetails");

const static_path = path.join(__dirname, "/public");
app.use(express.static(static_path));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");

//HOME PAGE
app.get("/", (req, res) => {

    res.render("index")

});


//SIGNUP PAGE
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.post("/signup", async(req, res) => {
    try {
        const pass = req.body.password;
        const cnf_pass = req.body.cnf_pass;
        if (pass === cnf_pass) {
            const user = new Register({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email_id: req.body.email_id,
                username: req.body.username,
                password: req.body.password,
                cnf_pass: req.body.cnf_pass,
            });

            const registered = await user.save();

            const details = new Details({
                username: req.body.username,
                email_id: req.body.email_id
            });

            const detailed = await details.save();
            res.status(201).render("index");
        } else {
            res.send("password are not matching");
        }
    } catch (error) {
        res.status(400).send("some error in signup");
    }
});


//SIGNIN PAGE
app.get("/signin", (req, res) => {
    res.render("signin");
});
app.post("/signin", async(req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user_cred = await Register.findOne({ username: username });
        const user_blog = await Blog.find({ username: username });
        const user_details = await Details.findOne({ username: username });

        if (user_cred.password === password) {
            res.status(201).render("userDashboard", {
                user_cred: user_cred,
                user_blog: user_blog,
                user_details: user_details
            });
        } else {
            res.send("password incorrect");
        }
    } catch (error) {
        res.status(400).send("username not found");
    }
});


//BLOG VIEW PAGE
app.get("/blog_page/:id", (req, res) => {
    const id = req.params.id;
    Blog.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("blog_page", {
                doc: doc
            });
        }
    });
});

//INSERT OR UPDATE BLOG
app.get("/blog_write", (req, res) => {
    res.render("blog_write");
});

app.post('/blog_write', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var blog = new Blog();
    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.author = req.body.author;
    blog.username = req.body.username;

    blog.save((err, doc) => {
        if (!err) {
            const id = doc._id;
            res.redirect('userDashboardb/' + id);
        } else
            console.log("error in saving data");
    });
}

function updateRecord(req, res) {
    Blog.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            const id = doc._id;
            res.redirect('userDashboardb/' + id);
        } else
            console.log('Error during record update : ' + err);

    });
}


//UPDATE
app.get("/blog_write/:id", (req, res) => {
    const id = req.params.id;
    Blog.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("blog_write", {
                doc: doc
            });
        }
    });
});

//DELETE BLOG
app.get("/delete/:id", (req, res) => {
    // Blog.findByIdAndRemove(req.params.id, (err, doc) => {
    Blog.findById(req.params.id, async(err, doc) => {
        if (!err) {
            const username = doc.username;
            const user_details = await Details.findOne({ username: username });
            const id = user_details._id;
            Blog.findByIdAndRemove(req.params.id, (err, doc) => {
                if (!err) {
                    res.redirect('/userDashboardd/' + id);
                } else {
                    console.log("Error in blog delete :" + err);
                }
            });
        } else {
            console.log("Error in blog delete :" + err);
        }
    });
});
//USER Dashboard PAGE
app.get("/userDashboardd/:id", async(req, res) => {

    Details.findById(req.params.id, async(err, doc) => {
        if (!err) {
            const username = doc.username;

            const user_cred = await Register.findOne({ username: username });
            const user_blog = await Blog.find({ username: username });
            const user_details = await Details.findOne({ username: username });
            res.render("userDashboard", {
                user_cred: user_cred,
                user_blog: user_blog,
                user_details: user_details
            });
        } else {
            console.log("Error in userdashboard");
        }
    });
});
app.get("/userDashboardb/:id", async(req, res) => {

    Blog.findById(req.params.id, async(err, doc) => {
        if (!err) {
            const username = doc.username;

            const user_cred = await Register.findOne({ username: username });
            const user_blog = await Blog.find({ username: username });
            const user_details = await Details.findOne({ username: username });
            res.render("userDashboard", {
                user_cred: user_cred,
                user_blog: user_blog,
                user_details: user_details
            });
        } else {
            console.log("Error in userdashboard");
        }
    });
});


//EDIT DETAILS PAGE

app.get("/edit_details/:id", (req, res) => {
    const id = req.params.id;
    Details.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("edit_details", {
                doc: doc
            });
        }
    });
});

app.post('/edit_details', (req, res) => {
    const id = req.params.id;
    Details.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            const id = doc._id
            res.redirect('userDashboardd/' + id);
        } else
            console.log('Error during editing details');

    });
});



//ADMIN PAGE
app.get("/admin", (req, res) => {
    res.render("admin")
});
app.post("/adminlogin", async(req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user_cred = await Register.findOne({ username: username });
        const user_blog = await Blog.find({ username: username });
        const user_details = await Details.findOne({ username: username });

        if (user_cred.password === password && user_cred.admin === true) {
            res.status(201).render("adminDashboard", {
                user_cred: user_cred,
                user_blog: user_blog,
                user_details: user_details
            });
        } else {
            res.send("password incorrect or you not an admin user");
        }
    } catch (error) {
        res.status(400).send("username not found");
    }
});


app.listen(port, () => {
    console.log("port");
});