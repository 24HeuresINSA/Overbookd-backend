module.exports = function(
  sequelize,
  Sequelize,
  User,
  Activity,
  Location,
  Team
) {
  console.log("\ttask model loaded");

  const Task = sequelize.define(
    "task",
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
      }
    }
  );

  User.hasOne(Task, { foreignKey: "supervisorId" });

  Team.hasOne(Task, { foreignKey: "teamId" });

  Location.hasOne(Task, { foreignKey: "locationId" });

  Task.belongsTo(Activity, { foreignKey: "activityId" });

  return Task;
};
