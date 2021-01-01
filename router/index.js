const express = require('express');

let router = express.Router();

router.get("/", (_, res) => {
  res.status(301).redirect("https://orgassomakerify.debrej.fr/docs/api");
})

router.use("/activity", require("./activity"));
router.use("/availability", require("./availability"));
router.use("/comment", require("./comment"));
router.use("/equipment_assignment", require("./equipment_assignment"));
router.use("/equipment_requirement", require("./equipment_requirement"));
router.use("/equipment_type", require("./equipment_type"));
router.use("/equipment", require("./equipment"));
router.use("/event", require("./event"));
router.use("/friendship", require("./friendship"));
router.use("/location", require("./location"));
router.use("/notification", require("./notification"));
router.use("/shift_category", require("./shift_category"));
router.use("/shift", require("./shift"));
router.use("/specialty", require("./specialty"));
router.use("/task", require("./task"));
router.use("/team", require("./team"));
router.use("/user_assignment", require("./user_assignment"));
router.use("/user_requirement", require("./user_requirement"));
router.use("/user", require("./user"));

module.exports = router;
