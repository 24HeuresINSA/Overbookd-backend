module.exports = function(sequelize, Sequelize, Specialty) {
  console.log("\tuser model loaded");

  const User = sequelize.define(
    "user",
    {
      // attributes
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      surname: {
        type: Sequelize.STRING
      },
      birthday: {
        type: Sequelize.DATEONLY
      },

      phoneNumber: {
        type: Sequelize.STRING(15)
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },

      licenceDate: {
        type: Sequelize.DATE
      },
      licenceScanURL: {
        type: Sequelize.STRING
      },

      profilePicURL: {
        type: Sequelize.STRING,
        defaultValue: "images/defaultPicURL.jpg"
      },
      tshirtSize: {
        type: Sequelize.ENUM("XS", "S", "M", "L", "XL")
      },

      alcoholicBeverageConsumption: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      foodAndBeverageConsumption: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      balance: {
        type: Sequelize.DECIMAL(6, 2),
        defaultValue: 0.0,
        allowNull: false
      },

      comment: {
        type: Sequelize.TEXT("medium")
      },
      experience: {
        type: Sequelize.TEXT("medium")
      },
      incapacity: {
        type: Sequelize.TEXT("medium")
      },

      validityStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      keycloakUserId: {
        type: Sequelize.STRING,
        defaultValue: "",
        allowNull: false
      }
    }
  );

  User.belongsTo(Specialty, { foreignKey: "specialtyId" });

  return User;
};
