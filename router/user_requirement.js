const express = require('express');
const {Sequelize} = require('sequelize');
const {keycloak, models} = require("../app")

const Op = Sequelize.Op;
let userRequirementRouter = express.Router();

userRequirementRouter.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.User_Requirement.findAll({where: req.query})
            .then(user_requirement => res.send(user_requirement))
            .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user"), (req, res) => {
        models.User_Requirement.create(req.body)
            .then(user_requirement => res.send(user_requirement))
            .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user"), (req, res) => {
        models.User_Requirement.update(req.body, {where: {id: req.body.id}})
            .then(() => {
                models.User_Requirement.findByPk(req.body.id)
                    .then(user_requirement => res.send(user_requirement))
                    .catch(err => res.status(500).send(err));
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user"), (req, res) => {
        models.User_Requirement.destroy({where: {id: req.query.id}})
            .then(result => {
                if (result) res.sendStatus(204);
                else res.sendStatus(404);
            })
            .catch(err => res.status(500).send(err));
    });

userRequirementRouter.param("user_requirement", (req, res, next, id) => {
    models.User_Requirement.findByPk(id)
        .then(user_requirement => {
            req.user_requirement = user_requirement;
            next();
        })
        .catch(err => next(err));
});

userRequirementRouter.get("/:user_requirement/users", keycloak.protect("realm:user"), (req, res) => {
    if (req.user_requirement.user_id) {
        models.User.findByPk(req.user_requirement.user_id)
            .then(user => res.send(user))
            .catch(err => res.status(500).send(err));
    } else if (req.user_requirement.team_id) {
        models.Team.findByPk(req.user_requirement.team_id)
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
            start_date: {
                [Op.gte]: new Date(req.body.start_date)
            },
            end_date: {
                [Op.lte]: new Date(req.body.end_date)
            }
        }
    })
        .then(shifts => {
            let shift_ids = [];
            shifts.forEach(shift => shift_ids.push(shift.id));
            models.User_Requirement.findAll({where: {shift_id: shift_ids}})
                .then(requirements => res.send(requirements))
                .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
});

module.exports = userRequirementRouter;
