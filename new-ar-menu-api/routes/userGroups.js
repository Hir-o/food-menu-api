const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { UserGroup, validateUserGroup } = require('../models/userGroup');

router.get('/', async(req, res) => {
    // #swagger.tags = ['User Groups']
    const userGroups = await UserGroup.find().sort({ name: 1 });
    res.send(userGroups);
});

router.get('/:id', async(req, res) => {
    // #swagger.tags = ['User Groups']
    const id = req.params.id;
    const userGroup = await UserGroup.findById(id);
    if (!userGroup) return res.status(404).send(`Could not find any user group with id: ${id}.`);
    res.send(userGroup);
});

router.post('/', auth, async(req, res) => {
    // #swagger.tags = ['User Groups']
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new user group.',
        schema: {
            $name: 'Viewer',
            $privileges: { canManageFood: false, canManageCategory: false, canManageUsers: false, canManageUserGroups: false }
        }
    } */

    if (req.user.userGroup.privileges.canManageUserGroups === false) 
        return res.status(403).send('Not enough privileges to perform this operation.');

   const { error } = validateUserGroup(req.body);
   if (!error) return res.status(400).send(error.details[0].message);

   const userGroup = new UserGroup(req.body);
   const result = await userGroup.save();
   res.send(result);
});

router.put('/:id', auth, async(req, res) => {
    // #swagger.tags = ['User Groups']
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update user group.',
        schema: {
            $name: 'Editor',
            $privileges: { canManageFood: true, canManageCategory: true, canManageUsers: false, canManageUserGroups: false }
        }
    } */

    if (req.user.userGroup.privileges.canManageUserGroups === false) 
        return res.status(403).send('Not enough privileges to perform this operation.');

    const id = req.params.id;
    let userGroup = await UserGroup.findById(id);
    if (!userGroup) return res.status(404).send(`Could not find any user group with id: ${id}.`);

    if (!req.body.name) req.body.name = userGroup.name;
    
    const { error } = validateUserGroup(req.body);
    if (!error) return res.status(400).send(error.details[0].message);

    userGroup = await UserGroup.findByIdAndUpdate(id, req.body, { new: true });
    res.send(userGroup);
});

router.delete('/:id', auth, async(req, res) => {
    // #swagger.tags = ['User Groups']

    if (req.user.userGroup.privileges.canManageUserGroups === false) 
        return res.status(403).send('Not enough privileges to perform this operation.');

    const id = req.params.id;
    const result = await UserGroup.findByIdAndDelete(id);
    res.send(result);
});

module.exports = router;