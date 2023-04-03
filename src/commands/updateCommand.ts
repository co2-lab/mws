export const command = 'update'
export const desc = 'Update repositories from git'
export const builder = function (yargs) {}

export const handler = function (argv) {
  ;(async () => {
    await updateCommand({ verbose: !!argv.verbose })
  })().catch(err => {
    console.error(err)
    process.exit(1)
  })
}

export async function updateCommand(options: { verbose: boolean }) {
  console.log(options)
}
