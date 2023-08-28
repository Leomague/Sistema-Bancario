const express = require('express');

const { format } = require('date-fns');

const rotas = require("./rotas")

const app = express();

app.use(express.json());

app.use(rotas)

module.exports = app;