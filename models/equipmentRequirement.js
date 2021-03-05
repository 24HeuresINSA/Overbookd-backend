module.exports = function(
  sequelize,
  Sequelize,
  Task,
  Activity,
  Equipment,
  Shift
) {
  const EquipmentRequirement = sequelize.define(
    "equipmentRequirement",
    {
      // attributes
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    }
  );

  Task.hasMany(EquipmentRequirement, { foreignKey: "taskId" });
  Activity.hasMany(EquipmentRequirement, { foreignKey: "activityId" });
  Equipment.hasMany(EquipmentRequirement, { foreignKey: "equipmentId" });
  Shift.hasMany(EquipmentRequirement, { foreignKey: "shiftId" });

  return EquipmentRequirement;
};
