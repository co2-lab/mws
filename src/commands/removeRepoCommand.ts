import path from 'path'
import prompts from 'prompts'
import { removeRepo } from '#src/lib/removeRepo'
import { loadWorkspaceConfig } from '#src/lib/workspaceConfig'
import { status } from '#src/lib/git'

export const command = 'remove-repo'
export const desc = 'Remove a repository from workspace'
export const builder = function (yargs) {}

export const handler = function (argv) {
  ;(async () => {
    await removeRepoCommand({ verbose: !!argv.verbose })
  })().catch(err => {
    console.error(err)
    process.exit(1)
  })
}

async function removeRepoCommand(options: { verbose: boolean }) {
  const config = loadWorkspaceConfig()
  const defaults = { hasChanges: false }
  const answers = await prompts([
    {
      type: 'select',
      name: 'repoFolder',
      message: 'Which folder do you want to remove ?',
      choices: (config.repositories ?? []).map(repo => {
        return {
          title: repo.folder,
          description: repo.repo,
          value: repo.folder,
        }
      }),
      validate: async value => {
        try {
          const cwd = path.resolve(process.cwd(), config.repositoriesFolder, value)
          const response = await status(cwd)
          defaults.hasChanges = !response.isClean()
        } catch (err) {
          console.error(err)
        }
        return true
      },
    },
    {
      type: () => (defaults.hasChanges ? 'confirm' : null),
      name: 'confirmIgnoreChanges',
      message: 'This repo has changes, do you want to ignore them ?',
      initial: false,
    },
  ])
  const fullOptions = Object.assign({}, defaults, options, answers)
  if (!fullOptions.repoFolder) {
    throw new Error('Invalid repo.')
  }
  if (defaults.hasChanges && !fullOptions.confirmIgnoreChanges) {
    return
  }
  await removeRepo(fullOptions)
}
