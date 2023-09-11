//Services
const path = require('path');
const multer = require('multer');

//Functions
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/SiteImages/EventImages");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const filter = ["image/jpeg", "image/png", "image/gif"];
    if(file.mimetype === "undefined"){return cb(null, false);;}
    if(filter.includes(file.mimetype)){
        return cb(null, true);
    }else{
        cb(new Error("Invalid file type.  Only jpeg, png, and gif is allowed."));
    }
};

const upload = multer({
    storage: storage,
    limits: {fileSize: 1*1024*1024},
    fileFilter: fileFilter,
}).single("image");

module.exports = (req, res, next) => {
    upload(req, res, err => {
        if(err){
            err.status = 400;
            next(err);
        }else{
            next();
        }
    });
}