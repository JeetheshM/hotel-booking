const mongoose=require('mongoose');
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to mongoDB");
}).catch((err)=>{
    console.log("error connecting to mongoDB", err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async() =>{
    const shouldReset = process.argv.includes("--reset");
    if (shouldReset) {
        await Listing.deleteMany({});
        console.log("Existing listings cleared (--reset). ");
    } else {
        console.log("Skipping deleteMany. Use `node init/index.js --reset` to clear old listings.");
    }
    
    // Prefer seeding with moni if present, fallback to any existing user.
    let user = await User.findOne({ username: "moni" });
    if (!user) user = await User.findOne();
    
    if (!user) {
        console.log("No user found. Please create a user first by visiting /signup");
        console.log("Skipping owner assignment for now.");
        await Listing.insertMany(initdata.data);
    } else {
        console.log(`Using user: ${user.username} (${user._id})`);
        initdata.data = initdata.data.map((obj) => ({
            ...obj,
            owner: user._id,
        }));
        await Listing.insertMany(initdata.data);
    }
    
    console.log("Database Initialized with Data");
};
initDB();