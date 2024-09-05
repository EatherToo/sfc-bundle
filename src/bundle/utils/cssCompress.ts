function compressCss(css: string): string {
  // 移除所有注释
  css = css.replace(/\/\*[\s\S]*?\*\//g, '')

  // 移除所有换行符和制表符
  css = css.replace(/\n|\r|\t/g, '')

  // 移除多余的空格
  css = css.replace(/\s+/g, ' ')

  // 移除属性值前后的空格
  css = css.replace(/:\s*/g, ':')

  // 移除选择器之间的空格
  css = css.replace(/\s*,\s*/g, ',')

  // 移除大括号前后的空格
  css = css.replace(/\s*\{\s*/g, '{')
  css = css.replace(/\s*\}\s*/g, '}')

  // 移除分号后的空格
  css = css.replace(/;\s*/g, ';')

  // 移除属性名称后的空格
  css = css.replace(/\s*;/g, ';')

  // 移除逗号后的空格
  css = css.replace(/\s*,\s*/g, ',')

  return css
}

export default compressCss
