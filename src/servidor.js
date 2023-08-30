const express = require('express');

const moment = require('moment')

const rotas = require("./rotas")

const app = express();

app.use(express.json());

app.use(rotas)

module.exports = app;