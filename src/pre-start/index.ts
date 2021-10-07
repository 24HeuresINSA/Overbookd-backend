/**
 * Pre-start is where we want to place things that must run BEFORE the express server is started.
 * This is useful for environment variables, command-line arguments, and cron-jobs.
 */

import path from "path";
import dotenv from "dotenv";
import commandLineArgs from "command-line-args";import ConfigModel from "@entities/Config";
import * as INITIAL_CONFIG from './init_configs.json';
import logger from "@shared/Logger";


(async () => {
  // Setup command line options
  const options = commandLineArgs([
    {
      name: "env",
      alias: "e",
      defaultValue: "development",
      type: String,
    },
  ]);
  // Set the env file
  const result2 = dotenv.config({
    path: path.join(__dirname, `env/${options.env}.env`),
  });
  if (result2.error) {
    throw result2.error;
  }

    // setup initial config
    const setConfigs = await ConfigModel.find();
    if (setConfigs){
        // @ts-ignore
        for (const config of INITIAL_CONFIG.default) {
            // check if config is already set
            let isConfigSet = setConfigs.find(c => c.key === config.key);
            if (!isConfigSet){
                logger.info(`config dont exist: ${config.key}`)
                await ConfigModel.create({
                    key: config.key,
                    value: config.value,
                })
                logger.info(`config created ${config.key}`)

            }
        }
    }
})();


