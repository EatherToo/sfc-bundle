const defaultTemplate = (htmlString: string, code: string) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      <script src="https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.min.js"></script>
      <link rel="stylesheet" href="https://influx.eather.cn/font.css">
      <title>Document</title>
      <style>
        * {
          margin: 0;
          padding: 0;
        }
        #app-box {
          margin: 0 auto;
        }
      </style>
    </head>
    <body>
      <div id="app-box" style="overflow-y: scroll;overflow-x:hidden;"> <div id="app" style="width:390px">${htmlString}</div></div>
     <script>
      var devicewidth = document.documentElement.clientWidth
      var deviceHeight = document.documentElement.clientHeight
      if (devicewidth > 520) {
        devicewidth = 520
      }
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
        ${code}
      </script>
      
    </body>
  `
}

export default defaultTemplate
