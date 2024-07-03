import * as compiler from 'vue/compiler-sfc'
import path from 'path'
import { build } from 'esbuild'
import VituralFilePlugin from './bundle/plugins/vituralFile'
import FileFilterPlugin from './bundle/plugins/fileFilter'
import { type Component, createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import fs from 'fs'

type BuildOptions = {
  source: string
  filename: string
  resolveDir?: string
  dependencies?: {
    [key: string]: string
  }
  components?: Record<string, Component>
}

export async function buildVue({
  source,
  filename,
  resolveDir,
  dependencies,
  components,
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

  const compliedStyle = compiler.compileStyle({
    source: parsedSrc.descriptor.styles[0].content,
    filename,
    id: filename,
  })

  const vituralFile: {
    [key: string]: string
  } = dependencies || {}
  vituralFile[`vitural:${filename}.script.${compiledScript.lang}`] =
    compiledScript.content
  vituralFile[`vitural:${filename}.template.${compiledScript.lang}`] =
    compiledTemplate.code
  vituralFile[`vitural:${filename}.style.css`] = compliedStyle.code

  const app = createSSRApp({
    setup: () => ({
      shopInfo: {
        name: 'shop name',
      },
    }),
    template: parsedSrc.descriptor.template?.content,
    components,
  })

  const htmlString = await renderToString(app)
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

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
      <title>Document</title>
      <style>
        * {
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div id="app">${htmlString}</div>
      <script type="text/javascript">
      const require = (path) => {
        if (path === 'vue') {
          return Vue
        }
      }
        ${buildClientsRes.outputFiles[0].text}
      </script>
    </body>
  `

  // if dist folder not exist, create it
  // if (!fs.existsSync(path.resolve(__dirname, '../dist'))) {
  //   fs.mkdirSync(path.resolve(__dirname, '../dist'))
  // }

  fs.writeFileSync(path.resolve(__dirname, '../dist/index.html'), html)
  return html
}
