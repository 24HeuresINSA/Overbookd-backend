module.exports = function(sequelize, Sequelize, User, Availability) {
  const UserAssignment = sequelize.define(
    "userAssignment",
    {}
  );

  User.hasMany(UserAssignment, { foreignKey: "userId" });
  Availability.hasMany(UserAssignment, { foreignKey: "availabilityId" });

  return UserAssignment;
};
