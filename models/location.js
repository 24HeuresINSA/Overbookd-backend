module.exports = function(sequelize, Sequelize) {
  console.log("\tlocation model loaded");

  return sequelize.define(
    "location",
    {
      // attributes
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT("medium")
      },
      gpsLng: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: false
      },
      gpsLat: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: false
      }
    }
  );
};
