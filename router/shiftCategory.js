const express = require('express');
const {keycloak, models} = require("../app")

let shiftCategoryRouter = express.Router();

shiftCategoryRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
       models.ShiftCategory.findAll({where: req.query})
            .then(shiftCategory => res.send(shiftCategory))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_admin"), (req, res) => {
       models.ShiftCategory.create(req.body)
            .then(shiftCategory => res.status(201).send(shiftCategory))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_admin"), (req, res) => {
       models.ShiftCategory.update(req.body, {where: {id: req.body.id}})
            .then(() => {
               models.ShiftCategory.findByPk(req.body.id)
                    .then(shiftCategory => res.status(202).send(shiftCategory))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_admin"), (req, res) => {
       models.ShiftCategory.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

module.exports = shiftCategoryRouter;
