/*
* WARNING 🛑 DO NOT RUN THIS FILE TWICE OR IT WILL DUPLICATE DATA IN THE DATABASE
*
* this program populate the database with dummy data
* */
require('dotenv').config()
const Sequelize = require("sequelize");
const sequelize = require("../sequelize")
const models = require("../models/import")(sequelize, Sequelize);
sequelize
    .sync({force: false})
    .then(async () => {
        console.log("\nDatabase synced");

        await Promise.all([
            models.Event.bulkCreate(require("./database/event.json")),
            models.Location.bulkCreate(require("./database/location.json")),
            models.Specialty.bulkCreate(require("./database/specialty.json")),
            models.Equipment_Type.bulkCreate(require("./database/equipment_type.json")),
            models.Shift_Category.bulkCreate(require("./database/shift_category.json"))
        ])
        await Promise.all([
            models.Shift.bulkCreate(require("./database/shift.json")),
            models.User.bulkCreate(require("./database/user.json")),
            models.Equipment.bulkCreate(require("./database/equipment.json")),
        ])
        await Promise.all([
            models.Activity.bulkCreate(require("./database/activity.json")),
            models.Team.bulkCreate(require("./database/team.json")),
        ])
        await models.Task.bulkCreate(require("./database/task.json"))
        await Promise.all([
            models.CommentObject.bulkCreate(require("./database/comments.json")),
            models.Notification.bulkCreate(require("./database/notification.json"))
        ])

        console.log("Database populated successfully 🥳");
        process.exit(0);
    }).catch(err => {
        console.log("Error during syncing :\n" + err);
        process.exit(1);
    });
