import path from 'node:path'
import prompts from 'prompts'
import { initRepos } from '#src/lib/initRepos'
import { loadWorkspaceConfig, setWorkspaceConfig } from '#src/lib/workspaceConfig'

export const command = 'init'
export const desc = 'Init repositories from git'
export const builder = function (yargs) {}

export const handler = function (argv) {
  ;(async () => {
    await initCommand({ verbose: !!argv.verbose })
  })().catch(err => {
    console.error(err)
    process.exit(1)
  })
}

async function initCommand(options: { verbose: boolean }) {
  const config = loadWorkspaceConfig()
  const defaults = {
    workspaceName: config.workspaceName ? config.workspaceName : path.dirname(process.cwd()),
    repositoriesFolder: config.repositoriesFolder ? config.repositoriesFolder : 'modules',
  }
  const answers = await prompts(
    [
      {
        type: 'text',
        name: 'workspaceName',
        message: 'What will be the workspace name ?',
        initial: defaults.workspaceName,
        validate: value => !!value,
        error: 'the workspace name cannot be empty',
      },
      {
        type: 'text',
        name: 'repositoriesFolder',
        message: 'What will be the name of the repositories folder ?',
        initial: defaults.repositoriesFolder,
        validate: value => !!value,
        error: 'the name of the repositories folder cannot be empty',
      },
    ],
    {
      onCancel: () => {
        console.log('canceled by user')
        process.exit(1)
      },
    },
  )
  if (!answers.workspaceName) {
    throw new Error('The workspace name is required')
  }
  if (!answers.repositoriesFolder) {
    throw new Error('The name of the repositories folder is required')
  }
  Object.assign(config, answers)
  await setWorkspaceConfig(config)
  await initRepos(options)
}
