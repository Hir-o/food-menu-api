const logger = require('../middleware/logger');
const { UserGroup } = require('../models/userGroup');

module.exports = async function seedData(){
    const defaultUserGroups = [
        { name: 'Viewer', privileges: { canManageFood: false, canManageCategory: false, canManageUsers: false, canManageUserGroups: false } },
        { name: 'Editor', privileges: { canManageFood: true, canManageCategory: true, canManageUsers: false, canManageUserGroups: false }},
        { name: 'Admin', privileges: { canManageFood: true, canManageCategory: true, canManageUsers: true, canManageUserGroups: true }}
    ];

    const existingRecords = await UserGroup.find();
    if (existingRecords.length === 0){
        await UserGroup.insertMany(defaultUserGroups);
        logger.info('Default user groups have been added to the database.');
    }
}