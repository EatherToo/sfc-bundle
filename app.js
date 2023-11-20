import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

import comp from './dist/stdin.js'

const app = createSSRApp(comp)

const htmlString = await renderToString(app)
const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    
    <script>
      const app = Vue.createApp({
        data() {
          return {
            message: 'Hello Vue!'
          }
        }
      })
      app.mount('#app')
    </script>
    <title>Vue 3 SSR</title>
  </head>
  <body>
    ${htmlString}
  </body>
</html>

`

export default html
