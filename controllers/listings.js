const Listing=require("../models/listing.js");
const { Types } = require("mongoose");
const { cloudinary } = require("../cloudConfig.js");
const { listingCategories, categoryKeywordMap } = require("../utils/listingCategories.js");

module.exports.index=async (req,res)=>{
    const searchQuery = (req.query.search || "").trim();
    const requestedCategory = (req.query.category || "").trim();
    const activeCategory = listingCategories.includes(requestedCategory) ? requestedCategory : "";
    const filters = [];

    if (activeCategory) {
        const categoryRegex = categoryKeywordMap[activeCategory] || new RegExp(activeCategory, "i");
        filters.push({
            $or: [
                { category: activeCategory },
                { title: { $regex: categoryRegex } },
                { description: { $regex: categoryRegex } },
                { location: { $regex: categoryRegex } },
            ],
        });
    }

    if (searchQuery) {
        const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filters.push({
            $or: [
                { title: { $regex: escapedQuery, $options: "i" } },
                { location: { $regex: escapedQuery, $options: "i" } },
                { country: { $regex: escapedQuery, $options: "i" } },
                { category: { $regex: escapedQuery, $options: "i" } },
            ],
        });
    }

    const query = filters.length === 0 ? {} : filters.length === 1 ? filters[0] : { $and: filters };
    const allListings = await Listing.find(query);

    res.render("listings/index",{allListings, searchQuery, activeCategory});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new", { listingCategories });
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    if(!Types.ObjectId.isValid(id)){
        req.flash("error","Listing does not exist!!!");
        return res.redirect("/listings");
    }

    const listing=await Listing.findById(id)
        .populate({path:"reviews",populate:{path:"author"}})
        .populate("owner");

    if(!listing){
        req.flash("error","Listing does not exist!!!");
        return res.redirect("/listings");
    }

    res.render("listings/show",{listing});
};

module.exports.createListing=async(req,res)=>{

    let url=req.file.path;
    let filename=req.file.filename;
    

    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    
    req.flash("success","New listing created");
    res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    if(!Types.ObjectId.isValid(id)){
        req.flash("error","Listing does not exist!!!");
        return res.redirect("/listings");
    }

    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!!!");
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    if(originalImageUrl.includes("/upload/")){
        originalImageUrl = originalImageUrl.replace(
            "/upload/",
            "/upload/w_250,h_170,c_fill/"
        );
    } else if (originalImageUrl) {
        // For external image URLs (seed data), generate a Cloudinary fetch thumbnail.
        originalImageUrl = cloudinary.url(originalImageUrl, {
            type: "fetch",
            transformation: [{ width: 250, height: 170, crop: "fill" }],
            secure: true,
        });
    }

    res.render("listings/edit",{listing,originalImageUrl, listingCategories});
};

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    if(!Types.ObjectId.isValid(id)){
        req.flash("error","Listing does not exist!!!");
        return res.redirect("/listings");
    }

    const listing=await Listing.findByIdAndUpdate(
        id,
        {...req.body.listing},
        {new:true,runValidators:true}
    );

    if(!listing){
        req.flash("error","Listing does not exist!!!");
        return res.redirect("/listings");
    }

    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success","Listing updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    if(!Types.ObjectId.isValid(id)){
        req.flash("error","Listing does not exist!!!");
        return res.redirect("/listings");
    }

    const listing=await Listing.findByIdAndDelete(id);
    if(!listing){
        req.flash("error","Listing does not exist!!!");
        return res.redirect("/listings");
    }

    req.flash("success"," listing deleted Successfully");
    res.redirect("/listings");
};