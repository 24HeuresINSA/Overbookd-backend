module.exports = function(sequelize, Sequelize) {
  console.log("\tequipment type model loaded");

  return sequelize.define(
    "equipmentType",
    {
      // attributes
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }
  );
};
