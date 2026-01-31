const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path  = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

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

// ---------------- VALIDATION MIDDLEWARE ----------------

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
};
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);



// ---------------- ROUTES ----------------




// ---------------- REVIEWS ----------------



// 404 handler
app.use((req, res, next) => {
    next(new ExpressError(404, "page not found!!"));
});

// error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error", { message });
});

app.listen(8080,()=>{
    console.log("server is running on port 8080");
});
