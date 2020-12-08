const express = require('express');

module.exports = function(models, keycloak){
    let router = express.Router();

    router.use("/activity", require("./activity")(models, keycloak));
    router.use("/availability", require("./availability")(models, keycloak));
    router.use("/comment", require("./comment")(models, keycloak));
    router.use("/equipment_assignment", require("./equipment_assignment")(models, keycloak));
    router.use("/equipment_requirement", require("./equipment_requirement")(models, keycloak));
    router.use("/equipment_type", require("./equipment_type")(models, keycloak));
    router.use("/equipment", require("./equipment")(models, keycloak));
    router.use("/event", require("./event")(models, keycloak));
    router.use("/friendship", require("./friendship")(models, keycloak));
    router.use("/location", require("./location")(models, keycloak));
    router.use("/notification", require("./notification")(models, keycloak));
    router.use("/shift_category", require("./shift_category")(models, keycloak));
    router.use("/shift", require("./shift")(models, keycloak));
    router.use("/specialty", require("./specialty")(models, keycloak));
    router.use("/task", require("./task")(models, keycloak));
    router.use("/team", require("./team")(models, keycloak));
    router.use("/user_assignment", require("./user_assignment")(models, keycloak));
    router.use("/user_requirement", require("./user_requirement")(models, keycloak));
    router.use("/user", require("./user")(models, keycloak));

    return router;
}