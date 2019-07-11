#!/usr/bin/env node
var fs = require('fs')
var GitHubSlugger = require('github-slugger')
var markybars = require('./lib/markybars.js')
var path = require('path')
var pullOrClone = require('./lib/pull-or-clone.js')
var join = path.join
var sh = require('shelljs')
var resolve = require('path').resolve

var awesomePath = join('tmp/awesome-standard')
var buildPath = 'build'
var demoPath = join('tmp/standard-demo')
var mdPath = join('tmp/markdown')
var stdPath = join('tmp/standard')
var stdDocsPath = join('tmp/standard/docs')
var page = join('layout/page.html')
var demoPage = join('layout/demo.html')

var partials = {
  toc: join('layout/partials/toc.html'),
  scripts: join('layout/partials/scripts.html')
}

var slugger = new GitHubSlugger()

if (!sh.which('git')) {
  sh.echo('Sorry, this script requires git')
  sh.exit(1)
}

pullOrClone('https://github.com/standard/standard', stdPath)
pullOrClone('https://github.com/standard/awesome-standard', awesomePath)
pullOrClone('https://github.com/flet/standard-demo', demoPath)

sh.rm('-rf', buildPath)
sh.rm('-rf', mdPath)
sh.rm('-rf', 'dist')

sh.mkdir(buildPath)
sh.mkdir(mdPath)

sh.cp('-f', join('markdown/*.md'), mdPath)
sh.cp('-f', join(stdPath, '*.md'), mdPath)
sh.cp('-f', join(stdDocsPath, '*.md'), mdPath)
sh.cp('-f', join(awesomePath, 'README.md'), join(mdPath, 'awesome.md'))
var genPage = markybars.compile(page, partials)
var genDemo = markybars.compile(demoPage, partials)

var files = sh.ls(mdPath)
files.forEach(function (file) {
  var fileData = fs.readFileSync(join(mdPath, file), 'utf8')
  var name = path.parse(file).name
  var gen = name === 'demo' ? genDemo : genPage

  var htmlData = gen({ data: fileData, name: name.toLowerCase() })
  var fileName = slugger.slug(name) + '.html'

  fs.writeFileSync(join(buildPath, fileName), htmlData, 'utf8')
})

sh.find(buildPath)
  .filter(function (file) { return file.match(/\.html$/) })
  .forEach(function (f) {
    // replace all RULES.md instances in links with rules.html
    sh.sed('-i', /"(.*?)RULES(.*?)\.md/g, '"rules$2.html', f)

    sh.sed('-i', /"\.\.\/README.md/g, '"index.html', f)
    sh.sed('-i', /"(.*?)README(.*?)\.md/g, '"readme$2.html', f)

    sh.sed('-i', /"(docs\/|\.\.\/)?webstorm(.*?)\.md/g, '"webstorm$2.html', f)
  })

// rename files to be internet friendly
sh.mv('-f', join(buildPath, 'readme.html'), join(buildPath, 'index.html'))

// once everything is built, copy it to dist
sh.cp('-R', buildPath + '/', resolve(__dirname, 'dist'))
// copy standard-demo bundle.js to dist
sh.cp('-f', join(demoPath, 'bundle.js'), resolve(__dirname, 'dist', 'standard-demo.js'))

// copy static to dist
sh.cp('-R', 'static/', resolve(__dirname, 'dist'))
sh.cp('-R', 'static/.well-known', resolve(__dirname, 'dist'))

// remove tmp dir
sh.rm('-rf', 'tmp')
