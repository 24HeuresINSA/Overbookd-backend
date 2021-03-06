module.exports = function(sequelize, Sequelize) {
  console.log("\tshift category model loaded");

  return sequelize.define(
    "shiftCategory",
    {
      // attributes
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }
  );
};
