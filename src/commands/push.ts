import chalk from 'chalk'
import { simpleGit } from 'simple-git'
import { logger } from '../lib/logger'
import { fetchThemeById, pushTheme } from '../lib/shopify-cli-wrapper'

export type PushCommandArgs = {
  store: string
  theme: number
  force: boolean
}

export default async function pushCommand(options: PushCommandArgs) {
  const status = await simpleGit().status()

  if (options.force === false) {
    if (!status.isClean()) {
      logger.error(
        'You have uncommited changes in your repo, please commit or stash and try again or pass --force to ignore this warning.'
      )
      return
    }
  }

  const theme = await fetchThemeById(options.store, options.theme)

  if (theme.role !== 'unpublished') {
    logger.error('You can only push to an unpublished theme')
    process.exit(1)
  }

  logger.box(
    `Pushing changes to: ${theme.name} - ${theme.id} (${theme.role})\n${chalk.gray(options.store)}`
  )

  await pushTheme({ store: options.store, themeId: options.theme })
}
