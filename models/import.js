module.exports = function(sequelize, Sequelize) {
  let db = {};

  db.Specialty = require("./specialty")(sequelize, Sequelize);
  db.User = require("./user")(sequelize, Sequelize, db.Specialty);
  db.Team = require("./team")(sequelize, Sequelize, db.User);
  db.Notification = require("./notification")(
    sequelize,
    Sequelize,
    db.User,
    db.Team
  );

  db.Location = require("./location")(sequelize, Sequelize);
  db.Event = require("./event")(sequelize, Sequelize);
  db.Activity = require("./activity")(sequelize, Sequelize, db.User, db.Event);
  db.Task = require("./task")(
    sequelize,
    Sequelize,
    db.User,
    db.Activity,
    db.Location,
    db.Team
  );
  db.CommentObject = require("./comment")(
    sequelize,
    Sequelize,
    db.User,
    db.Activity,
    db.Task
  );

  db.EquipmentType = require("./equipmentType")(sequelize, Sequelize);
  db.Equipment = require("./equipment")(
    sequelize,
    Sequelize,
    db.EquipmentType,
    db.Location
  );

  db.ShiftCategory = require("./shiftCategory")(sequelize, Sequelize);
  db.Shift = require("./shift")(sequelize, Sequelize, db.ShiftCategory);

  /**
   * Creation of table availability which represents which shifts a user is available on
   */

  db.Availability = require("./availability")(
    sequelize,
    Sequelize,
    db.Shift,
    db.User
  );

  db.UserRequirement = require("./userRequirement")(
    sequelize,
    Sequelize,
    db.User,
    db.Team,
    db.Task,
    db.Shift
  );

  db.UserAssigment = require("./userAssignment")(
    sequelize,
    Sequelize,
    db.User,
    db.Availability
  );

  db.EquipmentRequirement = require("./equipmentRequirement")(
    sequelize,
    Sequelize,
    db.Task,
    db.Activity,
    db.Equipment,
    db.Shift
  );

  db.EquipmentAssignment = require("./equipmentAssignment")(
    sequelize,
    Sequelize,
    db.EquipmentRequirement
  );

  /**
   * Table userTeam which represents in which teams users are
   */
  db.User.belongsToMany(db.Team, { through: "userTeam" });
  db.Team.belongsToMany(db.User, { through: "userTeam" });

  /**
   * Table friend which represents friendship between users
   */
  db.Friendship = require("./friendship")(sequelize, Sequelize, db.User);

  /**
   * Table activityLocation which represents on which location(s) activities are located
   */
  db.Activity.belongsToMany(db.Location, { through: "activityLocation" });
  db.Location.belongsToMany(db.Activity, { through: "activityLocation" });

  return db;
};
