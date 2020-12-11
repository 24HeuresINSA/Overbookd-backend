const express = require('express');

module.exports = (models, keycloak) => {
    let router = express.Router();

    router.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Friendship.findAll({where: req.query})
        .then(friendship => res.send(friendship))
        .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user"), (req, res) => {
        models.Friendship.bulkCreate(req.body)
        .then(friendship => res.send(friendship))
        .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user"), (req, res) => {
        models.Friendship.update(req.body, {where: {id: req.body.id}})
        .then(() => {
            models.Friendship.findByPk(req.body.id)
            .then(friendship => res.send(friendship))
            .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user"), (req, res) => {
        models.Friendship.destroy({where: {id: req.query.id}})
        .then(result => {
            if(result) res.sendStatus(204);
            else res.sendStatus(404);
        })
        .catch(err => res.status(500).send(err));
    });

    return router;
}