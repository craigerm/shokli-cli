import { execa } from 'execa'
import path from 'path'
import { logger } from './logger'

export type Theme = {
  id: number
  name: string
  role: 'development' | 'unpublished' | 'published' | 'live'
}

async function fetchThemes(store: string) {
  const res = await execa('shopify', ['theme', 'list', `--store=${store}`, '--json'])
  return JSON.parse(res.stdout) as Theme[]
}

export async function fetchLiveTheme(store: string) {
  const res = await execa('shopify', [
    'theme',
    'list',
    `--store=${store}`,
    '--json',
    '--role=live',
  ])
  const themes = JSON.parse(res.stdout) as Theme[]
  return themes[0]
}

export async function fetchThemeById(store: string, themeId: number) {
  const themes = await fetchThemes(store)
  const theme: Theme | undefined = themes.find((theme) => theme.id === themeId)

  if (!theme) {
    logger.error(`Could not find theme with id: ${themeId}`)
    process.exit(1)
  }
  return theme
}

export async function displayThemeInfo(context: CommandContext) {
  await execa({
    stdout: 'inherit',
    stderr: 'inherit',
  })`shopify theme info --store=${context.store} --theme=${context.themeId}`
}

export async function pushTheme(context: CommandContext) {
  await execa({
    stdout: 'inherit',
    stderr: 'inherit',
  })`shopify theme push --store=${context.store} --theme=${context.themeId}`
}

export async function pullData(store: string, themeId: number) {
  const folder = path.join(process.cwd(), 'src', 'data')
  await execa({
    stdout: 'inherit',
    stderr: 'inherit',
  })`shopify theme pull
      --force --path ${folder}
      --store=${store}
      --theme=${themeId}
      --only=templates/*.json
      --only=config/settings_data.json`
}
