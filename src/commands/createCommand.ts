import fs from 'fs'
import prompts from 'prompts'
import { checkAccess } from '#src/lib/git'
import { createWorkspace } from '#src/lib/createWorkspace'

export const command = 'create'
export const desc = 'Create workspace'
export const builder = function (yargs) {}

export const handler = function (argv) {
  ;(async () => {
    await createCommand({ verbose: !!argv.verbose })
  })().catch(err => {
    console.error(err)
    process.exit(1)
  })
}

async function createCommand(options: { verbose: boolean }) {
  const { verbose } = options
  const defaults = {
    workspaceFolder: '.',
    workspaceName: 'workspace',
    repositoriesFolder: 'repositories',
    githubLogin: '',
    githubDefaultBranchName: 'main',
  }
  const answers = await prompts(
    [
      {
        type: 'text',
        name: 'workspaceFolder',
        message: 'Where is the workspace folder ?',
        initial: defaults.workspaceFolder,
        validate: async value => {
          return fs.existsSync(value)
        },
        error: 'Folder not exists',
      },
      {
        type: 'text',
        name: 'workspaceName',
        message: 'What will be the workspace name ?',
        initial: defaults.workspaceName,
      },
      {
        type: 'text',
        name: 'repositoriesFolder',
        message: 'What will be the name of the repositories folder ?',
        initial: defaults.repositoriesFolder,
      },
      {
        type: 'confirm',
        name: 'pushToGit',
        message: 'Do you want to push it to github ?',
        initial: true,
      },
      {
        type: prev => (prev === true ? 'password' : null),
        name: 'githubAccessToken',
        message: 'What Github Personal Access Token can I use ?',
        validate: async value => {
          const login = await checkAccess(value, verbose)
          defaults.githubLogin = login
          return !!login
        },
        error: 'Invalid Github Personal Access Token',
      },
      {
        type: prev => (prev ? 'text' : null),
        name: 'githubProjectName',
        message: 'What will be the Github project name ?',
        initial: (prev, values, prompt) => {
          return values.workspaceName
        },
      },
      // {
      //   type: prev => (prev ? 'text' : null),
      //   name: 'githubDefaultBranchName',
      //   message: 'What will be the default branch name ?',
      //   initial: defaults.githubDefaultBranchName,
      // },
      {
        type: prev => (prev ? 'confirm' : null),
        name: 'githubPrivateRepo',
        message: 'Do you want to make the repo private ?',
        initial: true,
      },
    ],
    {
      onCancel: () => {
        console.log('canceled by user')
        process.exit(1)
      },
    },
  )
  const fullOptions = Object.assign({}, defaults, options, answers)
  if (!fullOptions.workspaceName) {
    throw new Error('The workspace name is required')
  }
  if (!fullOptions.repositoriesFolder) {
    throw new Error('The name of the repositories folder is required')
  }
  await createWorkspace(fullOptions)
}
