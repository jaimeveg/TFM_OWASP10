// Middleware: Se requiere hacer login.
//
// Si el usuario ya hizo login anteriormente entonces existira 
// el objeto user en req.session, por lo que continuo con los demas 
// middlewares o rutas.
// Si no existe req.session.user, entonces es que aun no he hecho 
// login, por lo que me redireccionan a una pantalla de login. 
// Guardo cual es mi url para volver automaticamente a esa url 
// despues de hacer login. 
//
exports.loginRequired = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login?redir=' + (req.param('redir') || req.url));
    }
};


// Formulario para hacer login
//
// Es la tipica ruta REST que devuelve un formulario para crear 
// un nuevo recurso.
// Paso como parametro el valor de redir (es una url a la que 
// redirigirme despues de hacer login) que me han puesto en la 
// query (si no existe uso /).
//
exports.new = function(req, res) {

    res.render('session/new', 
               { redir: req.query.redir || '/'
               });
};


// Crear la sesion, es decir, hacer el login.
//
// El formulario mostrado por /login usa como action este metodo.
// Cojo los parametros que se han metido en el formulario y hago 
// login con ellos, es decir crea la sesion.
// Uso el metodo autenticar exportado por user_controller para 
// comprobar los datos introducidos.
// Si la autenticacion falla, me redirijo otra vez al formulario 
// de login.
// Notar que el valor de redir lo arrastro siempre. 
exports.create = function(req, res) {

    var redir = req.body.redir || '/'
    var date = new Date(); 

    // console.log('REDIR = ' + redir);

    var username  = req.body.user.username;
    var password  = req.body.user.password;
    var hour      = Date.now();

    console.log('Username = ' + username);
    console.log('Password = ' + password);

	//Use userController to check the login
	// Function is the callback
    var uc = require('./userController');
    uc.autenticar(username, password, function(error, user) {

        if (error) {
            console.log('Se ha producido un error: '+error);
            res.redirect("/ErrorAlIniciarSesion");        
            return;
        }

        // IMPORTANTE: creo req.session.user.
        // Solo guardo algunos campos del usuario en la sesion.
        // Esto es lo que uso para saber si he hecho login o no.
        req.session.user = {id:user.id, username:user.username, name:user.name, hour:hour};
	console.log("He creado un usuario en %d",req.session.user.hour);

        // Vuelvo al url indicado en redir
        res.redirect("/users/"+username);
    });
}; 


// Logout
// 
// Para salir de la session simplemente destruyo req.session.user
//
exports.destroy = function(req, res) {

    delete req.session.user;
    req.flash('success', 'Logout.');
    res.redirect("/login");     
};

// TIMEOUT
exports.timeout = function(req, res, next) {

    if(req.session.user){
	console.log("Hay usuario");
	diferencia = (Date.now() - req.session.user.hour);
	console.log("Diferencia %d",diferencia);
	if(diferencia > 30000){  // Date.now() devuelve milisegundos
	
	console.log("Tiempo excedido");
	delete req.session.user;
	req.flash('error', 'Timeout');
	res.redirect("/");
	}  else { 

	req.session.user.hour = Date.now(); 
	next();
	}
    }else {
	next();
    }
};