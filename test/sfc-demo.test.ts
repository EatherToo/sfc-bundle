import path from 'path'
import fs from 'fs'
import { buildVue } from '../src/build'
import { Icon } from '@iconify/vue'
import Tweet from 'vue-tweet'
import { vueTweet } from './vueTweer'
import { iconify } from './iconify'

describe('Dummy test', () => {
  it('test parse', async () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, './demo.vue'),
      'utf-8'
    )
    await buildVue({
      source,
      filename: 'demo.vue',
      resolveDir: __dirname,
      dependencies: {
        'vue-tweet': vueTweet,
        '@iconify/vue': iconify,
      },
      components: {
        Icon,
        Tweet,
      },
    })
  })
})
