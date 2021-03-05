module.exports = function(sequelize, Sequelize, Shift, User) {
  console.log("\tavailability model loaded");

  const Availability = sequelize.define(
    "availability",
    {
      // attributes
    }
  );

  User.hasMany(Availability, { foreignKey: "userId" });
  Shift.hasMany(Availability, { foreignKey: "shiftId" });

  return Availability;
};
