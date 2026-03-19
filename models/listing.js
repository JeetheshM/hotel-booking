const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const Review=require("./review.js");
const { listingCategories } = require("../utils/listingCategories.js");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,

    
    image: {
    url:String,
    filename:String,
    },
    filename: {
      type: String,
      default: "default-image",
    },
    price:Number,
    location:String,
    country:String,
    category: {
      type: String,
      enum: listingCategories,
      default: "Trending",
    },
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review",
      }
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;