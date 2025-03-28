import simpleGit from 'simple-git'
import { logger } from '../lib/logger'
import { fetchThemeById, pullData } from '../lib/shopify-cli-wrapper'

export type PullCommandArgs = {
  store: string
  theme: number
  force: boolean
}

export default async function pullCommand(options: PullCommandArgs) {
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
  logger.box(`Pulling from: ${theme.name} - ${theme.id} (${theme.role})`)

  await pullData(options.store, options.theme)
}
