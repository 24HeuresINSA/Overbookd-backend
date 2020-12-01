require('dotenv').config()
const Sequelize = require("sequelize");
const sequelize = require("../sequelize")
const models = require("../models/import")(sequelize, Sequelize); // we retrieve the different models in a json object we will pass to the requests


const models_name = ["Activity", "User", "Team", "Notification", "Location", "Task", "Equipment_Type", "Equipment",
    "Shift_Category" , "Shift" , "Availability", "Equipment_Requirement", "Friendship",
    "User_Requirement", "CommentObject"]


sequelize
    .sync({force: false})
    .then(() => {
        models_name.forEach(
            (model_name) => {
                models[model_name].destroy({
                        where: {},
                    }
                ).then(
                    console.log(`Deleting ${model_name}`)
                ).catch((err) => {
                    console.error(err);
                })
            }
        )
    })

