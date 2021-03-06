const express = require('express');
const {keycloak, models} = require("../app")

let equipmentTypeRouter = express.Router();

equipmentTypeRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.EquipmentType.findAll({where: req.query})
            .then(equipmentType => res.send(equipmentType))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_log"), (req, res) => {
        models.EquipmentType.create(req.body)
            .then(equipmentType => res.status(201).send(equipmentType))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_log"), (req, res) => {
        models.EquipmentType.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.EquipmentType.findByPk(req.body.id)
                    .then(equipmentType => res.status(202).send(equipmentType))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_log"), (req, res) => {
        models.EquipmentType.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

module.exports = equipmentTypeRouter;
