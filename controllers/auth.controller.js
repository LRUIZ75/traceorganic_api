"use strict";

const os = require("os");
const usersModel = require("../models/user.model");
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
const { findOneAndDelete } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Authentication
 */
var authController = {
  /**
   * @openapi
   * /api/login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: LOGIN AND AUTHENTICATE
   *     requestBody:
   *         name: userData
   *         description: 'JSON -> username and password'
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               properties:
   *                 username:
   *                   type: string
   *                   example: 'admin'
   *                 password:
   *                   type: string
   *                   example: '123Password'
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               properties:
   *                 status:
   *                   type: string
   *                   example: 'ok'
   *                 user:
   *                   $ref: "#/components/schemas/User"
   *                 token:
   *                   type: string
   *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImxydWl6NzUiLCJpYXQiOjE2MTQ2NDgzNDEsImV4cCI6MTYxNDY1MTk0MX0.4w78Mk1ztSuBhayQCbPOv-v5xrlscpgoAz9OSo2Cm4'
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unathorized
   *       500:
   *         description: Internal Server Error
   */
  login: (req, res) => {
    var userData = JSON.parse(JSON.stringify(req.body));
    var username = "";
    var password = "";

    if (!userData) {
      return res.status(400).send({
        status: "error",
        message: "Parámetros no son válidos",
      });
    }

    username = userData.username;
    password = userData.password;

    if (!username || !password) {
      return res.status(400).send({
        status: "error",
        message: "Parámetros no son válidos",
      });
    }

    var query = { username: { $eq: username } };
    usersModel.findOne(query, (err, user) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          error: err.message,
        });
      }

      if (!user) {
        return res.status(401).send({
          status: "error",
          message: "No autorizado",
        });
      }

      if(!user.isActive || !user.isVerifiedEmail) {
        return res.status(401).send({
          status: "error",
          message: "No autorizado",
        });
      }

      //console.log(password);
      //console.log(user.password);      

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).send({
          status: "error",
          message: "No autorizado",
        });
      }

      // Proceder con la autorización, crear el JWT y devolverlo con un codigo
      let payload = { username: user.username, company: user.company, roles: user.roles };
      let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
      });

      let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.REFRESH_TOKEN_LIFE,
      });

      var command = { $set: { refreshAccessToken: refreshToken } };
      usersModel.findOneAndUpdate(query, command);

      return res.status(200).send({
        status: "ok",
        user: user,
        token: accessToken,
      });
    });
  },
};

module.exports = authController;
