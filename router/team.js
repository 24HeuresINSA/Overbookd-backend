const express = require('express');
const {keycloak, models} = require("../app")

let teamRouter = express.Router();

teamRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Team.findAll({where: req.query})
            .then(team => res.send(team))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_affect"), (req, res) => {
        models.Team.create(req.body)
            .then(team => res.status(201).send(team))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_affect"), (req, res) => {
        models.Team.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.Team.findByPk(req.body.id)
                    .then(team => res.status(202).send(team))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_affect"), (req, res) => {
        models.Team.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

teamRouter.param("team", (req, res, next, id) => {
    models.Team.findByPk(id)
        .then(team => {
            req.team = team;
            next();
        })
        .catch(err => next(err));
})

teamRouter.get("/:team/members", keycloak.protect("realm:user"), (req, res) => {
    req.team.getUsers()
        .then(users => res.send(users))
        .catch(err => res.status(500).send(err));
});

module.exports = teamRouter;
