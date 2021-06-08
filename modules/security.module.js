"use strict";

const roleModel = require("../models/role.model");
const roleactionModel = require("../models/roleaction.model");

/* let payload = {
  username: user.username,
  company: user.company,
  roles: user.roles,
}; */

var payloadModel = {
  username: '',
  company: '',
  roles: ['']
};

var securityModule = {



  /**
 * Verifica si tiene rolename en el arreglo de ID de roles
 * @param {*} rolename  nombre del role
 * @param {*} roles   arreglo de roles (oid)
 * @returns verdadero, si encuentra el rolename, falso de otro modo.
 */
  hasRole: (rolename, roles) => {
    return roleModel
      .findOne({ name: { $eq: rolename } })
      .then(role => {
        var rolesList = [""];
        var rol = {};
        rolesList = JSON.parse(JSON.stringify(roles));
        rol = JSON.parse(JSON.stringify(role._doc));
        if (rolesList.includes(rol._id)) {
          return true;
        }
      })
      .catch(err => {
        return false;
      });
  },
};

module.exports = securityModule;
