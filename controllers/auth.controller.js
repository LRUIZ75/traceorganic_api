// Last Updated: 14/05/2021 12:40:31 a. m.
// Updated By  : LRUIZ
"use strict";

const usersModel = require("../models/user.model");
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
const { findOneAndDelete } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const MSG = require("../modules/message.module");

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
   *         description: 'Credenciales: usuario y contraseña'
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
   *                 data:
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
        message: MSG["NO-BODY"],
      });
    }

    username = userData.username;
    password = userData.password;

    if (!username || !password) {
      return res.status(400).send({
        status: "error",
        message: MSG["NO-PARAM"],
      });
    }

    var query = { username: { $eq: username } };
    usersModel.findOne(query, (err, user) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: MSG["500"] + err.message,
        });
      }

      if (!user) {
        return res.status(401).send({
          status: "error",
          message: MSG["401"] + MSG["NO-DATA"],
        });
      }

      if (!user.isActive || !user.isVerifiedEmail) {
        return res.status(401).send({
          status: "error",
          message: MSG["401"] + "CUENTA NO VERIFICADA / INACTIVA",
        });
      }

      if (user.roles.length < 1) {
        return res.status(401).send({
          status: "error",
          message: MSG["401"] + "0 ROLES",
        });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).send({
          status: "error",
          message: MSG["NO-DATA"],
        });
      }

      // Proceder con la autorización, crear el JWT y devolverlo con un codigo
      let payload = {
        username: user.username,
        company: user.company,
        roles: user.roles,
      };
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
        data: user,
        token: accessToken,
      });
    });
  },
};

module.exports = authController;
