const express = require('express');
const {keycloak, models} = require("../app")

let equipmentRequirementRouter = express.Router();

equipmentRequirementRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.EquipmentRequirement.findAll({where: req.query})
            .then(equipmentRequirement => res.send(equipmentRequirement))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.EquipmentRequirement.create(req.body)
            .then(equipmentRequirement => res.send(equipmentRequirement))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.EquipmentRequirement.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.EquipmentRequirement.findByPk(req.body.id)
                    .then(equipmentRequirement => res.send(equipmentRequirement))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.EquipmentRequirement.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

module.exports = equipmentRequirementRouter;
