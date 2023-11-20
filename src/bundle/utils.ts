import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as compiler from 'vue/compiler-sfc'

type Dep = {
  type: 'default' | 'named' | 'namespace'
  local: string
  imported?: string
}

type DepMap = {
  [key: string]: Dep
}

type Deps = {
  [key: string]: DepMap
}

export function getModuleInfo(source: string, filePath: string) {
  const ast = parser.parse(source, {
    sourceType: 'module',
  })

  const deps: Deps = {}
  traverse(ast, {
    ImportDeclaration({ node }) {
      const depThis: DepMap = node.specifiers.reduce<DepMap>((acc, cur) => {
        if (cur.type === 'ImportDefaultSpecifier') {
          acc['default'] = {
            type: 'default',
            local: cur.local.name,
          }
        } else if (cur.type === 'ImportSpecifier') {
          if (cur.imported.type === 'Identifier') {
            acc[cur.imported.name] = {
              type: 'named',
              local: cur.local.name,
              imported: cur.imported.name,
            }
          } else if (cur.imported.type === 'StringLiteral') {
            acc[cur.imported.value] = {
              type: 'named',
              local: cur.local.name,
              imported: cur.imported.value,
            }
          }
        } else if (cur.type === 'ImportNamespaceSpecifier') {
          acc[cur.local.name] = {
            type: 'namespace',
            local: cur.local.name,
          }
        }
        return acc
      }, {})
      deps[node.source.value] = depThis
    },
  })

  return {
    filePath,
    deps,
    code: source,
  }
}

export function buildSFC(source: {
  script: string
  template: string
  style: string
}) {
  const { script, template, style } = source

  const scriptAst = parser.parse(script, {
    sourceType: 'module',
  })

  const templateAst = parser.parse(template, {
    sourceType: 'module',
  })

  const sfcCompiled = `
  
  `
}

export function build(source: string, filename: string) {
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
  compiler.rewriteDefault

  return {
    script: compiledScript.content,
    template: compiledTemplate.code,
    style: compliedStyle.code,
  }
}
