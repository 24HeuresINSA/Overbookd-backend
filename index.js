const {app, sequelize} = require('./app');

/*
 *   Syncing the database mean that if there was a table missing from the database that we could have added, it will add this table.
 *   Once its done, we launch the server as we are ready to fulfill requests.
 * */

console.log("Loading requests...\n");
app.use("/", require("./router"));
console.log("\nLoading requests complete\n");

sequelize
    .sync({force: false})
    .then(() => {
        console.log("\nDatabase synced");
        app.listen(2424, function () {
            console.log("\n\tPROJECT_A LOADING COMPLETE");
            console.log("\nServer running on port 2424");
        });
    })
    .catch(err => {
        console.log("Error during syncing :\n" + err);
    });

//endregion
