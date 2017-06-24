var express = require('express');
var path = require('path');
var router = express.Router();

var sqlite = require('sqlite3');

var userController = require('../controllers/userController');
var housingController = require('../controllers/housingController');
var sessionController = require('../controllers/sessionController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* Autoloading */
router.param('username', userController.loadUsername); // autoload :username
router.param('userid', userController.loadUserId); // autoload :userid
router.param('houseid', housingController.loadHouseId); // autoload :userid

/* Users Management */
// New User register
router.post('/signup', userController.create);
router.get('/users/:username',  userController.show);
router.get('/users/edit/:userid',  userController.edit);
router.post('/users/edit/:userid',  userController.update);

/* Housing Management */
router.get('/housing/new', sessionController.loginRequired, housingController.new);
router.post('/housing/create', sessionController.loginRequired, housingController.create);
//Repasar la creacion de casas y asignacion usuario-casa
router.get('/housing/:houseid', housingController.show);
//Search route: Un get al que le mandas parametros, hace la busqueda en la base de datos y muestra los resultados
//router.get('/search', housingController.results);


/* Session manager */
//router.get('/login',  sessionController.new);  // obtener el formulario a rellenar para hacer login. 
router.post('/signin', sessionController.create); // enviar formulario para crear la sesión.
router.get('/logout', sessionController.destroy); // destruir la sesión actual.


module.exports = router;
