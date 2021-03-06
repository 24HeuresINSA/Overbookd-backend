module.exports = function(sequelize, Sequelize, User, Event) {
  console.log("\tactivity model loaded");

  const Activity = sequelize.define(
    "activity",
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
      contractorName: {
        type: Sequelize.STRING
      },
      contractorPhone: {
        type: Sequelize.STRING
      },
      contractorMail: {
        type: Sequelize.STRING
      },
      contractorComment: {
        type: Sequelize.STRING
      },
      contractorPresentOnEvent: {
        type: Sequelize.STRING
      }
    }
  );

  User.hasOne(Activity, { foreignKey: "supervisorId" });

  Activity.belongsTo(Event, { foreignKey: "eventId" });

  return Activity;
};
