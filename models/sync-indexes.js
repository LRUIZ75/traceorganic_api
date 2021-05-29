

const personModel = require('./person.model');
const userModel = require('./user.model');
const roleModel = require('./role.model');



exports.SyncIndexes = function () {
    personModel.syncIndexes();
    userModel.syncIndexes();
    roleModel.syncIndexes();
};