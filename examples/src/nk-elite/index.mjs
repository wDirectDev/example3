import wControl from "./modules/elite/index.mjs"
import wTemplate from "./web/index.mjs"

const getTemplate = (html) => {
  return new Promise(function (resolve, reject) {
    let container = document.createElement("container");
    let parser = new DOMParser();
    let body = parser.parseFromString(`${html}`, "text/html");
    if ( body != null ) {
      let object = body.getElementsByTagName("html-template")[0];
      if ( object != null ) {
	if ( `${object.innerHTML}`.trim() != "" ) {
          container.innerHTML = `${object.innerHTML}`;
          resolve(container);
        }
      }
    }
    resolve(null);
  });
}

const getScript = (script) => {
  return new Promise(function (resolve, reject) {
    let container = document.createElement("script");
    let parser = new DOMParser();
    let body = parser.parseFromString(`${script}`, "text/html");
    if ( body != null ) {
      let object = body.getElementsByTagName("javascript-template")[0];
      if ( object != null ) {
        if ( `${object.textContent}`.trim() != "" ) {
          container.type = "module";
          container.textContent = `${object.textContent}`;
          resolve(container);
        }
      }
    }
    resolve(null);
  })
}

const getCss = (css) => {
  return new Promise(function (resolve, reject) {
    let container = document.createElement("style");
    let parser = new DOMParser();
    let body = parser.parseFromString(`${css}`, "text/html");
    if ( body != null ) {
      let object = body.getElementsByTagName("css-template")[0];
      if ( object != null ) {
	if ( `${object.textContent}`.trim() != "" ) {
          container.textContent = `${object.textContent}`;
          resolve(container);
        }
      }
    }
    resolve(null);
  })
}

const properties = (self) => {
  return new Promise(function (resolve, reject) {
    let props = {};
    props.this = self;
    props.component = self.tagName.toLowerCase();
    resolve(props);
  })
}

const merge = (component) => {
  return new Promise(async (resolve, reject) => {
    component.template = (component.this.dataset.preset) ? await wTemplate(component.this.dataset.preset) : await wTemplate("default");

    let css = await getCss(component.template.css);
    let html = await getTemplate(component.template.html);    
    let script = await getScript(component.template.script);

    component.this.attachShadow({mode: "open"});
    if ( css != null ) component.this.shadowRoot.appendChild(css);
    if ( html != null ) component.this.shadowRoot.appendChild(html);
    if ( script != null ) component.this.shadowRoot.appendChild(script);

    resolve(component);
  })
}

const nkElite = class extends HTMLElement {
    constructor () {
        super();
        properties(this).then( (component) => { 
            merge(component).then( async component => {
                new (await wControl())(component);		
            } )
        } )
    }
}

if (customElements.get("nk-elite") === undefined) {
  customElements.define("nk-elite", nkElite );
}

export default { nkElite }
