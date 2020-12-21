const express = require('express');
const {keycloak, models} = require("../app")

let equipmentRequirementRouter = express.Router();

equipmentRequirementRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Equipment_Requirement.findAll({where: req.query})
            .then(equipment_requirement => res.send(equipment_requirement))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.Equipment_Requirement.create(req.body)
            .then(equipment_requirement => res.send(equipment_requirement))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.Equipment_Requirement.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.Equipment_Requirement.findByPk(req.body.id)
                    .then(equipment_requirement => res.send(equipment_requirement))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.Equipment_Requirement.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

module.exports = equipmentRequirementRouter;
