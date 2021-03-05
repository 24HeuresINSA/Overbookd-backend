module.exports = function(sequelize, Sequelize, Equipment_Type, Location) {
  console.log("\tequipment model loaded");

  const Equipment = sequelize.define(
    "equipment",
    {
      // attributes
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT("medium")
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    }
  );

  Equipment.belongsTo(Equipment_Type, { foreignKey: "equipmentTypeId" });

  Location.hasOne(Equipment, { foreignKey: "pickupLocation" });
  Location.hasOne(Equipment, { foreignKey: "dropLocation" });

  return Equipment;
};
