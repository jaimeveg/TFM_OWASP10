
// Definicion del modelo Comment:

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('HousingReview',
      { Review: {
            type: DataTypes.TEXT,
            validate: {
                notEmpty: { msg: "The review cannot be empty" }
            }
        },
		Rating: {
			type: DataTypes.INTEGER,
			validate: {
                notEmpty: { msg: "The rating cannot be empty" }
            }
		}
      });
}

