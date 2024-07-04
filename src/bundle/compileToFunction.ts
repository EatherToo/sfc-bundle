import { type RenderFunction } from 'vue'
import * as Vue from 'vue'
import { type CompilerOptions, compile } from '@vue/compiler-dom'
import fs from 'fs'
import path from 'path'

export default function compileToFunction(
  template: string,
  options?: CompilerOptions
): RenderFunction {
  const opts = {
    hoistStatic: true,
    ...(options || {}),
  }

  if (!opts.isCustomElement && typeof customElements !== 'undefined') {
    opts.isCustomElement = (tag) => !!customElements.get(tag)
  }

  const { code } = compile(template, opts)
  const render = new Function('Vue', code)(Vue) as RenderFunction

  return render
}
