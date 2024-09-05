import * as compiler from 'vue/compiler-sfc'
import { build } from 'esbuild'
import VituralFilePlugin from './bundle/plugins/vituralFile'
import { createSSRApp, type Component } from 'vue'
import { renderToString } from 'vue/server-renderer'
import * as Vue from 'vue'
import defaultTemplate from './defaultTemplate'

type BuildOptions = {
  source: string
  filename: string
  resolveDir?: string
  dependencies?: {
    [key: string]: string
  }
  template?: (htmlString: string, code: string) => string
}

export async function buildToHtml({
  source,
  filename,
  resolveDir,
  dependencies,
  template,
}: BuildOptions) {
  if (!resolveDir) {
    resolveDir = __dirname
  }

  const vituralFile: {
    [key: string]: string
  } = dependencies || {}

  vituralFile[`vitural:source.js`] = source

  const buildServerRes = await build({
    stdin: {
      contents: `
      import __sfc__ from 'vitural:source.js'
      
      const app = createSSRApp(__sfc__)

      const htmlString = renderToString(app)
      export default htmlString
      `,
      resolveDir,
      sourcefile: filename,
    },
    external: ['vue'],
    plugins: [VituralFilePlugin(vituralFile, resolveDir)],
    globalName: 'buildServerSFC',
    // minify: true,
    format: 'iife',
    bundle: true,
    write: false,
  })

  const htmlString = await new Function(
    'Vue',
    'createSSRApp',
    'renderToString',
    `
    function require(path) {
      if (path === 'vue') {
        return Vue
      }
    }
    ${buildServerRes.outputFiles[0].text}
    return buildServerSFC.default
    `
  )(Vue, createSSRApp, renderToString)

  const buildClientsRes = await build({
    stdin: {
      contents: `
      import { createSSRApp } from 'vue'
      import __sfc__ from 'vitural:source.js'
      const app = createSSRApp(__sfc__)
      app.mount('#app')

      `,
      resolveDir,
      sourcefile: filename,
    },
    plugins: [VituralFilePlugin(vituralFile, resolveDir)],
    external: ['vue'],
    format: 'iife',
    platform: 'browser',
    target: ['chrome58', 'firefox57', 'safari11'],
    minify: true,
    bundle: true,
    write: false,
    // outfile: path.resolve(__dirname, '../dist/client.js'),
  })

  const templateFn = template || defaultTemplate

  const html = templateFn(htmlString, buildClientsRes.outputFiles[0].text)
  return html
}
