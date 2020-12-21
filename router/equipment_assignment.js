const express = require('express');
const {keycloak, models} = require("../app")

let equipmentAssignmentRouter = express.Router();

equipmentAssignmentRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Equipment_Assignment.findAll({where: req.query})
            .then(equipment_assignment => res.send(equipment_assignment))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_log"), (req, res) => {
        models.Equipment_Assignment.create(req.body)
            .then(equipment_assignment => res.send(equipment_assignment))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_log"), (req, res) => {
        models.Equipment_Assignment.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.Equipment_Assignment.findByPk(req.body.id)
                    .then(equipment_assignment => res.send(equipment_assignment))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_log"), (req, res) => {
        models.Equipment_Assignment.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

module.exports = equipmentAssignmentRouter;
