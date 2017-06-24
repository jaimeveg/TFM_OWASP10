
// Definicion del modelo Post:

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Housing',
      { City: {
           type: DataTypes.STRING,
           validate: {
              notEmpty: {msg: "City cannot be empty"}
           }
        },
		Address: {
           type: DataTypes.STRING,
           validate: {
              notEmpty: {msg: "Address cannot be empty"}
           }
        },
		Occupancy: {
           type: DataTypes.STRING
        },
		MaxPeople: {
           type: DataTypes.INTEGER,
		   validate: {
              notEmpty: {msg: "People cannot be empty"}
           }
        },
        Description: {
           type: DataTypes.STRING
        },
		Image: {
           type: DataTypes.TEXT
        },
		Rating: {
           type: DataTypes.INTEGER,
           validate: {
              notEmpty: {msg: "Rating cannot be empty"}
           }
        },
      });
}
