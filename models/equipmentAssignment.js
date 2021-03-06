module.exports = function(sequelize, Sequelize, Equipment_Requirement) {
  const EquipmentAssignment = sequelize.define(
    "equipmentAssignment",
    {
      // attributes
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    }
  );

  Equipment_Requirement.hasMany(EquipmentAssignment, {
    foreignKey: "equipmentRequirementId"
  });

  return EquipmentAssignment;
};
