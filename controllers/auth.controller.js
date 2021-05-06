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
   *                 userName:
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
    var userName = "";
    var password = "";

    if (!userData) {
      return res.status(400).send({
        status: "error",
        message: "Parámetros de llamada no válidos",
      });
    }

    userName = userData.userName;
    password = userData.password;

    if (!userName || !password) {
      return res.status(400).send({
        status: "error",
        message: "Parámetros de llamada no válidos",
      });
    }

    var query = { userName: { $eq: userName } };
    usersModel.findOne(query, (err, userObject) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          error: err.message,
        });
      }

      if (!userObject) {
        return res.status(401).send({
          status: "error",
          message: "No autorizado",
        });
      }

      if (!bcrypt.compareSync(password, userObject.password)) {
        return res.status(401).send({
          status: "error",
          message: "No autorizado",
        });
      }

      // Proceder con la autorización, crear el JWT y devolverlo con un codigo
      let payload = { userName: userName };
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
        token: accessToken,
      });
    });
  },
};

module.exports = authController;
