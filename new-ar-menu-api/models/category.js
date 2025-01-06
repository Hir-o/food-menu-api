const mongoose = require('mongoose');
const Joi = require('joi');

const categorySchema = mongoose.Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 50},
    description: { type: String, maxLength: 255 }
});

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category){
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(50),
        description: Joi.string().max(255),
    });

    return schema.validate({ name: category.name });
}

function swaggerRequestBody(){

}

exports.Category = Category;
exports.validateCategory = validateCategory;
exports.categorySchema = categorySchema;
exports.swaggerRequestBody = swaggerRequestBody;