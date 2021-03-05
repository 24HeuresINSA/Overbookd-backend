const express = require('express');
const {keycloak, models} = require("../app")

let userAssignmentRouter = express.Router();

userAssignmentRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.UserAssignment.findAll({where: req.query})
            .then(userAssignment => res.send(userAssignment))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_affect"), (req, res) => {
        models.UserAssignment.create(req.body)
            .then(userAssignment => res.status(201).send(userAssignment))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_affect"), (req, res) => {
        models.UserAssignment.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.UserAssignment.findByPk(req.body.id)
                    .then(userAssignment => res.status(202).send(userAssignment))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_affect"), (req, res) => {
        models.UserAssignment.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

module.exports = userAssignmentRouter;
