import * as compiler from 'vue/compiler-sfc'
import path = require('path')
import { build } from 'esbuild'
import VituralFilePlugin from './bundle/plugins/vituralFile'
import FileFilterPlugin from './bundle/plugins/fileFilter'
import { Component, createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import fs = require('fs')

namespace global {
  export let TempApp: { __app__: Component | undefined }
}

export async function buildVue(source: string, filename: string) {
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
  } = {}
  vituralFile[`vitural:${filename}.script.js`] = compiledScript.content
  vituralFile[`vitural:${filename}.template.js`] = compiledTemplate.code
  vituralFile[`vitural:${filename}.style.css`] = compliedStyle.code
  global.TempApp = {
    __app__: undefined,
  }

  const buildServerRes = await build({
    stdin: {
      contents: `
      import { createSSRApp } from 'vue'
      import appComp from 'vitural:${filename}.script.js'
      import { render } from 'vitural:${filename}.template.js'
      // import 'vitural:${filename}.style.css'    

      const __sfc__ = appComp

      __sfc__.render = render
      global.TempApp.__app__ = __sfc__
      `,
      resolveDir: path.resolve(__dirname, '../'),
      sourcefile: filename,
    },

    plugins: [VituralFilePlugin(vituralFile), FileFilterPlugin()],
    format: 'iife',
    platform: 'node',
    target: ['node14'],
    loader: {
      '.css': 'css',
    },
    bundle: true,
    write: false,
    // outfile: path.resolve(__dirname, '../dist/server.js'),
  })

  eval(buildServerRes.outputFiles[0].text)
  const app = createSSRApp(global.TempApp.__app__!)
  delete global.TempApp.__app__
  const htmlString = await renderToString(app)
  const buildClientsRes = await build({
    stdin: {
      contents: `
      import { createSSRApp } from 'vue'
      import appComp from 'vitural:${filename}.script.js'
      import { render } from 'vitural:${filename}.template.js'
      import 'vitural:${filename}.style.css'    

      const __sfc__ = appComp

      __sfc__.render = render
      const app = createSSRApp(__sfc__)
      app.mount('#app')

      `,
      resolveDir: path.resolve(__dirname, '../'),
      sourcefile: filename,
    },
    plugins: [VituralFilePlugin(vituralFile, path.resolve(__dirname, '../'))],
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
      <title>Document</title>
    </head>
    <body>
      <div id="app">${htmlString}</div>
      <script type="text/javascript">
        ${buildClientsRes.outputFiles[0].text}
      </script>
    </body>
  `

  // if dist folder not exist, create it
  if (!fs.existsSync(path.resolve(__dirname, '../dist'))) {
    fs.mkdirSync(path.resolve(__dirname, '../dist'))
  }

  fs.writeFileSync(path.resolve(__dirname, '../dist/index.html'), html)
  return html
}
