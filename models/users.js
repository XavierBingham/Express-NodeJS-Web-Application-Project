//Services
const Mongoose = require('mongoose');
const Bcrypt = require('bcrypt');

//Setup
const Schema = new Mongoose.Schema({
    firstName: {type: String, required: [true, "First name is required"]},
    lastName: {type: String, required: [true, "Last name is required"]},
    email: {type: String, required: [true, "Email is required"], unique: [true, "This email is already taken"]},
    password: {type: String, required: [true, "Password is required"]},
});

Schema.pre("save", function(next) {
    const User = this;
    if(!User.isModified("password")){
        return next();
    }
    Bcrypt.hash(User.password, 10).then(HashedPassword => {
        User.password = HashedPassword;
        next();
    }).catch(Err => {
        return next(Err);
    });
});

Schema.methods.comparePassword = function(password){
    return Bcrypt.compare(password, this.password);
}

module.exports = Mongoose.model("User", Schema);