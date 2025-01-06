const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const { UserGroup } = require('../models/userGroup');

router.get('/', auth, async(req, res) => {
    // #swagger.tags = ['Users']
    const users = await User.find().sort({ name: 1 })
    res.send(users);
});

router.get('/:id', auth, async(req, res) => {
    // #swagger.tags = ['Users']
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) return res.status(404).send(`Could not find any user with id:${id}.`);
    res.send(user);
});

router.get('/check/me', auth, async(req, res) => {
    // #swagger.tags = ['Users']
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.put('/:id', auth, async(req, res) => {
    // #swagger.tags = ['Users']
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update user.',
        schema: {
            $name: 'Jane Doe',
            $email: 'jane.doe@gmail.com',
            $password: '87654321',
            $userGroupId: 'userGroupId'
        }
    } */

    if (req.user.userGroup.privileges.canManageUsers === false) 
        return res.status(403).send('Not enough privileges to perform this operation.');

    let userGroup;
    const userGroupId = req.body.userGroupId;
    if (userGroupId){
        userGroup = await UserGroup.findById(userGroupId);
        if (!userGroup) return res.status(404).send(`Failed to update user. Could not find any usergroup with id: ${userGroupId}.`);
    }
        
    const id = req.params.id;
    let user = await User.findById(id);
    if (!user) return res.status(404).send(`Could not find any user with id:${id}.`);
    
    if (!req.body.name) req.body.name = user.name;
    if (!req.body.email) req.body.email = user.email;
    if (!req.body.password) req.body.password = user.password;
    if (!req.body.userGroupId) req.body.userGroupId = user.userGroup._id;

    try
    {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    } catch (ex){
        return res.status(500).send(ex.message);
    }
    
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    user = req.body;
    if (userGroupId) user.userGroup = userGroup;
    const result = await User.findByIdAndUpdate(id, user, { new: true });
    res.send(result);
});

router.delete('/:id', auth, async(req, res) => {
    // #swagger.tags = ['Users']

    if (req.user.userGroup.privileges.canManageUsers === false) 
        return res.status(403).send('Not enough privileges to perform this operation.');

    const id = req.params.id;
    const result = await User.findByIdAndDelete(id);
    res.send(result);
});

module.exports = router;