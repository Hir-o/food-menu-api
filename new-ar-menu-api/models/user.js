const mongoose = require('mongoose');
const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);
const { userGroupSchema } = require('./userGroup');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 50 },
    email: { type: String, required: true, unique: true, maxLength: 100 },
    password: { type: String, required: true },
    userGroup: { type: userGroupSchema, required: true }
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({ _id: this._id, userGroup: this.userGroup }, process.env.JWT_KEY, { expiresIn: '1h' });
}

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(50),
        email: Joi.string().email({ tlds: {allow: false} }),
        password: joiPassword.string().min(6).noWhiteSpaces().minOfUppercase(1).minOfLowercase(1).doesNotInclude(['password']).required(),
    });

    return schema.validate({
        name: user.name,
        email: user.email,
        password: user.password,
    });
}

exports.User = User;
exports.validateUser = validateUser;