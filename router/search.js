const {Sequelize} = require('sequelize');
const express = require('express');
const {keycloak, models} = require("../app")

const Op = Sequelize.Op;
let searchRouter = express.Router();

searchRouter.get("/activity", keycloak.protect("realm:user"), (req, res) => {
  models.Activity.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.substring]: req.body.search_term
          }
        },
        {
          description: {
            [Op.substring]: req.body.search_term
          }
        },
        {
          contractor_name: {
            [Op.substring]: req.body.search_term
          }
        },
        {
          contractor_comment: {
            [Op.substring]: req.body.search_term
          }
        }
      ]
    }
  })
      .then(activity => res.send(activity))
      .catch(err => res.status(500).send(err));
});

searchRouter.get("/comment", keycloak.protect("realm:user"), (req, res) => {
  models.CommentObject.findAll({
    where: {
      [Op.or]: [
        {
          content: {
            [Op.substring]: req.body.search
          }
        }
      ]
    }
  })
      .then(comment => res.send(comment))
      .catch(err => res.status(500).send(err));
});

searchRouter.get("/equipment", keycloak.protect("realm:user"), (req, res) => {
  models.Equipment.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.substring]: req.body.search
          }
        },
        {
          description: {
            [Op.substring]: req.body.search
          }
        }
      ]
    }
  })
      .then(equipment => res.send(equipment))
      .catch(err => res.status(500).send(err));
});

searchRouter.get("/equipment_type", keycloak.protect("realm:user"), (req, res) => {
  models.Equipment_Type.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.substring]: req.body.search
          }
        }
      ]
    }
  })
      .then(equipment_type => res.send(equipment_type))
      .catch(err => res.status(500).send(err));
});

searchRouter.get("/event", keycloak.protect("realm:user"), (req, res) => {
  models.Event.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.substring]: req.body.search
          }
        },
        {
          description: {
            [Op.substring]: req.body.search
          }
        }
      ]
    }
  })
      .then(event => res.send(event))
      .catch(err => res.status(500).send(err));
});

searchRouter.get("/location", keycloak.protect("realm:user"), (req, res) => {
  models.Location.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.substring]: req.body.search
          }
        },
        {
          description: {
            [Op.substring]: req.body.search
          }
        }
      ]
    }
  })
      .then(location => res.send(location))
      .catch(err => res.status(500).send(err));
});

searchRouter.get("/task", keycloak.protect("realm:user"), (req, res) => {
  models.Task.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.substring]: req.body.search
          }
        },
        {
          description: {
            [Op.substring]: req.body.search
          }
        }
      ]
    }
  })
      .then(task => res.send(task))
      .catch(err => res.status(500).send(err));
});

searchRouter.get("/team", keycloak.protect("realm:user"), (req, res) => {
  models.Team.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.substring]: req.body.search
          }
        }
      ]
    }
  })
      .then(team => res.send(team))
      .catch(err => res.status(500).send(err));
});

searchRouter.get("/user", keycloak.protect("realm:user"), (req, res) => {
  models.User.findAll({
    where: {
      [Op.or]: [
        {
          first_name: {
            [Op.substring]: req.body.search
          }
        },
        {
          last_name: {
            [Op.substring]: req.body.search
          }
        },
        {
          surname: {
            [Op.substring]: req.body.search
          }
        },
        {
          comment: {
            [Op.substring]: req.body.search
          }
        },
        {
          experience: {
            [Op.substring]: req.body.search
          }
        },
        {
          incapacity: {
            [Op.substring]: req.body.search
          }
        }
      ]
    }
  })
      .then(user => res.send(user))
      .catch(err => res.status(500).send(err));
});

module.exports = searchRouter
