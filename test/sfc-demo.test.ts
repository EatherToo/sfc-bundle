import path from 'path'
import fs from 'fs'
import { buildVue } from '../src/build'
describe('Dummy test', () => {
  it('test parse', async () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, './demo.vue'),
      'utf-8'
    )
    const vueTweet = fs.readFileSync(
      path.resolve(__dirname, './vue-tweet.js'),
      'utf-8'
    )

    const iconify = fs.readFileSync(
      path.resolve(__dirname, './iconify.mjs'),
      'utf-8'
    )
    await buildVue({
      source,
      data: {
        shopInfo: {
          name: 'test',
          description: 'test',
          contacts: [
            {
              type: 'facebook',
              url: 'test',
            },
          ],
          benefits: ['test'],
          goods: [
            {
              id: 1,
              name: 'test',
              img: 'test',
              price: 100,
            },
          ],
          img: '',
          show_home_goods_ids: '',
          posts: [
            {
              type: 'twitter',
              url: 'https://x.com/aestheticspost_/status/1797368981688340786',
            },
          ],
        },
        ContactIcons: {
          facebook: 'logos:facebook',
          instagram: 'skill-icons:instagram',
          tiktok: 'logos:tiktok-icon',
          twitter: 'devicon:twitter',
          whatsapp: 'logos:whatsapp-icon',
          youtube: 'logos:youtube-icon',
          telegram: 'logos:telegram',
          messenger: 'logos:messenger',
        },
      },
      filename: 'demo.vue',
      resolveDir: __dirname,
      dependencies: {
        'vue-tweet': vueTweet,
        '@iconify/vue': iconify,
      },
    })
  })
})
