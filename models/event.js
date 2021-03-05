module.exports = function(sequelize, Sequelize) {
  console.log("\tevent model loaded");

  return sequelize.define(
    "event",
    {
      // attributes
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT("medium")
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      logoURL: {
        type: Sequelize.STRING,
        defaultValue: "eventLogoDefault.png"
      }
    }
  );
};
