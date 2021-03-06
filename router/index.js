const express = require('express');

let router = express.Router();

router.get("/", (_, res) => {
  res.status(301).redirect("https://orgassomakerify.debrej.fr/docs/api");
})

router.use("/activity", require("./activity"));
router.use("/availability", require("./availability"));
router.use("/comment", require("./comment"));
router.use("/equipmentAssignment", require("./equipmentAssignment"));
router.use("/equipmentRequirement", require("./equipmentRequirement"));
router.use("/equipmentType", require("./equipmentType"));
router.use("/equipment", require("./equipment"));
router.use("/event", require("./event"));
router.use("/friendship", require("./friendship"));
router.use("/location", require("./location"));
router.use("/notification", require("./notification"));
router.use("/shiftCategory", require("./shiftCategory"));
router.use("/shift", require("./shift"));
router.use("/specialty", require("./specialty"));
router.use("/task", require("./task"));
router.use("/team", require("./team"));
router.use("/userAssignment", require("./userAssignment"));
router.use("/userRequirement", require("./userRequirement"));
router.use("/user", require("./user"));

module.exports = router;
