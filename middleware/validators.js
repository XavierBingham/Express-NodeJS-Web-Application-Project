//Services
const { body, validationResult, param } = require('express-validator');
const { DateTime } = require('luxon');

module.exports = {

    LoginValidator: [
        body('email', 'Email is invalid').isEmail().trim().escape().normalizeEmail(),
        body('password', 'Password is invalid').isLength({min: 8, max: 64}).withMessage("Password must be between 8 and 64 characters"),
    ],

    AccountInfoValidator: [
        body('email', 'Email is invalid').isEmail().trim().escape().normalizeEmail(),
        body('password', 'Password is invalid').isLength({min: 8, max: 64}).withMessage("Password must be between 8 and 64 characters"),
        body('firstName', 'First name is invalid').notEmpty().withMessage("First name is required").trim().escape(),
        body('lastName', 'Last name is invalid').notEmpty().withMessage("Last name is required").trim().escape(),
    ],

    EventInfoValidator: [
        body('title', 'Title is invalid').notEmpty().withMessage("Title is required").trim().escape(),
        body('category', 'Category is invalid').notEmpty().withMessage("Category is required").trim().escape().isIn(["Drums", "Guitar", "Bass", "Vocal", "Bongos"]).withMessage("Category can only be Drums, Guitar, Bass, Vocal, or Bongos"),
        body('details', 'Details are invalid').notEmpty().withMessage("Details are required").trim().escape(),
        body('where', 'Location is invalid').notEmpty().withMessage("Location is required").trim().escape(),
        body('start', 'Start date is invalid').notEmpty().withMessage("Start date is required").trim().isISO8601().isAfter(DateTime.fromJSDate(Date.now()).toISO()).withMessage("Start date must be after today"),
        body('end', 'End date is invalid').notEmpty().withMessage("End date is required").trim().isISO8601().custom((Value, { req }) => {
            const Body = req.body;
            const EndTime = new Date(Body["end"]).getTime();
            const StartTime = new Date(Body["start"]).getTime();
            return EndTime > StartTime;
        }).withMessage("End date must be after start date"),
    ],

    RSVPInfoValidator: [
        body('status', 'Status is invalid').notEmpty().trim().escape().isIn(["YES", "NO", "MAYBE"]).withMessage("RSVP can only be YES, NO, or MAYBE"),
    ],
    
    ValidateResult: (req, res, next) => {
        const Errors = validationResult(req);
        if(!Errors.isEmpty()){
            Errors.array().forEach(ErrorObj => {
                req.flash('error', ErrorObj.msg);
            });
            return res.redirect('back');
        }
        return next();
    },

}