module.exports = function(sequelize, Sequelize, User, Activity, Task) {
  console.log("\tcomment model loaded");

  const CommentObject = sequelize.define(
    "commentObject",
    {
      // attributes
      content: {
        type: Sequelize.TEXT("medium"),
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }
  );

  User.hasOne(CommentObject, { foreignKey: "userId" });
  Activity.hasOne(CommentObject, { foreignKey: "activityId" });
  Task.hasOne(CommentObject, { foreignKey: "taskId" });

  return CommentObject;
};
