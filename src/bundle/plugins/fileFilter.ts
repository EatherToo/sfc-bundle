import path from 'path'
import { PluginFactory } from './types'

const isLocalFile = (path: string) => {
  return (
    path.startsWith('.') || path.startsWith('/') || path.startsWith('vitural:')
  )
}

const FileFilterPlugin: PluginFactory = () => ({
  name: 'file-filter',
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      if (!isLocalFile(args.path)) {
        return {
          external: true,
        }
      }

      return {
        path: path.resolve(args.resolveDir, args.path),
      }
    })
  },
})

export default FileFilterPlugin
