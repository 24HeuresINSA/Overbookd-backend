module.exports = function(sequelize, Sequelize, ShiftCategory) {
  console.log("\tshift model loaded");

  const Shift = sequelize.define(
    "shift",
    {
      // attributes
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      charisma: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    }
  );

  Shift.belongsTo(ShiftCategory, { foreignKey: "shiftCategoryId" });

  return Shift;
};
