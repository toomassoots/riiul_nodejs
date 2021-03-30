const express = require('express');
const router = express.Router();
const LoggedIn = require('../middleware/loggedIn');
//controllers

const pingController = require('../controller/pingController');
const frontpageController = require('../controller/frontpageController');
const tempController = require('../controller/tempController');
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const portfolioController = require('../controller/portfolioController');


router.use(express.static('API'));
router.use('/public', express.static('public'));
//Routes
router.get('/api/ping', pingController.ping);

//Avaliku vaate endpoin
router.get('/api/frontpage', frontpageController.read);
router.get('/api/frontpage/:id', frontpageController.readWork);
router.get('/api/subjectpage/:id', frontpageController.subjectView);

router.post('/api/login', authController.login)

//Tokeni kontroll
router.use(LoggedIn);

/*
router.get('/api/pics', tempController.pics)
router.put('/api/pics', tempController.editPic)*/
//Töö üleslaadimine
router.post('/api/upload', portfolioController.addPortfolio)
//Kasutajatega seotud toimingud
router.get('/api/users', userController.read)
router.post('/api/users', userController.addUser)
router.put('/api/users/:id', userController.editUser)
router.delete('/api/users', userController.deleteUser)


module.exports = router