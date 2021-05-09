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

  roleModel.find({ name: { $eq: rolename } }).then((r)=>{
    if(r._id in roles)
      return true;
  })

  return false;
};

