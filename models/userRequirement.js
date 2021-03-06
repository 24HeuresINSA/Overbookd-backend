module.exports = function(sequelize, Sequelize, User, Team, Task, Shift) {
  console.log("\trequirement model loaded");

  const UserRequirement = sequelize.define(
    "userRequirement",
    {
      // attributes
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    }
  );

  User.hasMany(UserRequirement, { foreignKey: "userId" });
  Team.hasMany(UserRequirement, { foreignKey: "teamId" });
  Task.hasMany(UserRequirement, { foreignKey: "taskId" });
  Shift.hasMany(UserRequirement, { foreignKey: "shiftId" });

  return UserRequirement;
};
