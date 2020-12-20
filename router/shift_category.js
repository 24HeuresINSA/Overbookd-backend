const express = require('express');
const {keycloak, models} = require("../app")

let shiftCategoryRouter = express.Router();

shiftCategoryRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Shift_category.findAll({where: req.query})
            .then(shift_category => res.send(shift_category))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_admin"), (req, res) => {
        models.Shift_category.create(req.body)
            .then(shift_category => res.send(shift_category))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_admin"), (req, res) => {
        models.Shift_category.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.Shift_category.findByPk(req.body.id)
                    .then(shift_category => res.send(shift_category))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_admin"), (req, res) => {
        models.Shift_category.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

module.exports = shiftCategoryRouter;
