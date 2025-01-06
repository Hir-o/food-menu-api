const mongoose = require('mongoose');
const Joi = require('joi');

const userGroupSchema = mongoose.Schema({
    name: { type: String, required: true, minLength:3, maxLength: 50 },
    privileges: {
        canManageFood: { type: Boolean, default: false },
        canManageCategory: { type: Boolean, default: false },
        canManageUsers: { type: Boolean, default: false },
        canManageUserGroups: { type: Boolean, default: false }
    }
});

const UserGroup = mongoose.model('UserGroup', userGroupSchema);

function validateUserGroup(userGroup){
    const schema = Joi.object({
        canManageFood: Joi.string().required().min(3).max(50),
        privileges: Joi.object({
            canManageFood: Joi.boolean(),
            canManageCategory: Joi.boolean(),
            canManageUsers: Joi.boolean(),
            canManageUserGroups: Joi.boolean()
        }),
    });

    return schema.validate({
        canManageFood: userGroup.canManageFood,
        privileges: userGroup.privileges
    });
}

exports.UserGroup = UserGroup;
exports.validateUserGroup = validateUserGroup;
exports.userGroupSchema = userGroupSchema;