module.exports.compile = compile

var hb = require('handlebars')
var marky = require('marky-markdown')
var fs = require('fs')

function compile (page, partials) {
  var markybars = hb.create()
  var pageContent = fs.readFileSync(page, 'utf8')

  Object.keys(partials).forEach(function (p) {
    var partialContent = fs.readFileSync(partials[p], 'utf8')
    markybars.registerPartial(p, partialContent)
  })

  markybars.registerHelper('markdown', function (data) {
    return new hb.SafeString(marky(data).html())
  })

  return markybars.compile(pageContent)
}
