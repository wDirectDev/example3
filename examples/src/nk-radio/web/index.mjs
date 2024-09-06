import templateDefaultCss from "./default/index.css.mjs"
import templateDefaultHtml from "./default/index.html.mjs"
import templateDefaultScript from "./default/index.script.mjs"

export default (type) => {
    let template = {}
    template.default = {
        css: templateDefaultCss(),
        script: templateDefaultScript(),
        html: templateDefaultHtml()
    }
    return (template[`${type}`]) ? template[`${type}`] : (console.warn('type not found: ',`${type}`,'Set default'), template[`default`])
}