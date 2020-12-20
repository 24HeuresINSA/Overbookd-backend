require('dotenv').config()
const MySQL = require("mysql2/promise")

if (process.env.ENVIONMENT === "production") {
    // IF YOU ARE DELETING THIS I HOPE YOU KNOW WHAT YOU ARE DOING
    console.warn("This script can't be run un production 🛑")
    process.exit(0);
}

async function main() {
    const connection = await MySQL.createConnection({
        host: "localhost",
        user: "root",
        password: process.env.MYSQL_ROOT_PASSWORD,
        port: process.env.DATABASE_PORT
    });
    console.log("Connected to the database 🎉...");

    await connection.query("DROP DATABASE project_a;");
    console.log("Dropped Database 😵...");

    await connection.query("CREATE DATABASE project_a;");
    console.log("created new Database 🥳...");

    await connection.query("GRANT ALL PRIVILEGES ON project_a.* TO 'project_a'@'%';");
    console.log("Access granted to the API! 🥳🥳\nRestart the API for the changes to take effect.");

}


main().then(()=>{
    process.exit(0);
});
