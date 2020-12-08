const express = require('express');

module.exports = (models, keycloak) => {
    let router = express.Router();

    router.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Team.findAll({where: req.query})
        .then(team => res.send(team))
        .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user"), (req, res) => {
        models.Team.create(req.body)
        .then(team => res.send(team))
        .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user"), (req, res) => {
        models.Team.update(req.body, {where: {id: req.body.id}})
        .then(() => {
            models.Team.findByPk(req.body.id)
            .then(team => res.send(team))
            .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user"), (req, res) => {
        models.Team.destroy({where: {id: req.query.id}})
        .then(result => {
            if(result) res.sendStatus(204);
            else res.sendStatus(404);
        })
        .catch(err => res.status(500).send(err));
    });

    router.param("team", (req, res, next, id) => {
        models.Team.findByPk(id)
        .then(team => {
            req.team = team;
            next();
        })
        .catch(err => next(err));
    })

    router.get("/:team/members", keycloak.protect("realm:user"), (req, res) => {
        req.team.getUsers()
        .then(users => res.send(users))
        .catch(err => res.status(500).send(err));
    });

    return router;
}