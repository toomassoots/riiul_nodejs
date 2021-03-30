
const express = require('express');
const router = require('./api/routes/routes');
const cors = require("cors")
const app= express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(router);

module.exports=app;