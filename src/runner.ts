#!/usr/bin/env tsx
import { Command } from 'commander'
import process from 'process'
import pullCommand, { type PullCommandArgs } from './commands/pull'
import pushCommand, { type PushCommandArgs } from './commands/push'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

const program = new Command()

program.name('shokli').description('A simple wrapper for Shopify theme development')

program
  .command('push')
  .description('Pushes changes to remote theme')
  .requiredOption('-s, --store <store>', 'Shopify store domain')
  .requiredOption('-t, --theme <themeId>', 'Theme ID', parseInt)
  .option('-f, --force', 'Allows pushing when repo is dirty', false)
  .action(async (options) => {
    await pushCommand(options as PushCommandArgs)
  })

program
  .command('pull')
  .description('Fetches json templates and settings from remote theme')
  .requiredOption('-s, --store <store>', 'Shopify store domain')
  .requiredOption('-t, --theme <themeId>', 'Theme ID', parseInt)
  .option('-f, --force', 'Allows pulling when repo is dirty', false)
  .action(async (options) => {
    await pullCommand(options as PullCommandArgs)
  })

program.parse(process.argv)
