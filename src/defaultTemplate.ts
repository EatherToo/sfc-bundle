export const htmlTemplateFactory = (
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
            src: url('https://s.influx.cash/assets/AaHouDiHei-BR3IE6vp.ttf') format('truetype');
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

const defaultTemplate = htmlTemplateFactory('title', 'favicon.ico')

export default defaultTemplate
