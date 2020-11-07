// Handles sequelize ORM and the database

const Sequelize = require("sequelize");
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;


//region DATABASE CONNECTION

let sequelize = new Sequelize("project_a", "project_a", DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST || "localhost" , //when running node in Docker container the host is the database container's name
    port: process.env.DATABASE_PORT || 3307, // if run locally the port
    dialect: "mysql",
    logging: false
});

/*
 *   Here we connect Sequelize to our database
 */
sequelize
    .authenticate()
    .then(() => {
        console.log("\nConnection successful with Sequelize\n");
    })
    .catch(err => {
        console.log("\nThere was an error during connection : \n" + err);
    });

//endregion

module.exports = sequelize;
