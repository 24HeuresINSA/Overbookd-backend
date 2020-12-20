const express = require('express');
const {keycloak, models} = require("../app")

let notificationRouter = express.Router();

notificationRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Notification.findAll({where: req.query})
            .then(notification => res.send(notification))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_admin"), (req, res) => {
        models.Notification.create(req.body)
            .then(notification => res.send(notification))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_admin"), (req, res) => {
        models.Notification.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.Notification.findByPk(req.body.id)
                    .then(notification => res.send(notification))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_admin"), (req, res) => {
        models.Notification.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

notificationRouter.param("notification", (req, res, next, id) => {
    models.Notification.findByPk(id)
        .then(notification => {
            req.notification = notification;
            next();
        })
        .catch(err => next(err))
});

notificationRouter.put("/:notification/read", keycloak.protect("realm:user_admin"), (req, res) => {
    req.notification.status = "read";
    req.notification.save()
        .then(notification => res.send(notification))
        .catch(err => res.status(500).send(err));
});

notificationRouter.put("/:notification/unread", keycloak.protect("realm:user_admin"), (req, res) => {
    req.notification.status = "unread";
    req.notification.save()
        .then(notification => res.send(notification))
        .catch(err => res.status(500).send(err));
});

module.exports = notificationRouter;
