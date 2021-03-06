module.exports = function(sequelize, Sequelize, User, Team) {
  console.log("\tnotification model loaded");

  const Notification = sequelize.define(
    "notification",
    {
      // attributes
      content: {
        type: Sequelize.TEXT("medium"),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM("unread", "read"),
        defaultValue: "unread",
        allowNull: false
      }
    }
  );

  User.hasOne(Notification, { foreignKey: "userId" });
  Team.hasOne(Notification, { foreignKey: "teamId" });

  return Notification;
};
