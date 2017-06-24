var sqlite = require('sqlite3');
var path = require('path');

var models = require('../models');
var db = new sqlite.Database(path.join(__dirname, '..', 'public', 'data', 'app.db'));

/*
*  Autoloading :houseid
*/
exports.loadHouseId = function(req, res, next, houseid) {
   models.Housing
        .find({where: {id: houseid}})
        .then(function(house) {
            if (house) {
                req.house = house;
                next();
            } else {
                console.log('No existe el housing con id='+id+'.');
                next('No existe el housing con id='+id+'.');
            }
        })
        .error(function(error) {
            next(error);
        });
};


//Create method: New User
// POST /housing/create
exports.create = function(req, res, next) {

    var city = req.body.house.city;
    var address = req.body.house.address;
	//Este eval lo quitaremos y pondremos uno al meter el rating en las reviews
    var maxPeople = eval(req.body.house.people);
	var description = req.body.house.description;
	var owner = req.session.user.id;
	
	var house = models.Housing.build(
        { City: city,
          Address:  address,
          MaxPeople: maxPeople,
		  Description: description,
		  Owner: owner,
		  Rating: 0
        });
	
	house.save()
         .then(function() {
			console.log('User succesfully created');
            res.redirect('/users/'+req.session.user.username);
         })
         .error(function(error) {
            next(error);
         });
	
};

// GET /housing/new
//Show User information
exports.new = function(req, res, next) {
    res.render('housingNew');
};

// GET /housing/houseid
//Show User information
exports.show = function(req, res, next) {
	console.log("Showing user: "+ req.house.Address);
    res.render('housingInfo', {house: req.house});
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