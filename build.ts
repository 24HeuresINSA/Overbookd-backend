/**
 * Remove old files, copy front-end ones.
 */

import fs from 'fs-extra';
import Logger from 'jet-logger';
import childProcess from 'child_process';
import { exit } from 'process';

// Setup logger
const logger = new Logger();
logger.timestamp = false;

(async () => {
  try {
    // Remove current build
    await remove('./dist/');
    // Copy production env file
    await copy('./src/pre-start/env/production.env', './dist/pre-start/env/production.env');
    // Copy back-end files
    await exec('tsc --build tsconfig.prod.json', './')

    await copy('dist/src', 'dist');
    await remove('dist/src');
  } catch (err) {
    logger.err(err);
    // panic to abort build process
    exit(-1);
  }
})();

function remove(loc: string): Promise<void> {
  return new Promise((res, rej) => {
    return fs.remove(loc, (err) => {
      return (!!err ? rej(err) : res());
    });
  });
}

function copy(src: string, dest: string): Promise<void> {
  return new Promise((res, rej) => {
    return fs.copy(src, dest, (err) => {
      return (!!err ? rej(err) : res());
    });
  });
}

function exec(cmd: string, loc: string): Promise<void> {
  return new Promise((res, rej) => {
    return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
      if (!!stdout) {
        logger.info(stdout);
      }
      if (!!stderr) {
        logger.err(stderr);
        rej(stderr);
      }
      return (!!err ? rej(err) : res());
    });
  });
}
