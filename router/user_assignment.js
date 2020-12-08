const express = require('express');

module.exports = (models, keycloak) => {
    let router = express.Router();

    router.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.User_Assignment.findAll({where: req.query})
        .then(user_assignment => res.send(user_assignment))
        .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user"), (req, res) => {
        models.User_Assignment.create(req.body)
        .then(user_assignment => res.send(user_assignment))
        .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user"), (req, res) => {
        models.User_Assignment.update(req.body, {where: {id: req.body.id}})
        .then(() => {
            models.User_Assignment.findByPk(req.body.id)
            .then(user_assignment => res.send(user_assignment))
            .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user"), (req, res) => {
        models.User_Assignment.destroy({where: {id: req.query.id}})
        .then(result => {
            if(result) res.sendStatus(204);
            else res.sendStatus(404);
        })
        .catch(err => res.status(500).send(err));
    });

    return router;
}