"use strict";

const mongoose = require("mongoose");
const roleModel = require("../models/role.model");



/**
 * Busca rolename en el arreglo de ID de roles
 * @param {*} rolename  nombre del role
 * @param {*} roles   arreglo de roles (oid)
 * @returns verdadero, si encuentra el rolename, falso de otro modo.
 */
exports.containsRole = (rolename, roles) => {

  for(var i=0; i< roles.length; i++)
  {
    if (mongoose.isValidObjectId(roles[i])) {
      roleModel.findById(roles[i]).then((r) => {
        if (r.name == rolename) {
          return true;
        }
      });
    }
  }
  return false;
};
