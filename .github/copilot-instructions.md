# Copilot instructions for hotel-booking

## Project overview
- Express + EJS app with MongoDB via Mongoose. Entry point is app.js.
- Domain is listings + reviews. Listings store review ObjectIds and are populated on show.
- Views are EJS templates under views/ with layout boilerplate and shared includes.

## Data flow and structure
- Routes live in routes/: listings and nested reviews. Reviews are mounted at /listings/:id/reviews with mergeParams.
- Mongoose models in models/ define schemas and hooks. Listing has a post("findOneAndDelete") hook to cascade delete reviews.
- Validation uses Joi schemas in schema.js. Requests expect nested payloads:
  - listings: req.body.listing
  - reviews: req.body.review
- Async errors are wrapped with utils/wrapAsync.js; errors are handled by utils/ExpressError.js + the error handler in app.js.

## Conventions and patterns
- Validate IDs before DB ops using Types.ObjectId.isValid (see routes/listing.js).
- Flash messages are used for success/error feedback and exposed in res.locals (app.js).
- Use method-override with _method for PUT/DELETE from forms.
- EJS layout is via ejs-mate; templates live in views/listings and include shared partials.

## Developer workflows
- Start the server: node app.js (listens on port 8080).
- Seed the database: node init/index.js (clears listings and inserts sample data).
- MongoDB is expected at mongodb://127.0.0.1:27017/wanderlust (see app.js, init/index.js).

## Where to look for examples
- Listings CRUD and validation: routes/listing.js + schema.js + models/listing.js.
- Reviews add/delete flow: routes/review.js + models/review.js.
- Error handling flow: utils/ExpressError.js, utils/wrapAsync.js, and the error handler in app.js.
