import path from 'path'
import fs from 'fs'
import { buildVue } from '../src/build'

describe('Dummy test', () => {
  it('test parse', async () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, './demo.vue'),
      'utf-8'
    )
    console.log(await buildVue(source, 'demo.vue'))
  })
})
