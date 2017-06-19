var express = require('express');
var path = require('path');
var router = express.Router();

var sqlite = require('sqlite3');

var userController = require('../controllers/userController');
var sessionController = require('../controllers/sessionController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Autoloading */
router.param('username', userController.load); // autoload :username

/* Users Management */
// New User register
router.post('/signup', userController.signUp);
router.get('/users/:username',  userController.show);


/* Session manager */
//router.get('/login',  sessionController.new);  // obtener el formulario a rellenar para hacer login. 
router.post('/signin', sessionController.create); // enviar formulario para crear la sesión.
router.get('/logout', sessionController.destroy); // destruir la sesión actual.


module.exports = router;
