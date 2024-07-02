const path = require("path");
const express = require("express");
const morgan = require("morgan");

//security
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

// req from my modules
const userRouter = require("./routers/userRoutes");

// Import Error Function
const AppError = require("./utils/appError");
const globalHandlingError = require("./controllers/errorController");

const app = express();
// Middleware Functions...
// For Accept Input From User And Formated It As JSON...

//security/ 2)helemt  to security http headers
app.use(helmet());

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "uploads/images")));
//security/3) data sanitization like when input {'$gt:""'} email field
app.use(mongoSanitize());

app.use(express.static(`{${__dirname}/public}`));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  console.log("Hello In Middleware Functions... 👋");
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//security/ 1)limituser response

// const limeter  = rateLimit({
//     max:100,
//     windowMs: 60*60*1000,
//     message:' many requests come from this IP,please try in an hour...!'
// });
// app.use('/api', limeter);

// Routers
app.use("/users", userRouter);


// 1) Error Handling..., When Get Any Router Not Exist In Server...
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalHandlingError);
module.exports = app;
