module.exports = function(sequelize, Sequelize, User) {
  console.log("\tfriendship model loaded");

  const Friendship = sequelize.define(
    "friendship",
    {
      // Attributes
    }
  );

  User.hasOne(Friendship, { foreignKey: "userId" });
  User.hasOne(Friendship, { foreignKey: "friendId" });

  return Friendship;
};
