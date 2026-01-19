const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,

    
    image: {
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    },
    filename: {
      type: String,
      default: "default-image",
    },
  },



    price:Number,
    location:String,
    country:String,
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;