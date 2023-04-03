#!/usr/bin/env node

const packageJson = require('../../package.json')

require('yargs/yargs')(process.argv.slice(2))
  .usage('Usage: mws COMMAND')
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'false',
  })
  .command(require('../commands/addRepoCommand'))
  .command(require('../commands/createCommand'))
  .command(require('../commands/initCommand'))
  .command(require('../commands/removeRepoCommand'))
  .command(require('../commands/updateCommand'))
  .version(packageJson.version)
  .demandCommand(1, '') // just print help
  .recommendCommands()
  .help()
  .alias('h', 'help').argv
