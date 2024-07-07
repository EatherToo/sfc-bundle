import * as compiler from 'vue/compiler-sfc'
import path from 'path'
import fs from 'fs'
import { build } from 'esbuild'
import VituralFilePlugin from './bundle/plugins/vituralFile'
import { createSSRApp, type Component } from 'vue'
import { renderToString } from 'vue/server-renderer'
import * as Vue from 'vue'
import defaultTemplate from './defaultTemplate'

type BuildOptions = {
  source: string
  filename: string
  data: any
  resolveDir?: string
  dependencies?: {
    [key: string]: string
  }
  template?: (htmlString: string, code: string) => string
}

export async function buildVue({
  source,
  filename,
  resolveDir,
  dependencies,
  template,
}: BuildOptions) {
  const parsedSrc = compiler.parse(source)
  const compiledScript = compiler.compileScript(parsedSrc.descriptor, {
    id: filename,
  })

  const compiledTemplate = compiler.compileTemplate({
    source: parsedSrc.descriptor.template?.content || '',
    filename,
    id: filename,
    compilerOptions: {
      bindingMetadata: compiledScript.bindings,
    },
  })

  const vituralFile: {
    [key: string]: string
  } = dependencies || {}
  vituralFile[`vitural:${filename}.script.${compiledScript.lang}`] =
    compiledScript.content
  vituralFile[`vitural:${filename}.template.${compiledScript.lang}`] =
    compiledTemplate.code
  vituralFile[`vitural:${filename}.style.css`] =
    parsedSrc.descriptor.styles[0].content

  // const app = createSSRApp({
  //   setup: () => ({
  //     ...data,
  //   }),
  //   render: compileToFunction(parsedSrc.descriptor.template?.content || '', {
  //     inSSR: true,
  //   }),
  //   components,
  // })

  // const htmlString = await renderToString(app)

  const buildServerRes = await build({
    stdin: {
      contents: `
      import appComp from 'vitural:${filename}.script.${compiledScript.lang}'
      import { render } from 'vitural:${filename}.template.${compiledScript.lang}'

      const __sfc__ = appComp

      __sfc__.render = render
      
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
      import appComp from 'vitural:${filename}.script.${compiledScript.lang}'
      import { render } from 'vitural:${filename}.template.${compiledScript.lang}'
      import 'vitural:${filename}.style.css'    

      const __sfc__ = appComp

      __sfc__.render = render
      const app = createSSRApp(__sfc__)
      app.mount('#app')

      `,
      resolveDir,
      sourcefile: filename,
    },
    plugins: [VituralFilePlugin(vituralFile, resolveDir)],
    external: ['vue'],
    platform: 'browser',
    target: ['chrome58', 'firefox57', 'safari11'],
    loader: {
      '.css': 'css',
    },
    minify: true,
    bundle: true,
    write: false,
    // outfile: path.resolve(__dirname, '../dist/client.js'),
  })

  const templateFn = template || defaultTemplate

  const html = templateFn(htmlString, buildClientsRes.outputFiles[0].text)
  return html
}
