import path from 'path'
import fs, { writeFileSync } from 'fs'
import { buildVue } from '../src/build'
import { buildSFCToComponent } from '../src/buildToComponent'
import { buildToHtml } from '../src/buildToHtml'

const htmlTemplateFactory = (
  title: string,
  ico: string,
  options?: {
    script?: string[]
    style?: string[]
  }
) => {
  return (htmlString: string, code: string) => {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        ${options?.script?.join('\n') || ''}
        ${options?.style?.join('\n') || ''}
        <script src="https://s.influx.cash/assets/vue.runtime.global.prod.js"></script>
        <link rel="icon" href="${ico}" />
        <title>${title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          #app {
            max-width: 600px;
            margin: 0 auto;
          }

          @font-face {
            font-family: AaHouDiHei;
            font-weight: 400;
            font-style: normal;
            src: url('/assets/AaHouDiHei-BR3IE6vp.ttf') format('truetype');
          }

        </style>
      </head>
      <body>
       <div id="app">${htmlString}</div>
       <script>
         ;(function flexible(b,c){var d=c.documentElement;var f=b.devicePixelRatio||1;function setBodyFontSize(){if(c.body){c.body.style.fontSize=12*f+'px'}else{c.addEventListener('DOMContentLoaded',setBodyFontSize)}}setBodyFontSize();function setRemUnit(){if(b.document.documentElement.clientWidth>600){b.document.documentElement.style.fontSize='60px'}else{var a=d.clientWidth/10;d.style.fontSize=a+'px'}}setRemUnit();b.addEventListener('resize',setRemUnit);b.addEventListener('pageshow',function(e){if(e.persisted){setRemUnit()}});if(f>=2){var g=c.createElement('body');var h=c.createElement('div');h.style.border='.5px solid transparent';g.appendChild(h);d.appendChild(g);if(h.offsetHeight===1){d.classList.add('hairlines')}d.removeChild(g)}})(window,document);
        </script>
        <script type="text/javascript">
         if(typeof require==='undefined'){var require=function(path){if(path==='vue'){return Vue}}};${code}
        </script>

      </body>
    `
  }
}

describe('Dummy test', () => {
  it('test parse', async () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, './candy-1.js'),
      'utf-8'
    )
    const css = fs.readFileSync(
      path.resolve(__dirname, './candy-1.css'),
      'utf-8'
    )

    const html = await buildToHtml({
      source: source,
      filename: 'demo.vue',
      resolveDir: __dirname,
      data: {
        window: {
          __INITIAL_SHOP_INFO__: {
            id: '',
            shop_unique_name: '',
            shop_name: 'rgrtghhyt',
            shop_description: '',
            img: '',
            shop_logo: '',
            benefits: '',
            user_id: '',
            show_goods_ids: '',
            shop_home_page_id: '',
            background_color: '',
            button_colors: '',
            whatsapp: '',
            whatsapp_group: '',
            create_time: '',
            update_time: '',
          },
        },
        localStorage: {
          getItem: (k: string) => '',
          setItem: (key: string, value: string) => {},
          removeItem: (key: string) => {},
          clear: () => {},
          length: 0,
          key: (index: string) => '',
        },
      },
      template: htmlTemplateFactory(
        'demo',
        'https://influx.eather.cn/favicon.ico',
        {
          script: [
            `<script>window.__INITIAL_SHOP_INFO__ = ${JSON.stringify({
              id: '',
              shop_unique_name: '',
              shop_name: 'rgrtghhyt',
              shop_description: '',
              img: '',
              shop_logo: '',
              benefits: '',
              user_id: '',
              show_goods_ids: '',
              shop_home_page_id: '',
              background_color: '',
              button_colors: '',
              whatsapp: '',
              whatsapp_group: '',
              create_time: '',
              update_time: '',
            })};</script>`,
          ],
          style: [`<style>${css}</style>`],
        }
      ),
    })
    writeFileSync(path.resolve(__dirname, './index.html'), html)
  })
})
