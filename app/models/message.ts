import sequelize from "./index";
import * as Sequelize from "sequelize";

export default sequelize.define(
  "message",
  {
    body: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    tag: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    }
  },
  {
    underscored: true,
    updatedAt: false
  }
);
