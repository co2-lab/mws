import fs from 'fs'
import path from 'path'
import * as git from '#src/lib/git'
import { logIfPermitted } from '#src/lib/log'
import { loadWorkspaceConfig } from '#src/lib/workspaceConfig'
import { ensureDirSync } from './fs-extra'

type initReposOptions = {
  verbose: boolean
}

export const initRepos = async (options: initReposOptions) => {
  const { verbose } = options
  const cwd = process.cwd()
  const log = logIfPermitted(verbose)
  const config = loadWorkspaceConfig()
  const repositoriesFolderPath = path.resolve(cwd, config.repositoriesFolder)
  if (!fs.existsSync(repositoriesFolderPath)) {
    ensureDirSync(repositoriesFolderPath)
  }
  log('initializing workspace...')
  for (const repository of config.repositories ?? []) {
    const repoPath = path.resolve(repositoriesFolderPath, repository.folder)
    if (!fs.existsSync(repoPath)) {
      await git.clone(repositoriesFolderPath, repository.repo)
    }
    if (repository.branch) {
      await git.switchAndCreateBranchIfNotExists(repoPath, repository.branch)
      await git.pull(repoPath, repository.branch)
    }
    if (repository.tag) {
      await git.checkoutTag(repoPath, repository.tag)
      await git.pull(repoPath, repository.tag)
    }
  }
  log('Done...')
}
