import { initRepos } from '#src/lib/initRepos'

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
  await initRepos(options)
}
