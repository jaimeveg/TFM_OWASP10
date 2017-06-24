
var path = require('path');

var Sequelize = require('sequelize');

var sequelize = new Sequelize(null, null, null, 
            { dialect:  'sqlite',
              storage:  path.join(__dirname, '..', 'public', 'data', 'app.db')                           
            });


// Importar la definicion de las clases.
// La clase Xxxx se importa desde el fichero xxxx.js.
var User = sequelize.import(path.join(__dirname,'user'));
var Housing = sequelize.import(path.join(__dirname,'housing'));
var UserReview = sequelize.import(path.join(__dirname,'user_review'));
var HousingReview = sequelize.import(path.join(__dirname,'housing_review'));

// Relaciones

// La llamada User.hasMany(Post); 
//  - crea un atributo llamado UserId en el modelo de Post  
//  - y en el prototipo de User se crean los metodos getPosts, setPosts,
//    addPost, removePost, hasPost y hasPosts.
//
// Como el atributo del modelo Post que apunta a User se llama AuthorId 
// en vez de UserId, he añadido la opcion foreignKey.
User.hasMany(Housing, {foreignKey: 'UserId'});
User.hasMany(UserReview, {foreignKey: 'AuthorId'});
User.hasMany(HousingReview, {foreignKey: 'AuthorId'});

Housing.hasMany(HousingReview);
User.hasMany(UserReview);
// La llamada Post.belongsTo(User);
//  - crea en el modelo de Post un atributo llamado UserId,
//  - y en el prototipo de Post se crean los metodos getUser y setUser.
//
// Como el atributo del modelo Post que apunta a User se llama AuthorId 
// en vez de UserId, he añadido la opcion foreignKey.
// 
// Con el uso de la opcion "as" la relacion se llama Author, y los metodos
// de acceso creados son setAuthor y getAuthor. 
Housing.belongsTo(User, {as: 'Owner', foreignKey: 'UserId'});

UserReview.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});
HousingReview.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});

HousingReview.belongsTo(Housing);
UserReview.belongsTo(User);

// Exportar los modelos:
exports.User = User;
exports.Housing = Housing;
exports.UserReview = UserReview;
exports.HousingReview = HousingReview;

// Crear las tablas en la base de datos que no se hayan creado aun.
// En un futuro lo haremos con migraciones.
sequelize.sync();
