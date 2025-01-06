const _ = require('lodash');
const express = require('express');
const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models/user');

router.post('/', async(req, res) => {
    // #swagger.tags = ['Users']
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Authenticate an existing user.',
        schema: {
            $email: 'john.doe@gmail.com',
            $password: 'Aa12345678'
        }
    } */

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne( {email: req.body.email });
    if (!user) return res.status(400).send(`Invalid email or password.`);

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send(`Invalid email or password.`);

    const token = user.generateAuthToken();
    res.send(token)
});

function validate(req){
    const schema = Joi.object({
        email: Joi.string().email({ tlds: {allow: false} }),
        password: joiPassword.string().min(6).noWhiteSpaces().minOfUppercase(1).minOfLowercase(1).doesNotInclude(['password']).required(),
    });

    return schema.validate({
        email: req.email,
        password: req.password
    });
}

module.exports = router;