module.exports = function(sequelize, Sequelize, User) {
  console.log("\tteam model loaded");

  const Team = sequelize.define(
    "team",
    {
      // attributes
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      confidenceLevel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10
      },
      color: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "#888888"
      }
    }
  );

  User.hasOne(Team, { foreignKey: "supervisorId" });

  return Team;
};
