#!/usr/bin/env node
import yargs from 'yargs/yargs'

import inquirer from 'inquirer'
import inquirerAutocompletePrompt from 'inquirer-autocomplete-prompt'

inquirer.registerPrompt('autocomplete',inquirerAutocompletePrompt)

/**
 * @see https://github.com/yargs/yargs/blob/master/docs/advanced.md
 */
yargs(process.argv.slice(2))
  .commandDir('cmds', {
    extensions: ['js', 'ts'],
  })
  .demandCommand()
  .help()
  .argv