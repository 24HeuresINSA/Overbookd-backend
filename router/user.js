const express = require('express');
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: global.appRoot + "/tmp/" });

module.exports = (models, keycloak) => {
    let router = express.Router();

    router.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.User.findAll({where: req.query})
        .then(user => res.send(user))
        .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user"), (req, res) => {
        models.User.create(req.body)
        .then(user => res.send(user))
        .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user"), (req, res) => {
        models.User.update(req.body, {where: {id: req.body.id}})
        .then(() => {
            models.User.findByPk(req.body.id)
            .then(user => res.send(user))
            .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_admin"), (req, res) => {
        models.User.destroy({where: {id: req.query.id}})
        .then(result => {
            if(result) res.sendStatus(204);
            else res.sendStatus(404);
        })
        .catch(err => res.status(500).send(err));
    });

    router.get("/team", keycloak.protect("realm:user"), (req, res) => {
        models.User.findAll({
            where: req.query,
            include: [
                {
                    model: models.Team,
                    as: "teams"
                }
            ]
        })
        .then(user => res.send(user))
        .catch(err => res.status(500).send(err));
    });

    router.param("user", (req, res, next, id) => {
        models.User.findByPk(id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => res.status(500).send(err));
    });

    router.put("/:user/validate", keycloak.protect("realm:user_affect"), (req, res) => {
        req.user.validity_status = true;
        req.user.save()
        .then(user => res.send(user))
        .catch(err => res.status(500).send(err));
    });

    router.put("/:user/invalidate", keycloak.protect("realm:user_affect"), (req, res) => {
        req.user.validity_status = false;
        req.user.save()
        .then(user => res.send(user))
        .catch(err => res.status(500).send(err));
    });

    router.route("/:user/team", keycloak.protect("realm:user_affect"))
    .post((req, res) => {
        req.user.addTeams(req.body)
        .then(teams => res.send(teams))
        .catch(err => res.status(500).send(err));
    })
    .delete((req, res) => {
        req.user.removeTeams(req.body)
        .then(teams => res.send(teams))
        .catch(err => res.status(500).send(err))
    });

    router.put("/:user/photo", keycloak.protect("realm:user"), 
    upload.single("file"), (req,res) => {
        const file = global.appRoot + "/uploads/user/profile_picture/" + req.file.filename;
        fs.rename(req.file.path, file, err => {
            if (err) res.sendStatus(500);
            else {
                req.user.profile_pic_url = req.file.filename;
                req.user.save()
                .then(user => res.send(user))
                .catch(err => res.status(500).send(err));
            }
        });
    });

    router.put("/:user/licence", keycloak.protect("realm:user"), 
    upload.single("file"), (req,res) => {
        const file = global.appRoot + "/uploads/user/licence/" + req.file.filename;
        fs.rename(req.file.path, file, err => {
            if (err) res.sendStatus(500);
            else {
                req.user.licence_scan_url = req.file.filename;
                req.user.save()
                .then(user => res.send(user))
                .catch(err => res.status(500).send(err));
            }
        });
    });

    return router;
}