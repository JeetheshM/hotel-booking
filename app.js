const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path  = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const{listingSchema}=require("./schema.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to mongoDB");
}).catch((err)=>{
    console.log("error connecting to mongoDB", err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


app.get("/",(req,res)=>{
    res.send("hi, i am root");
});

// app.get("/listings",async(req,res)=>{

//    let sampleListing = new Listing({
//     title:"my new home",
//     description:"a beautiful house",
//     price:200000000,
//     location:"banglore",
//     country:"India"
//    }) ;
//     await sampleListing.save();
//     console.log("sucessfull saved");
//     res.send("listing saved");
// });


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
};

//index route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

//new page for adding the elements
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});

//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show",{listing});
}));
//create route
app.post("/listings", validateListing, wrapAsync(async(req,res,next)=>{
   
   const newListing=new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
   
}));
//edit route

// app.get("/listings/:id_/edit",async(req,res)=>{
//     let {id_}= req.params;
//     const listing = await Listing.findById(id_);
//     res.render("listings/edit",{listing});
// });

//edit rout
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
}));

//update route

app.put("/listings/:id",validateListing ,wrapAsync(async(req,res)=>{
    
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete rout
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
}));

app.use((req, res, next) => {
    next(new ExpressError(404, "page not found!!"));
});



// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something went wrong" } = err;
//     // res.status(statusCode).send(message);
//     res.status(statusCode).render("listings/error.ejs",{message});
// });

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error", { message });
});


app.listen(8080,()=>{
    console.log("server is running on port 8080");
});