let express = require('express')
let mongoose = require("mongoose")
let app = express()
let ownerModel = require('./models/ownerModel')
let customerModel = require('./models/customerModel')
const propertyModel = require('./models/propertyModel')
const interestModel = require('./models/interest')
app.use(express.json())
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}))
require('dotenv').config()

const uri = "mongodb+srv://abrahamkhatti:@cluster0.wqncw6x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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
  res.render("properties", {allListings})
})

app.post("/customer-login", async (req, res) => {
  try {
    const { username, phone } = req.body;
    const user = await customerModel.findOne({ phone });
    if(user)
    {
      res.redirect(`/customer-dashboard/${user._id}`)
    }
    else{
      res.status(500).send("User Not Found")
    }
  } catch (err) {
    console.error(err);
  }
});

app.get("/properties/delete/:id", async (req, res) => {
  try {
    const deletedProperty = await propertyModel.findByIdAndDelete(req.params.id);
    if (!deletedProperty) {
      return res.status(404).send("Property not found");
    }

    const ownerId = deletedProperty.owner; // assuming 'owner' is a field in the property schema
    res.redirect(`/my-listings/${ownerId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/properties/update/:id", (req,res)=>{
  res.render('update-property', {id: req.params.id})
})

app.post("/properties/update/:id", async (req,res)=>{
   const property = await propertyModel.findById(req.params.id);
    const ownerId = property.owner;
    const updateProperty = await propertyModel.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    location: req.body.location,
    price: req.body.price,
    owner: ownerId
  })

  res.redirect(`/my-listings/${ownerId}`)
})

app.get("/customer-dashboard/:id", async (req,res)=>{
  const allProperties = await propertyModel.find()
  res.render("customer-dashboard", {allProperties, userId: req.params.id})
})

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

app.get("/view-participants", (req,res)=>{
  res.render('admin-login')
})

app.post("/view-participants", async (req,res)=>{
  const { username, phone } = req.body;
    const user = await customerModel.findOne({ phone });
    if(user)
    {
      const allOwners = await ownerModel.find();
      const allCustomers = await customerModel.find()
      res.render('view-event', {allOwners, allCustomers})
    }
    else{
      res.status(500).send("User Not Found")
    }
})

app.get("/interested/:propertyId/:userId", async (req, res) => {
  try {
    const { propertyId, userId } = req.params;

    // ✅ Check if the property exists
    const property = await propertyModel.findById(propertyId);
    if (!property) {
      return res.status(404).send("Property not found");
    }

    // ✅ Check if this user already expressed interest
    const newInterest = await interestModel.create({
      owner: property.owner,
      customer: userId,
      property: propertyId,
    });

    res.redirect(`/customer-dashboard/${userId}`)
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error while recording interest");
  }
});

app.get("/my-interest/:id", async (req, res)=>{
  const myInterests = await interestModel
      .find({ customer: req.params.id })
      .populate("owner", "phone") // fetch only 'name' from owner collection
      .populate("property", "title")
  res.render("myInterest", {myInterests, userId: req.params.id})
})

app.get("/interested-in-property/:id", async (req, res)=>{
  const myInterests = await interestModel
      .find({ owner: req.params.id })
      .populate("customer", "phone") // fetch only 'name' from owner collection
      .populate("property", "title")
  res.render("ownerInterest", {myInterests, ownerId: req.params.id})
})
app.listen(3000, ()=>
{
    console.log("Server Connected!")
})