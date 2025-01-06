const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { Category, validateCategory, swaggerRequestBody } = require('../models/category');

router.get('/', async(req, res) => {
    // #swagger.tags = ['Categories']
    const categories = await Category.find().sort({ name: 1 });
    res.send(categories);
});

router.get('/:id', async(req, res) => {
    // #swagger.tags = ['Categories']
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) return res.status(404).send(`Could not find any category with id: ${id}.`);
    res.send(category);
});

router.post('/', auth, async(req, res) => {
    // #swagger.tags = ['Categories']
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add new category.',
            schema: {
                $name: 'Pizza',
                $description: 'Pizza category'
            }
    } */

    if (req.user.userGroup.privileges.canManageCategory === false) 
        return res.status(403).send('Not enough privileges to perform this operation.');

    const { error } = validateCategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = new Category(req.body);
    const result = await category.save();
    res.send(result);
});

router.put('/:id', auth, async(req, res) => {
    // #swagger.tags = ['Categories']
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update category.',
        schema: {
            $name: 'Pizza',
            $description: 'Pizza category'
        }
    } */

    if (req.user.userGroup.privileges.canManageCategory === false) 
        return res.status(403).send('Not enough privileges to perform this operation.');

    const id = req.params.id;
    let category = await Category.findById(id);
    if (!category) return res.status(404).send(`Could not find any category with id: ${id}.`);
    
    if (!req.body.name) req.body.name = category.name;

    const { error } = validateCategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    category = await Category.findByIdAndUpdate(id, req.body, { new: true});
    res.send(category);
});

router.delete('/:id', auth, async(req, res) => {
    // #swagger.tags = ['Categories']

    if (req.user.userGroup.privileges.canManageCategory === false) 
        return res.status(403).send('Not enough privileges to perform this operation.');

    const id = req.params.id;
    const result = await Category.findByIdAndDelete(id);
    res.send(result);
});

module.exports = router;