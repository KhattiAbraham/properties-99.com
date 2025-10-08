let express = require('express')
let mongoose = require("mongoose")
let app = express()
let ownerModel = require('./models/ownerModel')
let customerModel = require('./models/customerModel')
const propertyModel = require('./models/propertyModel')
app.use(express.json())
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}))


const uri = "mongodb+srv://abrahamkhatti:k123y@cluster0.wqncw6x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {
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

app.post("/owner-login", async (req, res) => {
  try {
    const { username, phone } = req.body;
    const user = await ownerModel.findOne({ phone });
    if(user)
    {
      res.redirect(`/create-listings/${user._id}`)
    }
    else{
      res.status(500).send("User Not Found")
    }
  } catch (err) {
    console.error(err);
  }
});

app.get("/create-listings/:id", async(req,res)=>
{
  let id = req.params.id;
  res.render('create-property', {id})
}
   
)

app.post("/create-listings/:id", async (req, res) => {
  try {
    const { title, location, price } = req.body;
    const owner = req.params.id
    const user = await propertyModel.create({ 
      title,
      location,
      price,
      owner});
    if(user)
    {
      res.redirect(`/create-listings/${owner}`)
    }
    else{
      console.log("User Not Created")
    }
  } catch (err) {
    console.error(err);
  }
});

app.get("/my-listings/:id", async(req,res)=>{
  let allListings = await propertyModel.find({ owner: req.params.id})
  console.log(allListings)
  res.render("properties", {allListings})
})

app.post("/customer-login", async (req, res) => {
  try {
    const { username, phone } = req.body;
    const user = await customerModel.findOne({ phone });
    if(user)
    {
      res.redirect("/available-properties")
    }
    else{
      res.status(500).send("User Not Found")
    }
  } catch (err) {
    console.error(err);
  }
});

app.get("/customer-login", (req, res)=>{
    res.render('customer-login')
})


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