const express = require('express');
const {keycloak, models} = require("../app")

let activityRouter = express.Router();

activityRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Activity.findAll({where: req.query})
            .then(activity => res.send(activity))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.Activity.create(req.body)
            .then(activity => res.send(activity))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.Activity.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                Activity.findByPk(req.body.id)
                    .then(activity => res.send(activity))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.Activity.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

activityRouter.get("/location", keycloak.protect("realm:user"), (req, res) => {
    models.Activity.findAll({
        where: req.query,
        include: [
            {
                model: models.Location,
                through: {
                    attributes: []
                }
            }
        ]
    })
        .then(activity => res.send(activity))
        .catch(err => res.status(500).send(err));
});

activityRouter.param("activity", (req, res, next, id) => {
    models.Activity.findByPk(id)
        .then(activity => {
            req.activity = activity;
            next();
        })
        .catch(err => next(err));
})

activityRouter.route("/:activity/location", keycloak.protect("realm:user_modifier"))
    .put((req, res) => {
        req.activity.setLocations(req.body)
            .then(() => {
                req.activity.getLocations()
                    .then(locations => res.send(locations))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete((req, res) => {
        req.activity.removeLocations(req.body)
            .then(() => {
                req.activity.getLocations()
                    .then(locations => res.send(locations))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    });

module.exports = activityRouter;

