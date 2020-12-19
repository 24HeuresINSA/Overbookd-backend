/*
* WARNING 🛑 DO NOT RUN THIS FILE TWICE OR IT WILL DUPLICATE DATA IN THE DATABASE
*
* this programme populate the database with dummy data
* */
require('dotenv').config()
const Sequelize = require("sequelize");
const sequelize = require("../sequelize")
const models = require("../models/import")(sequelize, Sequelize);
sequelize
    .sync({force: false})
    .then(() => {
        console.log("\nDatabase synced");

        Promise.all([
            models.Event.bulkCreate(require("./database/event.json")),
            models.Location.bulkCreate(require("./database/location.json")),
            models.Specialty.bulkCreate(require("./database/specialty.json")),
            models.Equipment_Type.bulkCreate(require("./database/equipment_type.json")),
            models.Shift_Category.bulkCreate(require("./database/shift_category.json"))
        ]).then(() => {
            Promise.all([
                models.User.bulkCreate(require("./database/user.json")),
                models.Equipment.bulkCreate(require("./database/equipment.json")),
                models.Shift_Category.bulkCreate(require("./database/shift_category.json")),
                models.Activity.bulkCreate(require("./database/activity.json"))
            ]).then(() => {
                Promise.all([
                    models.Team.bulkCreate(require("./database/team.json")),
                    models.Task.bulkCreate(require("./database/task.json"))
                ]).then(() => {
                    Promise.all([
                        models.CommentObject.bulkCreate(require("./database/comments.json")),
                        models.Notification.bulkCreate(require("./database/notification.json"))
                    ]).then(() => {
                        console.log("Database populated successfully 🥳");
                        process.exit(0);
                    })
                })
            })
        })
    }).catch(err => {
        console.log("Error during syncing :\n" + err);
        process.exit(1);
    });