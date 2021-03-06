var sqlite = require('sqlite3');
var path = require('path');

var models = require('../models');
var db = new sqlite.Database(path.join(__dirname, '..', 'public', 'data', 'app.db'));

/*
*  Autoloading :username
*/
exports.loadUsername = function(req, res, next, username) {
   models.User
        .find({where: {username: username}})
        .then(function(user) {
            if (user) {
                req.user = user;
                next();
            } else {
                console.log('No existe el usuario con username='+username+'.');
                next('No existe el usuario con username='+username+'.');
            }
        })
        .error(function(error) {
            next(error);
        });
};

exports.loadUserId = function(req, res, next, userid) {
   models.User
        .find({where: {id: userid}})
        .then(function(user) {
            if (user) {
                req.user = user;
                next();
            } else {
                console.log('No existe el usuario con id='+id+'.');
                next('No existe el usuario con id='+id+'.');
            }
        })
        .error(function(error) {
            next(error);
        });
};

/*
* Comprueba que el usuario logeado es el usuario alque se refiere esta ruta.
*/
exports.loggedUserIsUser = function(req, res, next) {
    
   if (req.session.user && req.session.user.id == req.user.id) {
      next();
   } else {
      console.log('Ruta prohibida: no soy el usuario logeado.');
      res.send(403);
   }
};


//Create method: New User
// POST /signUp
exports.create = function(req, res, next) {

    var name = req.body.user.name;
    var lastname = req.body.user.lastname;
    var email = req.body.user.email;
	var username = req.body.user.username;
	var pass = req.body.user.password;
	
	var user = models.User.build(
        { Username: username,
          Name:  name,
          LastName: lastname,
		  Email: email
        });
    
    // Username must be unique
    models.User.find({where: {username: username}})
        .then(existing_user => {
            if (existing_user) {
                console.log("Error: User \""+ username +"\" already exists: "+existing_user.values);
				res.redirect('/');				
            } else {
                
                // Password cannot be empty
                if (!pass) {
					console.log("Password should have a value");
					res.redirect('/');
                }

                //user.Salt = createNewSalt();
                user.Password = pass;
				user.Rating = 0;

                user.save()
                    .then(function() {
						console.log('User succesfully created');
                        res.redirect('/');
                    })
                    .error(function(error) {
                        next(error);
                    });
            }
        })
        .error(function(error) {
            next(error);
        });
	
};

// GET /users/username
//Show User information
exports.show = function(req, res, next) {
	console.log("Showing user: "+ req.user.Name);
    res.render('userInfo', {user: req.user});
};

// GET /users/edit/userid
exports.edit = function(req, res, next) {

    res.render('userEdit', {user: req.user,
                              validate_errors: {} });
};

//POST /users/edit/:userid
exports.update = function(req, res, next) {
  
    // req.user.login = req.body.user.login;  // No se puede editar.
    req.user.name  = req.body.user.name;
    req.user.email = req.body.user.email;
    
	models.User
        .find({where: {id: req.session.user.id}})
        .then(function(user) {
            if (user) {
                if(req.body.type == "info"){
					user.Name = req.body.user.name;
					user.LastName = req.body.user.lastname;
					user.Email = req.body.user.email;
				}else if(req.body.type == "password"){
					user.Password = req.body.user.password;
				}else if(req.body.type == "payment"){
					user.CardNum = req.body.user.cardNum;
				}else{
					console.log("Bad type");
					res.redirect('/');
				}
				
				user.save()
                    .then(function() {
						console.log('User succesfully saved');
                        res.redirect('/');
                    })
                    .error(function(error) {
                        next(error);
                    });
					
            } else {
                console.log('No existe el usuario con id='+id+'.');
                next('No existe el usuario con id='+id+'.');
            }
        })
        .error(function(error) {
            next(error);
        });
};

//Salt Generator
/*function createNewSalt() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
};*/

/*
 * Autenticar un usuario.
 *
 * Busca el usuario con el login dado en la base de datos y comprueba su password.
 * Si todo es correcto ejecuta callback(null,user).
 * Si la autenticación falla o hay errores se ejecuta callback(error).
 */
exports.autenticar = function(username, password, callback) {
    
    /*models.User.find({where: {username: username}})
        .then(function(user) {
            if (user) {
                console.log('Encontrado el usuario.');

                // if (user.hashed_password == "" && password == "") {
                //     callback(null,user);
                //     return;
                // }
                
                //var hash = encriptarPassword(password, user.salt);
                
                if (password === user.Password) {
                    callback(null,user);
                    return;
                }
            }
            callback(new Error('Password erroneo.'));
        })
        .error(function(err) {
            next(err);
        });*/
		
		//Allowing SQLInjection (auth as any user)
		db.get("SELECT * from Users WHERE Username='"+username+"' AND Password='"+password+"'",function(err,row){
			if(row){
				callback(null,row);
				return;
			}else{
				callback(new Error('Wrong Auth'));
			}
		});		
		
}; 