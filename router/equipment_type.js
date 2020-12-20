const express = require('express');
const {keycloak, models} = require("../app")

let equipmentTypeRouter = express.Router();

equipmentTypeRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Equipment_Type.findAll({where: req.query})
            .then(equipment_type => res.send(equipment_type))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_log"), (req, res) => {
        models.Equipment_Type.create(req.body)
            .then(equipment_type => res.send(equipment_type))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_log"), (req, res) => {
        models.Equipment_Type.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.Equipment_Type.findByPk(req.body.id)
                    .then(equipment_type => res.send(equipment_type))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_log"), (req, res) => {
        models.Equipment_Type.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

module.exports = equipmentTypeRouter;
