const _ = require('lodash');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, validateUser } = require('../models/user');
const { UserGroup } = require('../models/userGroup');

router.post('/', async(req, res) => {
    // #swagger.tags = ['Users']
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Register a new user.',
        schema: {
            $name: 'John Doe',
            $email: 'john.doe@gmail.com',
            $password: 'Aa12345678',
            $userGroupId: 'userGroupId'
        }
    } */

    const userGroupId = req.body.userGroupId;
    if (!userGroupId) return res.status(400).send(`Failed to insert user. The userGroupId property is missing. Please provide a userGroupId.`);
    const userGroup = await UserGroup.findById(userGroupId);
    if (!userGroup) return res.status(404).send(`Failed to insert user. Could not find any usergroup with id: ${userGroupId}.`);


    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const user = new User(req.body);
    user.userGroup = userGroup;
    const result = await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(result, ['id', 'name', 'email'])); 
    res.send(result);
});

module.exports = router;