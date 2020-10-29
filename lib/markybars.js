module.exports.compile = compile

const hb = require('handlebars')
const fs = require('fs')

function compile (page, partials) {
  const markybars = hb.create()
  const pageContent = fs.readFileSync(page, 'utf8')

  Object.keys(partials).forEach(function (p) {
    const partialContent = fs.readFileSync(partials[p], 'utf8')
    markybars.registerPartial(p, '\n' + partialContent)
  })

  return markybars.compile(pageContent)
}
