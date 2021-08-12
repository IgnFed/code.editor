import Split from 'split-grid'
import {encode, decode} from 'js-base64'
import {editor} from 'monaco-editor';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import JsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

window.MonacoEnvironment = {
  getWorker(_ , label){
    if(label === 'html') return new HtmlWorker();
    if(label === 'css') return new CssWorker();
    if(label === 'javascript') return new JsWorker();
  }
}

const $ = (element)=> document.getElementById(element);
const $html = $("html"), 
      $css = $("css"), 
      $js = $("js");

const iframe = document.querySelector('.frame');


Split({
	columnGutters: [{
    track: 1,
    element: document.querySelector('.vertical-gutter'),
  }],
  rowGutters: [{
  	track: 1,
    element: document.querySelector('.horizontal-gutter'),
  }]
})

const {pathname} = window.location;

const [htmlCode,cssCode,jsCode] = pathname.slice(1).split("%7C");

const html = htmlCode ? decode(htmlCode): '',
      css= cssCode ? decode(cssCode) : '',
      js = jsCode ? decode(jsCode) : '';
      
const HtmlEditor = editor.create($html, {
  value: html,
  language: 'html',
  theme: 'vs-dark',
  minimap:{
    enabled: false,
  } 
})


const CssEditor = editor.create($css, {
  value: css,
  language: 'css',
  theme: 'vs-dark',
  minimap: false 
})

const JsEditor = editor.create($js, {
  value: js,
  language: 'javascript',
  theme: 'vs-dark',
  minimap: false 
})

HtmlEditor.onDidChangeModelContent(updateHtml)
CssEditor.onDidChangeModelContent(updateHtml)
JsEditor.onDidChangeModelContent(updateHtml)


const htmlPreview = createHtml({html,css,js})
iframe.setAttribute("srcdoc", htmlPreview);


function updateHtml(){

  const html = HtmlEditor.getValue(),
        css = CssEditor.getValue(),
        js = JsEditor.getValue();

  const hashedCode= `${encode(html)}|${encode(css)}|${encode(js)}`
  window.history.replaceState(null, null, `/${hashedCode}`)
  const htmlPreview = createHtml({html,css,js})
  iframe.setAttribute("srcdoc", htmlPreview);
}

function createHtml({html,css,js}){
    return `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
          <style>
            ${css}
          </style>
        </head>

        <body>
          ${html}
        </body>

        <script>
          ${js}
        </script>

      </html>
  
  `

}
