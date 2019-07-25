import { Sequelize } from "sequelize";
import config from "../../config/config";

function InitSequelize() {
  const env = process.env.NODE_ENV || "development";
  let currentConfig = config[env].database;
  if (currentConfig.use_env_variable) {
    return new Sequelize(
      process.env[currentConfig.use_env_variable],
      currentConfig
    );
  } else {
    return new Sequelize(
      currentConfig.database,
      currentConfig.username,
      currentConfig.password,
      currentConfig
    );
  }
}

export default InitSequelize();
