const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError= require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        //originalUrl save if the user is not logged in
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listings");
       return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async (req,res,next)=>{
    let {id}= req.params;
            let listings=await Listing.findById(id);
            if(!listings.owner.equals(res.locals.currUser._id)){
                req.flash("error","You are not the owner of listing");
                return res.redirect(`/listings/${id}`);
            }
            next();
}

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
};

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id, reviewId}= req.params;
    let review=await Review.findById(reviewId);
    if(!review){
        req.flash("error","Review not found");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};