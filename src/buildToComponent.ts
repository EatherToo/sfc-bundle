import * as compiler from 'vue/compiler-sfc'
import { build } from 'esbuild'
import VituralFilePlugin from './bundle/plugins/vituralFile'
import compressCss from './bundle/utils/cssCompress'
type BuildSFCToComponentOptions = {
  source: string
  filename?: string
  cssSplit?: boolean
}
export async function buildSFCToComponent(options: BuildSFCToComponentOptions) {
  const { source, cssSplit } = options
  let { filename } = options
  if (!filename) {
    filename = 'default.vue'
  }
  // 将filename中的特殊字符替换为下划线
  filename = filename.replace(/[^\w]/g, '_')

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
  } = {}
  vituralFile[`vitural:${filename}.script.${compiledScript.lang}`] =
    compiledScript.content
  vituralFile[`vitural:${filename}.template.${compiledScript.lang}`] =
    compiledTemplate.code
  vituralFile[`vitural:${filename}.style.css`] =
    parsedSrc.descriptor.styles[0].content

  const importCss = cssSplit ? '' : `import 'vitural:${filename}.style.css'`

  const buildRes = await build({
    stdin: {
      contents: `
      import appComp from 'vitural:${filename}.script.${compiledScript.lang}'
      import { render } from 'vitural:${filename}.template.${compiledScript.lang}'
      ${importCss}   

      const __sfc__ = appComp

      __sfc__.render = render
      
      export default __sfc__
      `,

      sourcefile: filename,
    },
    external: ['vue'],
    plugins: [VituralFilePlugin(vituralFile, __dirname)],
    loader: {
      '.css': 'css',
    },
    minify: true,
    format: 'esm',
    bundle: true,
    write: false,
  })

  return {
    code: buildRes.outputFiles[0].text,
    css: compressCss(vituralFile[`vitural:${filename}.style.css`]),
  }
}
