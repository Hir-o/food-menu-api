const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { upload, deleteFile } = require('../middleware/fileUpload');
const { Food, validateFood } = require('../models/food');
const { Category } = require('../models/category');
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

router.get('/', async(req, res) => {
    // #swagger.tags = ['Food']
    const foodList = await Food.find().sort({ name: 1 });
    res.send(foodList);
});

router.get('/:id', async(req, res) => {
    // #swagger.tags = ['Food']
    const id = req.params.id;
    const food = await Food.findById(id);
    if (!food) return res.status(404).send(`Could not find any food with id: ${id}.`);
    res.send(food);
});

router.post('/', auth, upload.fields([
        { name: 'glb_file', maxCount: 1 },
        { name: 'image', maxCount: 1 }
    ]), async(req, res) => {
    // #swagger.tags = ['Food']
     /* 
        #swagger.consumes = ['multipart/form-data']   
        #swagger.parameters['glb_file'] = {
            in: 'formData',
            type: 'file',
            description: '3D model (.glb)',
        },
        #swagger.parameters['image'] = {
            in: 'formData',
            type: 'file',
            description: 'Food image (png/jpg/jpeg)'
        },
        #swagger.parameters['name'] = {
            in: 'formData',
            type: 'string',
            description: 'Name of the food',
            required: 'true'
        },
        #swagger.parameters['categoryId'] = {
            in: 'formData',
            type: 'string',
            description: 'Category Id',
            required: 'true'
        },
        #swagger.parameters['ingredients'] = {
            in: 'formData',
            type: 'array',
            description: 'Ingredients',
            collectionFormat: 'multi',
            items: { type: 'string' }
        }
        #swagger.parameters['price'] = {
            in: 'formData',
            type: 'number',
            description: 'Price'
        },
        #swagger.parameters['is_vegetarian'] = {
            in: 'formData',
            type: 'boolean',
            description: 'Is vegetarian'
        },
        #swagger.parameters['is_gluten_free'] = {
            in: 'formData',
            type: 'boolean',
            description: 'Is gluten free'
        },
        #swagger.parameters['description'] = {
            in: 'formData',
            type: 'string',
            description: 'Description of the food'
        }
    */

    if (req.user.userGroup.privileges.canManageFood === false) 
        return res.status(403).send('Not enough privileges to perform this operation.');

    const glbFile = req.files.glb_file;
    const imgFile = req.files.image;
    let category = new Category();

    const categoryId = req.body.categoryId;
    if (!categoryId){
        clearFiles(glbFile, imgFile)
        return res.status(400).send(`Failed to insert food. The categoryId property is missing. Please provide a categoryId.`);
    }
    category = await Category.findById(categoryId);
    if (!category){
        clearFiles(glbFile, imgFile)
        return res.status(404).send(`Failed to insert food. Could not find any category with id: ${categoryId}.`);
    }
    const { error } = validateFood(req.body);
    if (error) {
        clearFiles(glbFile, imgFile)
        return res.status(400).send(error.details[0].message);
    }
    
    const food = new Food(req.body);
    food.category = category;
    if (glbFile)
        food.model_url = `../uploads/glb-files/${req.files.glb_file[0].filename}`;
    if (imgFile)
        food.image_url = `../uploads/images/${req.files.image[0].filename}`;
    try{
        const result = await food.save();
        res.send(result);
    } catch (ex){
        clearFiles(glbFile, imgFile)
        return res.status(400).send(ex.message);
    }
});

router.put('/:id', [auth, upload.fields([
        { name: 'glb_file', maxCount: 1 },
        { name: 'image', maxCount: 1 }
    ])], async(req, res) => {
    // #swagger.tags = ['Food']
     /* 
        #swagger.consumes = ['multipart/form-data']   
        #swagger.parameters['glb_file'] = {
            in: 'formData',
            type: 'file',
            description: '3D model (.glb)',
        },
        #swagger.parameters['image'] = {
            in: 'formData',
            type: 'file',
            description: 'Food image (png/jpg/jpeg)'
        },
        #swagger.parameters['name'] = {
            in: 'formData',
            type: 'string',
            description: 'Name of the food',
            required: 'true'
        },
        #swagger.parameters['categoryId'] = {
            in: 'formData',
            type: 'string',
            description: 'Category Id',
            required: 'true'
        },
        #swagger.parameters['ingredients'] = {
            in: 'formData',
            type: 'array',
            description: 'Ingredients',
            collectionFormat: 'multi',
            items: { type: 'string' }
        }
        #swagger.parameters['price'] = {
            in: 'formData',
            type: 'number',
            description: 'Price'
        },
        #swagger.parameters['is_vegetarian'] = {
            in: 'formData',
            type: 'boolean',
            description: 'Is vegetarian'
        },
        #swagger.parameters['is_gluten_free'] = {
            in: 'formData',
            type: 'boolean',
            description: 'Is gluten free'
        },
        #swagger.parameters['description'] = {
            in: 'formData',
            type: 'string',
            description: 'Description of the food'
        }
    */

    if (req.user.userGroup.privileges.canManageFood === false) 
        return res.status(403).send('Not enough privileges to perform this operation.');

    const glbFile = req.files.glb_file;
    const imgFile = req.files.image;
    let category = new Category();

    const categoryId = req.body.categoryId;
    if (categoryId){
        category = await Category.findById(categoryId);
        if (!category){
            clearFiles(glbFile, imgFile)
            return res.status(404).send(`Failed to update food. Could not find any category with id: ${categoryId}.`);
        }
    }

    const id = req.params.id;
    let food = await Food.findById(id);
    if (!food){
        clearFiles(glbFile, imgFile)
        return res.status(404).send(`Could not find any food with id: ${id}.`);
    }
    
    if (!req.body.name) req.body.name = food.name;

    const { error } = validateFood(req.body);
    if (error){
        clearFiles(glbFile, imgFile)
        return res.status(400).send(error.details[0].message);
    }

    try{
        const tempFood = food;
        food = req.body;
        if (categoryId) food.category = category;
        if (glbFile) food.model_url = `../uploads/glb-files/${req.files.glb_file[0].filename}`;
        if (imgFile) food.image_url = `../uploads/images/${req.files.image[0].filename}`;

        const result = await Food.findByIdAndUpdate(id, food, { new: true });;

        if (tempFood){
            if (glbFile){
                const oldModelFileName = tempFood.model_url.slice(1);
                if (fs.existsSync(oldModelFileName))
                    await unlinkAsync(oldModelFileName);
            }

            if (imgFile){
                const oldImageFileName = tempFood.image_url.slice(1);
                if (fs.existsSync(oldImageFileName))
                    await unlinkAsync(oldImageFileName);
            }
        }

        res.send(result);
    } catch (ex){
        clearFiles(glbFile, imgFile)
        return res.status(400).send(ex.message);
    }
});

router.delete('/:id', auth, async(req, res) => {
    // #swagger.tags = ['Food']

    if (req.user.userGroup.privileges.canManageFood === false) 
        return res.status(403).send('Not enough privileges to perform this operation.');
    
    const id = req.params.id;
    const result = await Food.findByIdAndDelete(id);

    const oldModelFileName = result.model_url.slice(1);
    if (fs.existsSync(oldModelFileName))
        await unlinkAsync(oldModelFileName);

    const oldImageFileName = result.image_url.slice(1);
    if (fs.existsSync(oldImageFileName))
        await unlinkAsync(oldImageFileName);
    
    res.send(result);   
});

function clearFiles(glbFile, imgFile){
    if (glbFile) deleteFile(glbFile[0]);
    if (imgFile) deleteFile(imgFile[0]);
}

module.exports = router;