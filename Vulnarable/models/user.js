
// Definicion de la clase User:

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User',
      { Username: {
            type: DataTypes.TEXT,
            validate: {
                notEmpty: { msg: "Username cannot be empty" }
            }
        },
        Name: {
            type: DataTypes.TEXT
        },
        LastName: {
            type: DataTypes.TEXT
        },
        Email: {
            type: DataTypes.TEXT,
			validate: {
                isEmail: { msg: "Email format incorrect" },
                notEmpty: { msg: "Email cannot be empty" }
            }
        },
        Password: {
            type: DataTypes.TEXT,
			validate: {
                notEmpty: { msg: "Password cannot be empty" }
            }
        },
		CardNum: {
            type: DataTypes.TEXT
        },
		Rating: {
            type: DataTypes.INTEGER,
			validate: {
                notEmpty: { msg: "Rating cannot be empty" }
            }
        }		
        
    });
}
