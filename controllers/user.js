const User=require("../models/user.js");

// render signup form
module.exports.renderSignupForm=(req,res)=>{
	res.render("users/signup.ejs");
};

//redirect legacy signup GET path
module.exports.redirectUsersSignupGet=(req,res)=>{
	res.redirect("/signup");
};

//register user and login immediately
module.exports.signup=async(req,res,next)=>{
	try{
		let {username,email,password}=req.body.user;
		const newUser=new User({username,email});
		const regesterdUser=await User.register(newUser,password);

		req.login(regesterdUser,(err)=>{
			if(err){
				return next(err);
			}
			req.flash("success","Welcome to Wanderlust!");
			res.redirect("/listings");
		});
	}catch(e){
		const isDuplicate=e&&(e.code===11000||/duplicate key/i.test(e.message));
		const errorMessage=isDuplicate?"User already exists":e.message;
		req.flash("error",errorMessage);
		res.redirect("/signup");
	}
};

//redirect legacy signup POST path
module.exports.redirectUsersSignupPost=(req,res)=>{
	res.redirect(307,"/signup");
};

//render login form
module.exports.renderLoginForm=(req,res)=>{
	res.render("users/login.ejs");
};

//post-login success redirect
module.exports.login=(req,res)=>{
	req.flash("success","Welcome back to Wanderlust!");
	res.redirect(res.locals.redirectUrl || "/listings");
};

//logout current user
module.exports.logout=(req,res,next)=>{
	req.logout((err)=>{
		if(err){
			return next(err);
		}

		req.flash("success","you are logged out");
		res.redirect("/listings");
	});
};
