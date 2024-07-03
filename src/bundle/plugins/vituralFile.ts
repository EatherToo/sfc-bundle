import { PluginFactory } from './types'

type VituralFile = {
  [key: string]: string
}

const VituralFilePlugin: PluginFactory = (
  vituralFile: VituralFile,
  resolveDir: string
) => ({
  name: 'vitural-file',
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      if (vituralFile[args.path]) {
        return {
          path: args.path,
          namespace: 'vitural-file',
        }
      }
    })

    build.onLoad({ filter: /.*/, namespace: 'vitural-file' }, (args) => {
      console.log(args.path)
      if (args.path.endsWith('.css')) {
        const stylesName =
          args.path.split('.').slice(0, -1).join('_').replace(':', '_') +
          '_style'

        const contents = `
        const ${stylesName} = window.document.querySelector('style')
        if (${stylesName}) {
          ${stylesName}.appendChild(window.document.createTextNode(\`${
          vituralFile[args.path]
        }\`))
        } else {
          const ${stylesName} = window.document.createElement('style')
          ${stylesName}.innerHTML = \`${vituralFile[args.path]}\`
          window.document.head.appendChild(${stylesName})
        }
        `

        return {
          contents,
          loader: 'js',
        }
      }

      if (args.path.endsWith('.ts')) {
        return {
          contents: vituralFile[args.path],
          resolveDir,
          loader: 'ts',
        }
      }

      return {
        contents: vituralFile[args.path],
        resolveDir,
        loader: 'js',
      }
    })
  },
})

export default VituralFilePlugin
