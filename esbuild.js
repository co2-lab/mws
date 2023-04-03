const esbuild = require('esbuild')

esbuild
  .build({
    entryPoints: ['src/bin/mws.ts'],
    outfile: 'bin/mws',
    allowOverwrite: true,
    bundle: true,
    format: 'cjs',
    minify: true,
    packages: 'external',
    platform: 'node',
    sourcemap: true,
    target: 'node10',
    treeShaking: true,
    tsconfig: 'tsconfig.build.json',
    logLevel: 'info',
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
