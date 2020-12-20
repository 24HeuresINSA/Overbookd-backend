const express = require('express');
const multer = require("multer");
const fs = require("fs");
const {keycloak, models} = require("../app")

const upload = multer({dest: global.appRoot + "/tmp/"});

let eventRouter = express.Router();

eventRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Event.findAll({where: req.query})
            .then(event => res.send(event))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_admin"), (req, res) => {
        models.Event.create(req.body)
            .then(event => res.status(201).send(event))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_admin"), (req, res) => {
        models.Event.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.Event.findByPk(req.body.id)
                    .then(event => res.status(2012).send(event))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_admin"), (req, res) => {
        models.Event.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

eventRouter.put("/:event/photo", keycloak.protect("realm:user_admin"),
    upload.single("file"), (req, res) => {
        const file = global.appRoot + "/uploads/event/" + req.file.filename;
        fs.rename(req.file.path, file, err => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                models.Event.update({logo_url: req.file.filename}, {where: {id: req.params.event}})
                    .then(() => {
                        models.Event.findByPk(req.body.id)
                            .then(event => res.send(event))
                            .catch(err => res.status(500).send(err));
                    })
                    .catch(err => res.status(500).send(err));
            }
        });
    });

module.exports = eventRouter;
