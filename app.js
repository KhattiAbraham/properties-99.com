let express = require('express')
let mongoose = require("mongoose")
let app = express()
let ownerModel = require('./models/ownerModel')
let customerModel = require('./models/customerModel')
const { error } = require('console')
app.use(express.json())
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}))
require("dotenv").config()


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Database Connected!"))
.catch((err) => console.error("❌ Connection Error:", err));


app.get("/", (req, res)=>{
    res.render('index')
})

app.get("/owner-login", (req, res)=>{
    res.render('owner-login')
})

app.get("/customer-login", (req, res)=>{
    res.render('customer-login')
})

app.post("/customer-login", async (req, res) => {
  try {
    const { username, phone } = req.body;
    const newUser = await customerModel.findOne({ phone });
    if(newUser)
    {
        console.log(newUser)
        res.redirect("/available-properties")        
    }}
    catch (error) {
        console.log(error)
    }
});



app.get("/owner-signup", (req, res)=>{
    res.render('owner-signup')
})

app.post("/owner-signup", async (req, res) => {
  try {
    const { username, phone } = req.body;
    const newUser = await ownerModel.create({ username, phone });
    console.log("User Created:", newUser);
    res.redirect("/owner-login");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Something went wrong");
  }
});

app.get("/customer-signup", (req, res)=>{
    res.render('customer-signup')
})

app.post("/customer-signup", async (req, res) => {
  try {
    const { username, phone } = req.body;
    const newUser = await customerModel.create({ username, phone });
    console.log("User Created:", newUser);
    res.redirect("/customer-login");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Something went wrong");
  }
});


app.get("/available-properties", (req, res)=>{
    res.render('properties')
})

app.get("/about", (req, res)=>{
    res.render('about')
})

app.get("/contact", (req, res)=>{
    res.render('contact')
})

app.listen(3000, ()=>
{
    console.log("Server Connected!")
})