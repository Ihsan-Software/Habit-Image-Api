const { v4: uuidv4 } = require("uuid"); //for random image name id
const sharp = require("sharp");
const catchAsync = require("../utils/catchAsync");
// for image
const { uploadSingleImage } = require("../utils/uploadImageMiddleware");

// use buffer from Memory Storage
exports.resizeImage = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/images/user/${filename}`);
    // save image in db
    req.userImageName = filename;
    console.log(req.userImageName);
    res.status(200).json({ status: "success", data: req.userImageName });
});

// Execute multer middleware
exports.uploadUserImage = uploadSingleImage("photo");