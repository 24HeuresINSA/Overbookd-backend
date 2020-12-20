const express = require('express');
const {keycloak, models} = require("../app")

let commentRouter = express.Router();

commentRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.CommentObject.findAll({where: req.query})
            .then(comment => res.send(comment))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user"), (req, res) => {
        models.CommentObject.create(req.body)
            .then(comment => res.send(comment))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user"), (req, res) => {
        models.CommentObject.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.CommentObject.findByPk(req.body.id)
                    .then(comment => res.send(comment))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user"), (req, res) => {
        models.CommentObject.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

module.exports = commentRouter;
