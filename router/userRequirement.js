const express = require('express');
const {Sequelize} = require('sequelize');
const {keycloak, models} = require("../app")

const Op = Sequelize.Op;
let userRequirementRouter = express.Router();

userRequirementRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.UserRequirement.findAll({where: req.query})
            .then(userRequirement => res.send(userRequirement))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user"), (req, res) => {
        models.UserRequirement.create(req.body)
            .then(userRequirement => res.status(201).send(userRequirement))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user"), (req, res) => {
        models.UserRequirement.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.UserRequirement.findByPk(req.body.id)
                    .then(userRequirement => res.status(202).send(userRequirement))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user"), (req, res) => {
        models.UserRequirement.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

userRequirementRouter.param("userRequirement", (req, res, next, id) => {
    models.UserRequirement.findByPk(id)
        .then(userRequirement => {
            req.userRequirement = userRequirement;
            next();
        })
        .catch(err => next(err));
});

userRequirementRouter.get("/:userRequirement/users", keycloak.protect("realm:user"), (req, res) => {
    if (req.userRequirement.userId) {
        models.User.findByPk(req.userRequirement.userId)
            .then(user => res.send(user))
            .catch(err => res.status(500).send(err));
    } else if (req.userRequirement.teamId) {
        models.Team.findByPk(req.userRequirement.teamId)
            .then(team => {
                team.getUsers()
                    .then(users => res.send(users))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    }
});

userRequirementRouter.get("/window", keycloak.protect("realm:user"), (req, res) => {
    models.Shift.findAll({
        where: {
            startDate: {
                [Op.gte]: new Date(req.body.startDate)
            },
            endDate: {
                [Op.lte]: new Date(req.body.endDate)
            }
        }
    })
        .then(shifts => {
            let shiftIds = [];
            shifts.forEach(shift => shiftIds.push(shift.id));
            models.UserRequirement.findAll({where: {shiftId: shiftIds}})
                .then(requirements => res.send(requirements))
                .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
});

module.exports = userRequirementRouter;
