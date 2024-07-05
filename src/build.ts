import * as compiler from 'vue/compiler-sfc'
import path from 'path'
import fs from 'fs'
import { build } from 'esbuild'
import VituralFilePlugin from './bundle/plugins/vituralFile'
import { createSSRApp, type Component } from 'vue'
import { renderToString } from 'vue/server-renderer'
import * as Vue from 'vue'

type BuildOptions = {
  source: string
  filename: string
  data: any
  resolveDir?: string
  dependencies?: {
    [key: string]: string
  }
}

export async function buildVue({
  source,
  filename,
  resolveDir,
  dependencies,
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

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      <script src="https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.min.js"></script>
      <title>Document</title>
      <style>
        * {
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div id="app-box" style="overflow-y: scroll;overflow-x:hidden;"> <div id="app" style="width:390px">${htmlString}</div></div>
     <script>
      var devicewidth = document.documentElement.clientWidth
      var deviceHeight = document.documentElement.clientHeight
      var appBoxEle = document.getElementById('app-box')
      appBoxEle.style.width = devicewidth + 'px'
      appBoxEle.style.height = deviceHeight + 'px'
      var appEle = document.getElementById('app')
      var scale = devicewidth / 390
      appEle.style.transform = 'scale(' + scale + ')'
      appEle.style.transformOrigin = '0 0'
      </script>
      <script type="text/javascript">

        if (typeof require === 'undefined') {
          var require = function(path) {
            if (path === 'vue') {
              return Vue
            }
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

  // fs.writeFileSync(path.resolve(__dirname, '../dist/index.html'), html)
  return html
}
