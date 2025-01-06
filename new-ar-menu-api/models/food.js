const mongoose = require('mongoose');
const Joi = require('joi');
const { categorySchema } = require('./category');

const foodSchema = mongoose.Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 100 },
    category: { type: categorySchema, required: true },
    ingredients: [{ type: String, minLength: 3, maxLength: 50 }],
    price: { type: Number, min: 0, default: 0 },
    is_vegetarian: { type: Boolean, default: false },
    is_gluten_free: { type: Boolean, default: false },
    description: { type: String, maxLength: 255 },
    image_url: { type: String },
    model_url: { type: String }
});

const Food = mongoose.model('Food', foodSchema);

function validateFood(food){
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(100),
        ingredients: Joi.array().items(Joi.string().min(3).max(50)),
        price: Joi.number().min(0),
        is_vegetarian: Joi.boolean(),
        is_gluten_free: Joi.boolean(),
        description: Joi.string().max(255),
        image_url: Joi.string(),
        model_url: Joi.string()
    }); 

    return schema.validate({
        name: food.name,
        ingredients: food.ingredients,
        price: food.price,
        is_vegetarian: food.is_vegetarian,
        is_gluten_free: food.is_gluten_free,
        description: food.description,
        image_url: food.image_url,
        model_url: food.model_url
    });
}

exports.Food = Food;
exports.validateFood = validateFood;