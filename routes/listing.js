const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require('../models/listing');

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
};


// index routeS
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  }));
  
  // new listing form
  router.get("/new",(req,res)=>{
      res.render("listings/new");
  });
  
  // show route
  router.get("/:id",wrapAsync(async(req,res)=>{
      let {id}= req.params;
      const listing = await Listing.findById(id).populate("reviews");
      res.render("listings/show",{listing});
  }));

  // create route
  router.post("/", validateListing, wrapAsync(async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
 }));
 
 // edit route
 router.get("/:id/edit", wrapAsync(async (req, res) => {
   const { id } = req.params;
   const listing = await Listing.findById(id);
   res.render("listings/edit", { listing });
 }));
 
 // update route
 router.put("/:id",validateListing ,wrapAsync(async(req,res)=>{
     let {id}= req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect(`/listings/${id}`);
 }));
 
 // delete listing
 router.delete("/:id",wrapAsync(async(req,res)=>{
     let {id}= req.params;
     let listing = await Listing.findById(id);
     if(listing){
         await Review.deleteMany({_id: {$in: listing.reviews}});
     }
     await Listing.findByIdAndDelete(id);
     res.redirect("/listings");
 }));

 module.exports=router;
  