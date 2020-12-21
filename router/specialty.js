const express = require('express');
const {keycloak, models} = require("../app")

let specialityRouter = express.Router();

specialityRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Specialty.findAll({where: req.query})
            .then(specialty => res.send(specialty))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_admin"), (req, res) => {
        models.Specialty.create(req.body)
            .then(specialty => res.status(201).send(specialty))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_admin"), (req, res) => {
        models.Specialty.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.Specialty.findByPk(req.body.id)
                    .then(specialty => res.status(202).send(specialty))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_admin"), (req, res) => {
        models.Specialty.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

module.exports = specialityRouter;
