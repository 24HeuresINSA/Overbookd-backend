const express = require('express');
const {keycloak, models} = require("../app")

let equipmentAssignmentRouter = express.Router();

equipmentAssignmentRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.EquipmentAssignment.findAll({where: req.query})
            .then(equipmentAssignment => res.send(equipmentAssignment))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_log"), (req, res) => {
        models.EquipmentAssignment.create(req.body)
            .then(equipmentAssignment => res.send(equipmentAssignment))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_log"), (req, res) => {
        models.EquipmentAssignment.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.EquipmentAssignment.findByPk(req.body.id)
                    .then(equipmentAssignment => res.send(equipmentAssignment))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_log"), (req, res) => {
        models.EquipmentAssignment.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

module.exports = equipmentAssignmentRouter;
