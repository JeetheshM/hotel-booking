const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");

// Signup routes
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// Backward-compatible signup routes
router.route("/users/signup")
    .get(userController.redirectUsersSignupGet)
    .post(userController.redirectUsersSignupPost);

// Login routes
router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local",{
            failureRedirect:"/login",
            failureFlash:true,
        }),
        userController.login
    );

// Logout current user
router.get("/logout",userController.logout)
module.exports=router;