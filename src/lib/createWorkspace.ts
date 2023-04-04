import path from 'node:path'
import { execSync } from 'node:child_process'
import { logIfPermitted } from '#src/lib/log'
import * as git from '#src/lib/git'
import { setWorkspaceConfig } from '#src/lib/workspaceConfig'

type createWorkspaceOptions = {
  workspaceName: string
  repositoriesFolder: string
  pushToGit: boolean
  githubAccessToken: string
  githubProjectName: string
  githubDefaultBranchName: string
  githubPrivateRepo: boolean
  githubLogin: string
  verbose: boolean
}

export const createWorkspace = async (options: createWorkspaceOptions) => {
  const {
    workspaceName,
    repositoriesFolder,
    pushToGit,
    githubAccessToken,
    githubProjectName,
    githubDefaultBranchName,
    githubPrivateRepo,
    githubLogin,
    verbose,
  } = options
  const cwd = process.cwd()
  const projCwd = path.resolve(cwd, workspaceName)
  const log = logIfPermitted(verbose)
  log('Starting workspace creation...')
  let repoUrl = ''
  if (pushToGit) {
    log('Creating github repo...')
    const { clone_url: cloneUrl } = await git.createRepo(
      githubAccessToken,
      githubProjectName,
      githubPrivateRepo,
      githubLogin,
      verbose,
    )
    repoUrl = cloneUrl
  }
  execSync(`${repositoriesFolder} >> .gitignore`, { cwd: projCwd })
  await setWorkspaceConfig(
    {
      workspaceName,
      repositoriesFolder,
      repositories: [],
    },
    projCwd,
  )
  if (pushToGit) {
    await git.initRepo(projCwd, repoUrl)
    await git.pull(projCwd, githubDefaultBranchName)
    await git.commitChanges(projCwd, 'chore: Initializing the workspace')
    await git.pushToRemote(projCwd, githubDefaultBranchName)
  }
  log('Done...')
}
